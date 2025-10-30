import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const handleLogout = async () => {
    logout();
  };
  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-xl py-4 px-10 flex items-center justify-between border-b border-gray-600">
      <div className="flex items-center gap-3">
        <span className="text-white text-3xl font-extrabold tracking-wide drop-shadow-xl">
          newGpt
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <Link
          to="/"
          className="text-lg text-gray-100 font-medium
          hover:text-yellow-400 transition duration-150"
        >
          {" "}
          Home
        </Link>
        <Link
          to="/summarizer"
          className="text-lg text-gray-100 font-medium hover:text-yellow-400 transition duration-150"
        >
          Summarizer
        </Link>
        <a
          href="/dashboard"
          className="text-lg text-gray-100 font-medium hover:text-yellow-400 transition duration-150"
        >
          Articles
        </a>
      </div>

      {/*button*/}
      <div>
        {/* <p>{currentUser.username}</p> */}
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition duration-200 border border-yellow-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/auth");
            }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition duration-200 border border-yellow-600"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
