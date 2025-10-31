import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Menu from "../utils/Menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-gray-950 via-gray-800 to-gray-700 shadow-lg py-3 px-3 md:px-8 flex items-center justify-between border-b border-gray-800 sticky top-0 z-40">
      <div
        className="flex items-center gap-2 select-none cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-md">
          <span className="block text-transparent bg-gradient-to-r from-blue-500   via-blue-700 to-blue-500 bg-clip-text">
            newsGPT
          </span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-7">
        <Link
          to="/"
          className="text-base font-medium text-gray-100 hover:text-yellow-400 px-2 py-1 transition"
        >
          Home
        </Link>
        <Link
          to="/summarizer"
          className="text-base font-medium text-gray-100 hover:text-yellow-400 px-2 py-1 transition"
        >
          Summarizer
        </Link>
        <Link
          to="/dashboard"
          className="text-base font-medium text-gray-100 hover:text-yellow-400 px-2 py-1 transition"
        >
          Articles
        </Link>
        <Link
          to="/history"
          className="text-base font-medium text-gray-100 hover:text-yellow-400 px-2 py-1 transition"
        >
          History
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {currentUser ? (
          <div
            className="flex items-center px-4 py-2 bg-blue-950 border border-blue-700 rounded-full shadow font-bold text-yellow-200 text-base"
            style={{ minWidth: "110px" }}
          >
            <Menu />
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 font-bold px-5 py-2 rounded-full shadow hover:from-yellow-500 hover:to-yellow-400 border-none transition-all duration-150"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
