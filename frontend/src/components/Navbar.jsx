import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken, isAuthenticated } from "../utils/auth";
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const user = getUserFromToken();
  const loggedIn = isAuthenticated();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 
                 w-[96%] max-w-7xl px-6 py-3 flex justify-between items-center 
                 bg-gray-900/40 border border-gray-700/50 backdrop-blur-lg rounded-xl 
                 shadow-xl shadow-blue-500/10 scrollbar-hide"
    >
      {/* ✅ Logo */}
      <h1 className="text-2xl jura-bold bg-gradient-to-tr from-purple-500 via-orange-500 to-amber-600 text-transparent bg-clip-text">
        LEARNIFY
      </h1>

      {/* ✅ Nav Links */}
      <div className="flex items-center space-x-6 text-gray-400 jura-medium">
        {/* Always visible */}
        <Link
          to="/"
          className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
        >
          Home
        </Link>

        {/* Visible only to logged-in users who are NOT instructors */}
        {loggedIn && user?.role !== "instructor" && (
          <Link
            to="/courses"
            className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
          >
            Courses
          </Link>
        )}

        {/* Instructor-only link */}
        {user?.role === "instructor" && (
          <Link
            to="/dashboard"
            className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
          >
            Dashboard
          </Link>
        )}

        {/* Admin-only link */}
        {user?.role === "admin" && (
          <Link
            to="/admin/analytics"
            className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
          >
            Analytics
          </Link>
        )}

        {/* Login / Signup for visitors only */}
        {!loggedIn && (
          <>
            <Link
              to="/login"
              className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-gray-200 hover:-translate-y-0.5 duration-300 transition-all"
            >
              Signup
            </Link>
          </>
        )}

        {/* Logout for logged-in users */}
        {loggedIn && (
          <button
            onClick={handleLogout}
            title="Logout"
            className="cursor-pointer border border-gray-700 z-10 hover:border-amber-600 px-3 py-1.5 rounded-lg 
                       text-white font-semibold hover:opacity-90 active:scale-95 
                       transition-all duration-300"
          >
            <LogOut />
          </button>
        )}
      </div>
    </nav>
  );
}
