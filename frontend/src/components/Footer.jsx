import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-5 px-6 border-t border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-extrabold tracking-wider">
            news<span className="text-blue-400">GPT</span>
          </span>
        </div>
        <div className="text-gray-200 text-xs md:text-sm flex items-center gap-1 opacity-80">
          <span>&copy;</span>
          <span>{new Date().getFullYear()} newsGPT. All rights reserved.</span>
        </div>
      </div>
      <div className="mt-3 text-center space-x-3">
        <p className="text-xs text-yellow-400 hover:underline transition">
          Privacy Policy
        </p>
        <p className="text-xs text-yellow-400 hover:underline transition">
          Terms of Service
        </p>
      </div>
    </footer>
  );
};

export default Footer;
