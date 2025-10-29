import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-6 px-10 border-t border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-white text-xl font-extrabold ">newGpt</span>
        </div>

        <div className="text-gray-200 text-sm font-normal text-center md:text-right opacity-80">
          copyright icon
        </div>
      </div>
      <div className="mt-3 text-center">
        <a
          className="text-xs text-yellow-400 hover:underline mx-2 transition"
          href="#"
        >
          sdfdgdkljdlkf
        </a>
        <a
          className="text-xs text-yellow-400 hover:underline mx-2 transition"
          href="#"
        >
          sdflkjsaljsdf
        </a>
      </div>
    </footer>
  );
};

export default Footer;
