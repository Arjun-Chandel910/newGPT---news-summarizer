import React from "react";
import { useAuth } from "../context/AuthProvider";

const ProfilePage = () => {
  const { currentUser } = useAuth();

  const articles = [
    { id: 1, title: "How AI Changes News", createdAt: "2025-08-15" },
    { id: 2, title: "India's Water Crisis", createdAt: "2025-09-20" },
  ];
  const summaries = [
    {
      id: 1,
      summaryText: "AI helps filter the noise in news reporting.",
      createdAt: "2025-10-01",
    },
    {
      id: 2,
      summaryText: "Water issues in India relate to local policies.",
      createdAt: "2025-10-02",
    },
  ];

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 py-10 px-4 flex flex-col items-center">
      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl flex flex-col items-center border border-blue-200 mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-white">
            {currentUser.username[0].toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentUser.username}
        </h2>
        <p className="text-md text-gray-500 mb-3">
          Joined {/* Format your real date here! */}2025
        </p>
        <div className="flex gap-7 text-center mt-2">
          <div>
            <span className="block text-xl font-bold text-blue-600">
              {articles.length}
            </span>
            <span className="block text-xs text-gray-500">Articles</span>
          </div>
          <div>
            <span className="block text-xl font-bold text-pink-500">
              {summaries.length}
            </span>
            <span className="block text-xs text-gray-500">Summaries</span>
          </div>
        </div>
      </div>
      {/* Article & Summaries section */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        {/* Articles Card */}
        <div className="flex-1 bg-white rounded-xl shadow border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            My Articles
          </h3>
          <ul className="space-y-3">
            {articles.map((a) => (
              <li
                key={a.id}
                className="p-3 rounded bg-blue-50 hover:bg-blue-100 transition flex justify-between items-center"
              >
                <span className="font-medium text-gray-700">{a.title}</span>
                <span className="text-xs text-gray-400">{a.createdAt}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Summaries Card */}
        <div className="flex-1 bg-white rounded-xl shadow border border-pink-100 p-6">
          <h3 className="text-lg font-semibold text-pink-700 mb-3">
            My Summaries
          </h3>
          <ul className="space-y-3">
            {summaries.map((s) => (
              <li
                key={s.id}
                className="p-3 rounded bg-pink-50 hover:bg-pink-100 transition flex flex-col"
              >
                <span className="font-medium text-gray-700">
                  {s.summaryText}
                </span>
                <span className="text-xs text-gray-400 mt-1 text-right">
                  {s.createdAt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
