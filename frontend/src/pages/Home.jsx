import { Link } from "react-router-dom";
import { getUserFromToken, isAuthenticated } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const user = isAuthenticated() ? getUserFromToken() : null;

  const quotes = [
    "Consistency is more important than intensity. Keep showing up.",
    "Small progress each day adds up to big results.",
    "Don’t watch the clock; do what it does — keep going.",
    "Discipline is choosing what you want most over what you want now.",
    "Every expert was once a beginner — stay patient.",
    "Your only limit is the one you set yourself.",
    "Dream big. Start small. Act now.",
    "The best way to predict the future is to create it.",
    "Focus on progress, not perfection.",
    "Learn something today that your future self will thank you for."
  ];

  // 🎲 Pick a random quote on each render
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []); // Runs once each time the user visits/reloads

  if (user?.role === "student") {
    return (
      <div className="mt-24 text-center text-gray-100 scrollbar-hide">
        <section className="py-20 max-w-4xl mx-auto bg-gray-900/40 rounded-2xl border border-gray-800 shadow-lg">
          <h1 className="text-4xl bg-gradient-to-r from-gray-950 via-gray-500 to-gray-400 bg-clip-text text-transparent  jura-semibold mb-4">
            Welcome back, <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent"> {user?.name ? user.name.split(" ")[0] : "Student"}</span>  
          </h1>
          <p className="text-gray-400 jura-regular mb-6">
            Explore your courses, track your progress, and continue learning new skills.
          </p>
          <Link
            to="/courses"
            className="will-change-transform hover:-translate-y-0.5 bg-gradient-to-r from-orange-600 to-amber-600  jura-bold px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 inline-block -mt-2 text-white"
          >
            Go to My Courses
          </Link>
        </section>
  
{/* ✨ Rotating Motivational Quote */}
        <section className="mt-12 italic text-gray-400 jura-regular transition-opacity duration-700">
          “{quote}”
        </section>


        
      </div>
    );
  }

  return (
    <div className="mt-24 text-center text-gray-100 scrollbar-hide">
      {/* 🌌 Hero Section */}
      <section className="relative py-20 border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-950 hover:shadow-2xl hover:shadow-gray-800/50 mx-4 rounded-2xl duration-1000 overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-5xl text-amber-600/90 jura-semibold mb-6 leading-tight">
            Master New Skills with <span className="jura-bold px-4 py-1 rounded-lg z-20 bg-gradient-to-tl from-orange-400 via-orange-600 to-red-500 text-transparent bg-clip-text">Tatwa</span>
          </h1>
          <p className="text-gray-300 jura-regular text-lg mb-8">
            Build your future with expert-led courses, hands-on projects, and real progress tracking — 
            designed for learners who aim higher.
          </p>
          <Link
            to="/signup"
            className="bg-gradient-to-br from-violet-500/40 to-orange-500 text-white jura-bold 
                      px-6 py-3 rounded-lg transition-transform duration-300 ease-out
                      hover:-translate-y-1 transform inline-block"
          >
            Get Started
          </Link>

        </div>

        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 to-transparent blur-3xl"></div>
      </section>

      {/* 🚀 Core Features */}
      <section className="mt-20 grid md:grid-cols-3 gap-8 mx-4 max-w-6xl mx-auto">
        <div className=" transition-all duration-300 shadow-2xl shadow-indigo-800/20 bg-gradient-to-tl from-blue-400/10 via-blue-600/10 to-purple-500/10 border border-gray-800/70 rounded-xl p-8 shadow-lg">
          <h3 className="text-xl jura-semibold text-amber-600 mb-3">Structured Learning</h3>
          <p className="text-gray-300/80 jura-regular text-sm">
            Learn step-by-step from curated video lectures, exercises, and projects.
          </p>
        </div>
        <div className=" transition-all duration-300 shadow-2xl shadow-indigo-800/20 bg-gradient-to-tl from-blue-400/10 via-blue-600/10 to-purple-500/10 border border-gray-800/70 rounded-xl p-8 shadow-lg">
          <h3 className="text-xl jura-semibold text-amber-600 mb-3">Interactive Quizzes</h3>
          <p className="text-gray-300/80 jura-regular text-sm">
            Test your understanding instantly and strengthen what you’ve learned.
          </p>
        </div>
        <div className=" transition-all duration-300 shadow-2xl shadow-indigo-800/20 bg-gradient-to-tl from-blue-400/10 via-blue-600/10 to-purple-500/10 border border-gray-800/70 rounded-xl p-8 shadow-lg">
          <h3 className="text-xl jura-semibold text-amber-600 mb-3">Progress Tracking</h3>
          <p className="text-gray-300/80 jura-regular text-sm">
            Watch your growth in real-time with visual progress indicators.
          </p>
        </div>
      </section>

      {/* 💡 Why Tatwa */}
      <section className="mt-24 max-w-5xl mx-auto px-6 text-left">
        <h2 className="text-3xl jura-bold text-center text-gray-400 mb-10">
          Why Choose Tatwa?
        </h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="text-lg jura-semibold mb-2 rounded-lg bg-gradient-to-tl from-orange-400 via-orange-600 to-red-500 text-transparent bg-clip-text">
              Expert-Led Content
            </h4>
            <p className="text-gray-400 jura-regular">
              Every course is crafted and taught by real industry professionals — not just tutorials.
            </p>
          </div>
          <div>
            <h4 className="text-lg jura-semibold mb-2 rounded-lg bg-gradient-to-tl from-orange-100 via-orange-600 to-red-400 text-transparent bg-clip-text">
              Hands-On Experience
            </h4>
            <p className="text-gray-400 jura-regular">
              Learn by doing — build, test, and deploy your own projects as you progress.
            </p>
          </div>
          <div>
            <h4 className="text-lg jura-semibold mb-2 rounded-lg bg-gradient-to-tl from-orange-400 via-orange-600 to-red-500 text-transparent bg-clip-text">
              Learn Anywhere
            </h4>
            <p className="text-gray-400 jura-regular">
              Continue your learning from desktop or mobile, anytime, anywhere.
            </p>
          </div>
          <div>
            <h4 className="text-lg jura-semibold mb-2 rounded-lg bg-gradient-to-tl from-orange-400 via-orange-600 to-red-500 text-transparent bg-clip-text">
              Adaptive Progress
            </h4>
            <p className="text-gray-400 jura-regular">
              Track your journey and unlock new lessons as you master each module.
            </p>
          </div>
        </div>
      </section>

      {/* 🎯 CTA */}
      <section className="mt-24 mb-16 bg-gradient-to-br from-violet-500/40 to-orange-500 rounded-2xl py-12 px-6 mx-4 text-center shadow-lg">
        <h2 className="text-3xl jura-bold mb-4">Join Thousands of Learners Today</h2>
        <p className="text-blue-100 jura-regular mb-6">
          Turn your curiosity into capability — start learning with Tatwa now.
        </p>
        <Link
          to="/signup"
          className="bg-black text-white jura-semibold px-6 py-2 rounded-lg transition-all duration-300"
        >
          Get Started for Free
        </Link>
      </section>
    </div>
  );
}
