import express from "express";
import jwt from "jsonwebtoken";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

const router = express.Router();

// 🔐 verify token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ➤ Fetch progress
router.get("/:userId/:courseId", verifyToken, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.params.userId,
      courseId: req.params.courseId
    });
    if (!progress)
      return res.json({ completionPercent: 0, message: "No progress yet" });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Update or create progress
router.post("/update", verifyToken, async (req, res) => {
  try {
    const { courseId, completedLessons, quizCompleted } = req.body;
    const userId = req.user.id;

    // calculate completion %
    let completion = 0;
    const course = await Course.findById(courseId);
    const totalLessons = course?.videos?.length || 1;
    const watched = completedLessons?.length || 0;
    completion = (watched / totalLessons) * 100;
    if (quizCompleted) completion = Math.min(100, completion + 10); // add 10 % bonus for quiz

    const updated = await Progress.findOneAndUpdate(
      { userId, courseId },
      { completedLessons, quizCompleted, completionPercent: completion },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
