import express from "express";
import jwt from "jsonwebtoken";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

const router = express.Router();

// Middleware to verify token (same as before)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ➤ Create new lesson (Instructor/Admin only)
router.post("/:courseId", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { title, description, videoUrl } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = await Lesson.create({ courseId: course._id, title, description, videoUrl });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all lessons for a course
router.get("/:courseId", async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Stream a single lesson (simulate secure streaming)
router.get("/watch/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // For real apps: stream from S3/Supabase with signed URLs
    res.json({ videoUrl: lesson.videoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
