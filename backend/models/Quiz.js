import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);
