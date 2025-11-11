import express from "express";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ➤ Create new course (Instructor or Admin only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, videos } = req.body;
    const course = await Course.create({
      title,
      description,
      instructor: req.user.id,
      videos,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ Get courses
router.get("/", async (req, res) => {
  try {
    let courses;

    const authHeader = req.headers.authorization;
    let user = null;

    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        user = null;
      }
    }

    if (user && user.role === "instructor") {
      courses = await Course.find({ instructor: user.id }).populate("instructor", "name email");
    } else {
      courses = await Course.find().populate("instructor", "name email");
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ➤ Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Update course (Instructor/Admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role !== "admin" &&
      req.user.id !== course.instructor.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Delete course (Instructor/Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (
      req.user.role !== "admin" &&
      req.user.id !== course.instructor.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
