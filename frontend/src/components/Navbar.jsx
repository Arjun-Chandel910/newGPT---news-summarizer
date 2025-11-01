import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import Menu from "../utils/Menu";
import { FiLogIn, FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Nav links data, "History" is included only if currentUser exists
  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/summarizer", text: "Summarizer" },
    { to: "/dashboard", text: "My Articles" },
  ];
  if (currentUser) {
    navLinks.push({ to: "/history", text: "History" });
  }

  return (
    <nav className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-400 via-cyan-300 to-slate-400 rounded-r-xl shadow-md"></div>

      <div className="mx-auto max-w-6xl flex items-center justify-between h-[64px] md:h-[70px] px-2 md:px-8">
        {/* Logo */}
        <div
          className="flex items-center gap-2 select-none cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <span className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
            <span className="bg-gradient-to-r from-slate-900 via-blue-500 to-cyan-600 bg-clip-text text-transparent group-hover:drop-shadow-md">
              newsGPT
            </span>
          </span>
        </div>

        {/* Desktop nav links (pill) */}
        <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 shadow-inner border border-blue-100/60 gap-0">
          {navLinks.map((item, idx) => (
            <div key={item.text} className="flex items-center">
              <Link
                to={item.to}
                className="px-5 py-1 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              >
                {item.text}
              </Link>
              {idx !== navLinks.length - 1 && (
                <span className="h-8 w-px bg-gradient-to-b from-blue-200 via-slate-200 to-blue-100 mx-1"></span>
              )}
            </div>
          ))}
        </div>

        {/* Sign In/Menu & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-blue-50 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open menu"
          >
            <FiMenu className="text-2xl text-blue-700" />
          </button>

          {currentUser ? (
            <div className="hidden md:flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full shadow font-semibold text-blue-700 text-base hover:scale-105 transition">
              <Menu />
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold shadow-md hover:from-blue-700 hover:to-blue-500 border border-blue-300 transition-all duration-150"
              style={{
                boxShadow:
                  "0 4px 14px 0 rgba(59,130,246,0.10), 0 2px 2px 0 rgba(59,130,246,0.06)",
              }}
            >
              <FiLogIn className="text-lg" />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="md:hidden absolute right-4 top-16 bg-white/90 rounded-2xl shadow-lg border border-blue-100 w-11/12 max-w-xs p-3 flex flex-col gap-1 z-50">
          {navLinks.map((item) => (
            <Link
              key={item.text}
              to={item.to}
              className="block rounded-full px-4 py-3 my-1 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {item.text}
            </Link>
          ))}
          {currentUser ? (
            <div className="flex items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-full shadow font-semibold text-blue-700 text-base mt-2">
              <Menu />
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
              className="flex items-center gap-2 mt-2 w-full justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold shadow-md border border-blue-300 transition-all duration-150"
            >
              <FiLogIn className="text-lg" />
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
