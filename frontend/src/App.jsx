import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CourseDetails from "./pages/CourseDetails";
import QuizPage from "./pages/QuizPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getUserFromToken, isAuthenticated } from "./utils/auth";
import AdminAnalytics from "./pages/AdminAnalytics";

// 🔒 Role-protected route
function ProtectedRoute({ children, allowedRoles }) {
  const user = getUserFromToken();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Check if user's role is in allowedRoles (if specified)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
}


export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 scrollbar-hide">
      {/* ✅ Common Navbar */}
      <Navbar />

      {/* ✅ Page content */}
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full scrollbar-hide">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/quiz/:courseId" element={<QuizPage />} />

          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={["student", "admin"]}>
                <Courses />
              </ProtectedRoute>
            }
          />

          {/* Protected: Only instructor can access dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="instructor">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Only admin can access analytics */}
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Optional: Example of protected home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* ✅ Common Footer */}
      <Footer />
    </div>
  );
}
