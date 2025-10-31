import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Menu from "../utils/Menu";
const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-2xl py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-700">
      {/* Logo/Brand */}
      <div
        className="flex items-center gap-3 select-none cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-3xl font-extrabold tracking-wide drop-shadow-md">
          <span className="block text-transparent bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text animate-gradient">
            news<span className="text-yellow-400">GPT</span>
          </span>
        </span>
      </div>

      {/* Navigation links */}
      <div className="hidden md:flex items-center gap-9 text-[1.05rem]">
        <Link
          to="/"
          className="text-gray-100 font-semibold hover:text-yellow-400 px-2 py-1 rounded transition-colors duration-150"
        >
          Home
        </Link>
        <Link
          to="/summarizer"
          className="text-gray-100 font-semibold hover:text-yellow-400 px-2 py-1 rounded transition-colors duration-150"
        >
          Summarizer
        </Link>
        <Link
          to="/dashboard"
          className="text-gray-100 font-semibold hover:text-yellow-400 px-2 py-1 rounded transition-colors duration-150"
        >
          Articles
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <span className="hidden md:inline text-sm mr-2 text-yellow-300 font-bold px-3 py-1 bg-gray-800 rounded-full border border-yellow-600 shadow">
            <Menu />
          </span>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-full shadow hover:from-yellow-500 hover:to-yellow-400 border border-yellow-600 transition-all duration-200"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
