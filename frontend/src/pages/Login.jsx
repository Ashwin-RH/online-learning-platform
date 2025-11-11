import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const user = getUserFromToken();

      if (user.role === "instructor") navigate("/dashboard");
      else navigate("/home");

      setMessage("Login successful!");
    } catch {
      setMessage("Invalid credentials.");
    }
  };

  return (
    <div className=" max-w-md bg-gray-900/50 border border-gray-700 translate-y-3/4 mx-auto mt-12 shadow p-5 rounded-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-1000">
      <h2 className="text-xl text-white jura-semibold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4 mt-7 ">
        <input
          className="w-full p-2 bg-gray-800/20 jura-regular text-white placeholder-gray-600 border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          type="email"
          placeholder="Email here...."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 bg-gray-800/20 jura-regular text-white placeholder-gray-600 border border-gray-700 rounded-lg outline-none focus:border-blue-300/60 transition-all duration-500"
          type="password"
          placeholder="Password here...."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="relative w-25 items-center mt-1 justify-center left-1/2 -translate-x-1/2 border border-green-600 text-green-300 cursor-pointer hover:bg-gray-800 hover:border-green-400 hover:shadow-2xl hover:shadow-green-600/40 hover:text-white p-2 rounded-lg jura-medium">Sign In</button>
      </form>
      <p className="text-center mt-3 text-sm text-gray-600">{message}</p>
      <p className="text-center jura-regular mt-4 text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-400 hover:underline hover:text-blue-300 transition-all duration-300">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
