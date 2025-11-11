import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", videos: [""] });
  const [message, setMessage] = useState("");
  const [quizForms, setQuizForms] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const token = localStorage.getItem("token");

  // Fetch all courses (instructors see all, ideally their own)
useEffect(() => {
  axios
    .get("http://localhost:5000/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setCourses(res.data))
    .catch((err) => console.error(err));
}, [token]);



  // Add new course
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/courses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Course created successfully!");
      setForm({ title: "", description: "", videos: [""] });
      const refreshed = await axios.get("http://localhost:5000/courses");
      setCourses(refreshed.data);
    } catch (err) {
      setMessage("❌ Failed to create course. Check role/token.");
    }
  };

   // ✳️ Add new question to a quiz
  const addQuestion = (courseId) => {
    setQuizForms({
      ...quizForms,
      [courseId]: [
        ...(quizForms[courseId] || []),
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  // ✳️ Update question, option, or correct answer
  const updateQuizField = (courseId, qIndex, field, value, optIndex = null) => {
    const updatedQuiz = [...(quizForms[courseId] || [])];
    if (field === "options" && optIndex !== null) {
      updatedQuiz[qIndex].options[optIndex] = value;
    } else {
      updatedQuiz[qIndex][field] = value;
    }
    setQuizForms({ ...quizForms, [courseId]: updatedQuiz });
  };

  // ✳️ Submit quiz for a course
  const userRole = JSON.parse(atob(token.split(".")[1])).role;

const handleQuizSubmit = async (courseId) => {
  if (!["instructor", "admin"].includes(userRole)) {
    alert("❌ Only instructors or admins can create quizzes!");
    return;
  }

  try {
    await axios.post(
      `http://localhost:5000/quiz/${courseId}`,
      { questions: quizForms[courseId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("✅ Quiz created successfully!");
    setQuizForms({ ...quizForms, [courseId]: [] });
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create quiz. Check permissions or backend.");
  }
};

  // Update existing course
  const handleUpdate = async (id) => {
    const updatedTitle = prompt("Enter new course title:");
    if (!updatedTitle) return;
    try {
      await axios.put(
        `http://localhost:5000/courses/${id}`,
        { title: updatedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Course updated!");
      const refreshed = await axios.get("http://localhost:5000/courses");
      setCourses(refreshed.data);
    } catch {
      setMessage("❌ Failed to update course.");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("🗑️ Course deleted!");
      setCourses(courses.filter((c) => c._id !== id));
    } catch {
      setMessage("❌ Failed to delete course.");
    }
  };

  // Add new video input field
  const addVideoField = () => {
    setForm({ ...form, videos: [...form.videos, ""] });
  };

  // Update a specific video link
  const updateVideo = (index, value) => {
    const updatedVideos = [...form.videos];
    updatedVideos[index] = value;
    setForm({ ...form, videos: updatedVideos });
  };

  return (
    <div className="max-w-5xl mt-15 mx-auto p-6">
      <h1 className="text-2xl jura-semibold mb-4 text-gray-400">Instructor Dashboard</h1>
      <p className="text-sm jura-regular text-gray-400 mb-6">
        Manage your courses and upload new ones.
      </p>

      {/* ✅ Create Course Form */}
<form
  onSubmit={async (e) => {
  e.preventDefault();

  if (!form.title || !form.description) {
    toast.error("Please fill in all fields!");
    return;
  }

  const file = e.target.video?.files?.[0];
  if (!file) {
    toast.error("Please select a video!");
    return;
  }

  try {
    // 1️⃣ Create the course first
    const createRes = await axios.post(
      "http://localhost:5000/courses",
      { title: form.title, description: form.description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const courseId = createRes.data._id; // backend should return the new course
    console.log("📘 Created course:", courseId);

    // 2️⃣ Upload video to the same Supabase bucket
    const formData = new FormData();
    formData.append("video", file);

    const uploadRes = await axios.post(
      `http://localhost:5000/upload/${courseId}/video`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("✅ Course and video uploaded!");
    console.log("🎬 Uploaded video:", uploadRes.data.url);

    // 3️⃣ Refresh UI
    const refreshed = await axios.get("http://localhost:5000/courses");
    setCourses(refreshed.data);
    setForm({ title: "", description: "", videos: [""] });
    e.target.reset();
  } catch (err) {
    console.error("❌ Error creating course:", err);
    toast.error("Course creation failed!");
  }
}}

  className="bg-gray-950 shadow-2xl hover:shadow-gray-500/20 p-5 rounded-lg transition-all duration-500 border border-gray-700 mb-6"
>
  <h2 className="text-lg text-gray-400 jura-semibold mb-3">Add New Course</h2>

  <input
    className="w-full border jura-regular border-gray-700 placeholder-gray-600 bg-gray-900 text-white p-2 mb-2 rounded-lg outline-none focus:border-blue-500/40 transition"
    placeholder="Course Title"
    value={form.title}
    onChange={(e) => setForm({ ...form, title: e.target.value })}
    required
  />

  <textarea
    className="w-full border jura-regular border-gray-700 placeholder-gray-600 bg-gray-900 text-white p-2 mb-3 rounded-lg outline-none focus:border-blue-500/40 transition"
    placeholder="Course Description"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    required
  ></textarea>

  {/* 🎬 Upload Video */}
  <input
    type="file"
    name="video"
    accept="video/*"
    className="w-full mb-3 p-2 text-sm jura-regular text-gray-300 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer 
    file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
    file:bg-blue-600/60 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
  />

  <button
    type="submit"
    className="bg-blue-800/20 jura-regular border border-blue-600/70 text-gray-400 hover:text-gray-300 text-sm px-3 py-2 rounded hover:rounded-lg duration-300 cursor-pointer"
  >
    Create Course
  </button>
</form>


      {/* ✅ Message */}
      {message && <p className="text-center text-gray-700 mb-4">{message}</p>}

       {/* ✅ Existing Courses */}
      <h2 className="text-xl jura-semibold text-gray-400 mb-4 tracking-wide">
  Your Courses
</h2>

{courses.length === 0 ? (
  <p className="text-gray-500 jura-regular text-center py-8">No courses yet.</p>
) : (
  <div className="grid md:grid-cols-2 gap-6">
    {courses.map((course) => (
      <div
        key={course._id}
        className="bg-gray-900/40 border jura-regular border-gray-700/30 p-5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-1"
      >
        {/* Course Header */}
        <div className="mb-4">
          <h3 className="text-2xl jura-semibold text-white mb-1">
            {course.title}
          </h3>
          <p className="text-gray-400 jura-regular text-sm leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleUpdate(course._id)}
            title="Edit"
            className="cursor-pointer hover:bg-gray-800/70 text-yellow-400/80 border border-gray-500/40 font-medium rounded-lg px-3 py-2 transition"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() => handleDelete(course._id)}
            title="Delete"
            className="cursor-pointer hover:bg-gray-800/70 text-red-500 border border-gray-500/40 font-medium rounded-lg px-3 py-2 transition"
          >
            <Trash size={20} />
          </button>
        </div>

        {/* Quiz Section */}
        <div className="bg-gray-800/40 p-4 rounded-xl backdrop-blur-sm border border-gray-700/30 shadow-lg shadow-black/20">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg jura-semibold text-blue-400">
              Create Quiz
            </h4>
            <span className="text-xs jura-regular text-gray-400">
              {quizForms[course._id]?.length || 0} Questions
            </span>
          </div>

          {/* Quiz Questions */}
          <div className="max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
            {(quizForms[course._id] || []).map((q, i) => (
              <div
                key={i}
                className="mb-4 bg-gray-900/70 border border-gray-700/50 p-4 rounded-xl transition-all hover:border-blue-500/40 hover:bg-gray-900"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base jura-medium text-gray-200">
                    Question {i + 1}
                  </h4>
                  <button
                    onClick={() => {
                      const updated = quizForms[course._id].filter(
                        (_, idx) => idx !== i
                      );
                      setQuizForms({ ...quizForms, [course._id]: updated });
                    }}
                    className="text-red-500 hover:text-red-600 text-xs font-medium cursor-pointer rounded-lg p-2 border border-gray-500/30 hover:border-red-600/50 transition"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                {/* Question Input */}
                <input
                  className="w-full bg-gray-800 border jura-regular border-gray-700 focus:border-blue-500 text-gray-100 p-2 mb-3 rounded-lg outline-none transition"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuizField(course._id, i, "question", e.target.value)
                  }
                />

                {/* Options */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, j) => (
                    <input
                      key={j}
                      className="w-full bg-gray-800 border jura-regular border-gray-700 focus:border-green-500 text-gray-100 p-2 rounded-lg outline-none transition"
                      placeholder={`Option ${j + 1}`}
                      value={opt}
                      onChange={(e) =>
                        updateQuizField(
                          course._id,
                          i,
                          "options",
                          e.target.value,
                          j
                        )
                      }
                    />
                  ))}
                </div>

                {/* Correct Answer */}
                <input
                  className="w-full bg-gray-800 border jura-regular border-gray-700 focus:border-green-600 text-gray-100 p-2 rounded-lg outline-none transition"
                  placeholder="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateQuizField(
                      course._id,
                      i,
                      "correctAnswer",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>

          {/* Add/Submit Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => addQuestion(course._id)}
              className="cursor-pointer text-blue-400 hover:text-blue-300 border border-blue-600/40 px-4 py-2 rounded-lg jura-medium transition"
            >
             Add Question
            </button>

            <button
              onClick={() => handleQuizSubmit(course._id)}
              className="cursor-pointer text-green-400 hover:text-green-300 border border-green-600/40 px-4 py-2 rounded-lg jura-medium transition"
            >
            Submit Quiz
            </button>
          </div>
          



              </div>
              {/* 🎬 Upload Video Section */}
<div className="mt-6 bg-gray-800/40 p-4 rounded-xl border border-gray-700/40 transition">
  <h4 className="text-lg jura-semibold text-amber-400 mb-3 flex justify-between items-center">
    <span>Upload Course Video</span>
    {course.videos?.length > 0 && (
      <span className="text-sm text-gray-400">
        {course.videos.length} Video{course.videos.length > 1 ? "s" : ""}
      </span>
    )}
  </h4>

  {/* Upload Form */}
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData();
      const file = e.target.video.files[0];
      if (!file) return alert("Please choose a video first!");

      formData.append("video", file);

      try {
  const res = await axios.post(
    `http://localhost:5000/upload/${course._id}/video`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
  const percent = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total
  );
  setUploadProgress((prev) => ({ ...prev, [course._id]: percent }));
},

    }
  );

  toast.success("✅ Video uploaded!");
  console.log("✅ Video uploaded:", res.data.url);
  setUploadProgress((prev) => ({ ...prev, [course._id]: 100 }));
setTimeout(() => {
  setUploadProgress((prev) => ({ ...prev, [course._id]: 0 }));
}, 3000);


  // 🔁 Refresh courses
  const refreshed = await axios.get("http://localhost:5000/courses");
  setCourses(refreshed.data);

} catch (err) {
  alert("❌ Upload failed. Check backend logs.");
  console.error(err);
}

    }}
  >
    <input
      type="file"
      name="video"
      accept="video/*"
      className="w-full mb-3 p-2 text-sm text-gray-300 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer 
      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
      file:bg-blue-600/60 file:text-white hover:file:bg-blue-700 transition"
    />
    <button
      type="submit"
      className="cursor-pointer text-blue-300 border border-blue-600/40 px-4 py-2 rounded-lg jura-medium hover:text-white hover:border-blue-400 transition"
    >
      Upload Video
    </button>

    {/* Upload Progress UI */}
{uploadProgress[course._id] > 0 && (
  <div className="mt-3">
    <div className="w-full bg-gray-800/70 rounded-full h-2 overflow-hidden">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${uploadProgress[course._id]}%` }}
      ></div>
    </div>

    {uploadProgress[course._id] < 100 ? (
      <p className="text-sm text-gray-400 mt-2">
        Uploading... {uploadProgress[course._id]}%
      </p>
    ) : (
      <p className="text-sm text-green-400 mt-2 animate-pulse">
        ✅ Upload complete!
      </p>
    )}
  </div>
)}


  </form>

  {/* 🎞️ Show/Hide Uploaded Videos */}
  {course.videos?.length > 0 && (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h4 className="text-md jura-semibold text-green-400 mb-2">
          Uploaded Videos
        </h4>
        <button
          onClick={() => {
            setCourses((prev) =>
              prev.map((c) =>
                c._id === course._id
                  ? { ...c, showVideos: !c.showVideos }
                  : c
              )
            );
          }}
          className="text-sm border border-gray-600 px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:border-blue-400 cursor-pointer transition"
        >
          {course.showVideos ? "Hide" : "Show"}
        </button>
      </div>

      {/* Video List */}
      {course.showVideos && (
        <div className="space-y-3 mt-3">
          {course.videos.map((url, idx) => (
            <div
              key={idx}
              className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-3"
            >
              <video
                src={url}
                controls
                className="w-full rounded-lg border border-gray-800"
              />
              <div className="flex justify-between items-center gap-2 mt-2">
                <p className="text-xs text-gray-400 break-all">{url}</p>
                <button
                  onClick={async () => {
                    if (!window.confirm("Delete this video?")) return;
                    try {
                      const updatedVideos = course.videos.filter(
                        (_, i) => i !== idx
                      );
                      await axios.delete(`http://localhost:5000/upload/${course._id}/video`, {
                        headers: { Authorization: `Bearer ${token}` },
                        data: { fileUrl: url },
                      });

                      const refreshed = await axios.get(
                        "http://localhost:5000/courses"
                      );
                      setCourses(refreshed.data);
                    } catch (err) {
                      alert("❌ Failed to delete video.");
                      console.error(err);
                    }
                  }}
                  className="text-red-500 hover:text-red-400 text-xs border border-gray-600 px-2 py-1 rounded-lg transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
