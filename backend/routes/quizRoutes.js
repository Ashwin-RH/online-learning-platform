import express from "express";
import jwt from "jsonwebtoken";
import Quiz from "../models/Quiz.js";
import Course from "../models/Course.js";

const router = express.Router();

// Middleware: verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded); // ✅ Debug: see user role
    next();
  } catch (err) {
    console.error("Token error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// ➤ Submit answers
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { courseId, answers } = req.body;
    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      const userAns = answers.find(a => a.questionIndex === i);
      if (userAns && userAns.selectedOption === q.correctAnswer) score++;
    });

    res.json({
      totalQuestions: quiz.questions.length,
      correctAnswers: score,
      scorePercentage: ((score / quiz.questions.length) * 100).toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Create quiz (Instructor/Admin only)
router.post("/:courseId", verifyToken, async (req, res) => {
  try {
    if (!["instructor", "admin"].includes(req.user.role))
      return res.status(403).json({ message: "Access denied" });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { questions } = req.body;
    const quiz = await Quiz.create({ courseId: course._id, questions });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get quiz questions (without correctAnswer)
router.get("/:courseId", async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const safeQuestions = quiz.questions.map(q => ({
      question: q.question,
      options: q.options
    }));

    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
