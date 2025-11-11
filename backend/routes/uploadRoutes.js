import express from "express";
import multer from "multer";
import supabase from "../utils/supabaseClient.js";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * 🔹 Upload course video (used in both create-course & dashboard)
 */
router.post("/:courseId/video", verifyToken, upload.single("video"), async (req, res) => {
  console.log("🟢 Upload request received");

  try {
    // 1️⃣ Verify instructor
    if (req.user.role !== "instructor") {
      console.log("🚫 Access denied: user not instructor");
      return res.status(403).json({ message: "Access denied" });
    }

    // 2️⃣ Check file and course
    const { courseId } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No video file provided" });

    console.log("📁 File:", file.originalname, file.mimetype, file.size);

    // 3️⃣ Upload to Supabase bucket
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log("⬆️ Uploading:", fileName);

    const { data, error } = await supabase.storage
      .from("course-videos")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw error;
    console.log("✅ Uploaded to Supabase:", data.path);

    // 4️⃣ Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from("course-videos")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log("🌐 Public URL:", publicUrl);

    // 5️⃣ Save video URL to MongoDB
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.videos.push(publicUrl);
    await course.save();

    console.log("💾 Saved video to MongoDB");
    res.json({ message: "✅ Video uploaded!", url: publicUrl });
  } catch (err) {
    console.error("💥 Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔹 Delete video from Supabase + MongoDB
 */
router.delete("/:courseId/video", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "instructor")
      return res.status(403).json({ message: "Access denied" });

    const { courseId } = req.params;
    const { fileUrl } = req.body;
    const fileName = fileUrl.split("/course-videos/")[1];
    console.log("🗑️ Deleting from Supabase:", fileName);

    const { error: deleteError } = await supabase.storage
      .from("course-videos")
      .remove([fileName]);

    if (deleteError) throw deleteError;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.videos = course.videos.filter((v) => v !== fileUrl);
    await course.save();

    console.log("✅ Deleted from Supabase & MongoDB");
    res.json({ message: "✅ Video deleted successfully!" });
  } catch (err) {
    console.error("💥 Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
