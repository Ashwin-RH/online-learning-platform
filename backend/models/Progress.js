import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedLessons: { type: [String], default: [] },   // store lesson IDs or titles
  quizCompleted: { type: Boolean, default: false },
  completionPercent: { type: Number, default: 0 }      // 0–100 %
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
