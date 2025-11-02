import React from "react";
import { useNavigate } from "react-router-dom";
import TypeWriter from "../utils/TypeWriter";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gradient-to-br from-blue-200 via-gray-50 to-pink-200 px-4">
      <TypeWriter
        text={"Welcome to newsGPT"}
        className="mt-14 text-4xl font-bold bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 text-transparent bg-clip-text text-center mb-10 drop-shadow"
      ></TypeWriter>
      <h1 className=""></h1>
      <div className="flex flex-row justify-center items-center gap-8 w-full max-w-3xl">
        {/* first card */}
        <div
          className="w-[320px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform duration-200 ease-out transform-gpu hover:scale-105 cursor-pointer border border-blue-200"
          onClick={() => navigate("/create-article")}
        >
          <span className="text-4xl mb-2">📝</span>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">
            Create Articles
          </h2>
          <p className="text-gray-500 text-center text-base">
            Write and manage news articles with ease.
            <br /> Start publishing in one click!
          </p>
        </div>
        {/* second card */}
        <div
          className="w-[320px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center transition-transform duration-200 ease-out transform-gpu hover:scale-105 cursor-pointer border border-pink-200"
          onClick={() => navigate("/summarizer")}
        >
          <span className="text-4xl mb-2">🤖</span>
          <h2 className="text-2xl font-semibold text-pink-500 mb-3">
            Generate Summaries
          </h2>
          <p className="text-gray-500 text-center text-base">
            Instantly summarize articles using AI-powered tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
