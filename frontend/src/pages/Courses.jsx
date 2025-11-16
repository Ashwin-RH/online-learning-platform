import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
  const token = localStorage.getItem("token");
  axios.get(`${API_BASE_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setCourses(res.data))
  .catch(err => console.error(err));
}, []);


   const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase()) ||
    c.instructor?.name?.toLowerCase().includes(filter.toLowerCase())
  );

 return (
    <div>
      <div className="flex justify-between items-center my-25 mb-4">
        <h2 className="text-2xl jura-regular text-gray-200">Available Courses</h2>
        <input
          type="text"
          placeholder="Search courses..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border placeholder-gray-600 jura-regular bg-gray-900 p-2 rounded-lg focus:rounded-xl border-gray-700 w-60 text-gray-200 outline-none focus:border-gray-300/30 duration-500 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="jura-regular">No courses available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <div
              key={course._id}
              className="bg-gray-900 hover:shadow-2xl hover:-translate-y-0.5 hover:shadow-blue-500/15 rounded-xl p-4 border border-gray-700 hover:border-gray-600 will-change-transform transition-all duration-500"
            >
              <h3 className="jura-semibold will-change-transform text-gray-200/80 text-lg">{course.title}</h3>
              <p className="text-gray-500 jura-regular will-change-transform">
  {course.description.length > 100
    ? course.description.slice(0, 100) + "..."
    : course.description}
</p>

             <p className="text-md mt-2 will-change-transform">
              <span className="text-green-500/80 jura-medium">Instructor:</span>{" "}
              <span className="text-gray-200/70 jura-semibold">
                {course.instructor?.name || "Unknown"}
              </span>
            </p>

              <Link
                to={`/courses/${course._id}`}
                className="mt-3 inline-block border border-blue-600 text-gray-300 jura-regular px-3 py-1 rounded-lg hover:rounded-xl hover:bg-blue-600/10 hover:shadow-lg hover:shadow-black/30 transition-all duration-500 will-change-transform"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
