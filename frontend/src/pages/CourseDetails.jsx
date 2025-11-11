import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getUserFromToken } from "../utils/auth";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const token = localStorage.getItem("token");
  const user = getUserFromToken();

 useEffect(() => {
  axios
    .get(`http://localhost:5000/courses/${id}`)
    .then((res) => {
      const videoUrl = res.data.videos[0];
      const embedUrl = videoUrl.includes("watch?v=")
        ? videoUrl.replace("watch?v=", "embed/")
        : videoUrl;

      setCourse(res.data);
      setCurrentVideo(embedUrl);
    })
    .catch((err) => console.error(err));
}, [id]);

  // Fetch existing progress
  useEffect(() => {
    if (user && enrolled) {
      axios
        .get(`http://localhost:5000/progress/${user.id}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProgress(res.data.completionPercent || 0))
        .catch(() => {});
    }
  }, [user, enrolled, id, token]);

  const handleEnroll = () => setEnrolled(true);

  // Mark lesson as watched
  const markLessonComplete = async (videoUrl) => {
    if (!completedLessons.includes(videoUrl)) {
      const updatedLessons = [...completedLessons, videoUrl];
      setCompletedLessons(updatedLessons);

      try {
        const res = await axios.post(
          "http://localhost:5000/progress/update",
          {
            courseId: id,
            completedLessons: updatedLessons,
            quizCompleted: false,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProgress(res.data.completionPercent);
      } catch (err) {
        console.error("Progress update failed", err);
      }
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-gray-900/40 shadow-lg shadow-black/20 p-6 rounded-2xl my-10 border border-gray-700 mt-25">
      <h2 className="text-2xl text-gray-400 jura-bold mb-2">{course.title}</h2>
      <p className="text-gray-500 jura-regular mb-4">{course.description}</p>
      <p className="text-sm text-gray-400/70 jura-regular mb-6">
        Instructor: {course.instructor?.name || "Unknown"}
      </p>

      {!enrolled ? (
        <button
          onClick={handleEnroll}
          className="bg-gray-800 cursor-pointer jura-regular border border-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enroll Now
        </button>
      ) : (
        <div>
          {/* ✅ Progress Bar */}
          <div className="w-full bg-gray-200 rounded-xl h-2 mb-4">
            <div
              className="bg-green-500 h-2 rounded-xl transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm jura-semibold text-gray-400/70 mb-4">
            Course Progress: {progress.toFixed(0)}%
          </p>

          {/* Video Section */}
          <h3 className="text-lg text-gray-400 jura-semibold mb-3">Course Videos</h3>
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              src={currentVideo}
              title="Course video"
              allowFullScreen
              className="w-full h-64 rounded"
            ></iframe>
          </div>

          <div className="flex flex-wrap gap-2 rounded-xl mb-6">
            {course.videos.map((v, i) => (
              <button
                key={i}
                onClick={() => {
                const embedUrl = v.includes("watch?v=")
                  ? v.replace("watch?v=", "embed/")
                  : v;
                setCurrentVideo(embedUrl);
                markLessonComplete(v);
              }}

                className={`px-3 py-1 rounded jura-bold border ${
                  completedLessons.includes(v)
                    ? "border-green-600 text-gray-300 bg-green-900/20"
                    : currentVideo === v
                    ? "border-blue-600 bg-blue-900/20 text-blue-300"
                    : "border-gray-600 text-gray-300"
                }`}
              >
                Lesson {i + 1}
              </button>
            ))}
          </div>

          <Link
            to={`/quiz/${course._id}`}
            className="inline-block jura-bold border border-green-600 text-green-400 px-4 py-2 rounded-lg hover:rounded-xl hover:bg-green-900/20"
          >
            Take Quiz
          </Link>
        </div>
      )}
    </div>
  );
}
