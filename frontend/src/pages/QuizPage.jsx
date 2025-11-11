import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getUserFromToken } from "../utils/auth";
import toast from "react-hot-toast";
import { Check } from "lucide-react";


export default function QuizPage() {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  // Fetch quiz questions
  useEffect(() => {
    axios
      .get(`http://localhost:5000/quiz/${courseId}`)
      .then((res) => {
        setQuestions(res.data.questions || res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      courseId,
      answers: Object.entries(answers).map(([index, selectedOption]) => ({
        questionIndex: Number(index),
        selectedOption,
      })),
    };

    try {
      // ✅ Submit quiz answers
      const res = await axios.post(
        "http://localhost:5000/quiz/submit",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(res.data);

      // ✅ Update progress for this course (mark quiz complete)
      try {
  await axios.post(
    "http://localhost:5000/progress/update",
    {
      courseId,
      completedLessons: [],
      quizCompleted: true,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  toast.success("🎉 Course completed! Great job!");
} catch (progressErr) {
  console.error("Quiz progress update failed", progressErr);
  toast.error("Progress update failed.");
}
    } catch (err) {
      console.error("Quiz submission failed", err);
      toast.error("Quiz submission failed.");
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!questions.length) return <p>No quiz found for this course.</p>;

  return (
    <div className="max-w-3xl translate-y-3/4 mx-auto bg-gray-900 border border-gray-700 shadow p-6 rounded-xl">
      <h2 className="text-2xl jura-bold mb-4 text-blue-400">Course Quiz</h2>

      {score ? (
        <div className="text-center">
          <h3 className="text-xl jura-semibold text-green-600">Your Score</h3>
          <p className="jura-regular text-gray-400">Total Questions: {score.totalQuestions}</p>
          <p className="jura-regular text-gray-400">Correct Answers: {score.correctAnswers}</p>
         <div className="flex items-center justify-center gap-2 text-lg text-white jura-bold font-bold mt-2">
  <span>{score.scorePercentage}%</span>
  <Check className="text-green-600" />
</div>

        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((q, i) => (
            <div key={i} className="mb-6 border-b border-gray-700 pb-3">
              <h4 className="jura-semibold text-white mb-2">
                {i + 1}. {q.question}
              </h4>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className="flex items-center jura-regular text-gray-300 space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleSelect(i, opt)}
                      className="accent-green-600"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="cursor-pointer jura-regular text-white px-4 py-2 rounded-lg border border-blue-700 hover:bg-blue-700"
          >
            Submit Quiz
          </button>
        </form>
      )}
    </div>
  );
}
