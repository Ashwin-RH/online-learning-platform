import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/signup", form);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMessage("Error during signup. Please try again.");
    }
  };

  return (
    <div className="max-w-md bg-gray-900/50 border border-gray-700 translate-y-1/2 mx-auto mt-12 shadow p-5 rounded-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-1000">
      <h2 className="text-xl text-white jura-semibold mb-4 text-center">Sign Up</h2>

      <form onSubmit={handleSignup} className="space-y-4 mt-7">
        <input
          className="w-full p-2 bg-gray-800/20 jura-regular text-white placeholder-gray-600 border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          type="text"
          placeholder="Full Name..."
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="w-full p-2 bg-gray-800/20 jura-regular text-white placeholder-gray-600 border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          type="email"
          placeholder="Email address..."
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full p-2 bg-gray-800/20 jura-regular text-white placeholder-gray-600 border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          type="password"
          placeholder="Password..."
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="w-full p-2 bg-gray-800/20 text-white jura-regular border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student" className="bg-gray-700">Student</option>
          <option value="instructor" className="bg-gray-700">Instructor</option>
        </select>

        <button
          type="submit"
          className="relative w-25 items-center mt-1 justify-center left-1/2 -translate-x-1/2 
                     border border-blue-600 text-blue-300 cursor-pointer 
                     hover:bg-gray-800 hover:border-blue-400 hover:shadow-2xl 
                     hover:shadow-blue-600/40 hover:text-white p-2 rounded-lg jura-medium transition-all duration-500"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center mt-3 text-sm text-gray-600">{message}</p>

      <p className="text-center mt-4 jura-regular text-gray-500 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-400 hover:underline hover:text-blue-300 transition-all duration-300">
          Log in here
        </Link>
      </p>
    </div>
  );
}
