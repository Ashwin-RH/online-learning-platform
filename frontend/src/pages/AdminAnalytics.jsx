import { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromToken } from "../utils/auth";

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");
  const user = getUserFromToken();

  useEffect(() => {
    axios
      .get("http://localhost:5000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (user?.role !== "admin") return <p>Access denied.</p>;
  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-gray-950 border border-gray-700 my-20 shadow p-6 rounded-xl">
      <h2 className="text-2xl jura-bold mb-4 text-blue-300">Admin Analytics</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4 border border-gray-700 rounded-xl shadow-sm">
          <h3 className="text-lg text-gray-400 jura-semibold">Users</h3>
          <p className="text-2xl text-gray-300 jura-bold">{stats.users}</p>
        </div>
        <div className="p-4 border border-gray-700 rounded-xl shadow-sm">
          <h3 className="text-lg text-gray-400 jura-semibold">Courses</h3>
          <p className="text-2xl text-gray-300  jura-bold">{stats.courses}</p>
        </div>
        <div className="p-4 border border-gray-700 rounded-xl shadow-sm">
          <h3 className="text-lg text-gray-400 jura-semibold">Enrollments</h3>
          <p className="text-2xl text-gray-300 jura-bold">{stats.enrollments}</p>
        </div>
      </div>
    </div>
  );
}
