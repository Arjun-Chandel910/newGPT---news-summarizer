import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import Loader from "../utils/Loader";
import { notifyError } from "../utils/Toast";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentSummaries, setRecentSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, summariesRes] = await Promise.all([
          api.get(`/article/user/${currentUser.id}?limit=2&sort=desc`),
          api.get(`/summary/user/${currentUser.id}?limit=2&sort=desc`),
        ]);
        setRecentArticles(
          articlesRes.data.articles ? articlesRes.data.articles : []
        );
        setRecentSummaries(
          summariesRes.data.summaries ? summariesRes.data.summaries : []
        );
      } catch (err) {
        notifyError("Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) return <Loader />;

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2">
      <div className="max-w-5xl mx-auto px-4 py-7">
        {/* profile card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-7 mb-10 border border-indigo-100">
          <div className="w-24 h-24 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-indigo-100">
            {currentUser.username[0].toUpperCase()}
          </div>
          {/* user info */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow mb-1">
              {currentUser.username}
            </h1>
            <div className="flex gap-6 mt-2">
              <div>
                <div className="text-lg text-white/90 font-semibold">
                  {recentArticles.length}
                </div>
                <div className="text-xs text-indigo-100">Articles</div>
              </div>
              <div>
                <div className="text-lg text-white/90 font-semibold">
                  {recentSummaries.length}
                </div>
                <div className="text-xs text-indigo-100">Summaries</div>
              </div>
            </div>
          </div>
        </div>

        {/* preview panel (articles + summaries) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-6 flex flex-col h-full border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-800 flex items-center">
                <span className="bg-blue-100 text-blue-700 mr-2 px-2 py-1 rounded-full text-sm font-semibold">
                  New
                </span>
                Articles
              </h2>
              <Link
                to="/my-articles"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            {recentArticles.length === 0 ? (
              <div className="text-gray-400 text-center py-6">
                No articles yet. Your published articles will show here.
              </div>
            ) : (
              <ul className="space-y-4 flex-1">
                {recentArticles.map((article) => (
                  <li
                    key={article._id}
                    className="p-3 rounded border border-blue-50 hover:bg-blue-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-900 truncate">
                        {article.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5 italic">
                      {article.visibility}
                    </div>
                    <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {(article.body && article.body.substring(0, 90)) || ""}
                      {article.body && article.body.length > 90 ? "..." : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-6 flex flex-col h-full border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-purple-800 flex items-center">
                <span className="bg-purple-100 text-purple-700 mr-2 px-2 py-1 rounded-full text-sm font-semibold">
                  New
                </span>
                Summaries
              </h2>
              <Link
                to="/history"
                className="text-sm text-purple-600 hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            {recentSummaries.length === 0 ? (
              <div className="text-gray-400 text-center py-6">
                No summaries yet. Start summarizing content!
              </div>
            ) : (
              <ul className="space-y-4 flex-1">
                {recentSummaries.map((summary) => (
                  <li
                    key={summary._id}
                    className="p-3 rounded border border-purple-50 hover:bg-purple-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-purple-900 truncate">
                        {summary.summaryText.slice(0, 60)}
                        {summary.summaryText.length > 60 ? "..." : ""}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(summary.createdAt)}
                      </span>
                    </div>
                    {summary.article && (
                      <Link
                        to={`/articles/${summary.article}`}
                        className="text-xs text-blue-600 hover:underline mt-0.5 block"
                      >
                        View original article
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
