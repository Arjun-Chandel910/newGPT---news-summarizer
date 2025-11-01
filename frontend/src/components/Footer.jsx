import React from "react";

const Footer = () => {
  return (
    <footer className="glass-footer bg-white/80 backdrop-blur-lg shadow-inner border-t border-neutral-200 py-7 px-4">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left/Logo & Brand */}
        <div className="flex items-center gap-2">
          <span className="text-[1.15rem] md:text-lg font-black tracking-wider text-slate-900 drop-shadow">
            news
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              GPT
            </span>
          </span>
        </div>
        {/* Copyright */}
        <div className="text-slate-500 text-xs md:text-sm flex items-center gap-1 opacity-80">
          <span>&copy;</span>
          <span>{new Date().getFullYear()} newsGPT. All rights reserved.</span>
        </div>
        {/* Links */}
        <div className="flex gap-5">
          <a
            href="#"
            className="text-xs md:text-sm px-2 py-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700 text-white rounded-full shadow-sm hover:scale-105 focus:outline-none transition-all"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs md:text-sm px-2 py-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-700 text-white rounded-full shadow-sm hover:scale-105 focus:outline-none transition-all"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
