import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// 👑 Admin-only analytics
router.get("/stats", verifyToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const [users, courses, enrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Progress.countDocuments(),
    ]);

    res.json({
      users,
      courses,
      enrollments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
