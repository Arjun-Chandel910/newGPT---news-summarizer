import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import Loader from "../utils/Loader";
import { notifySuccess, notifyError } from "../utils/Toast";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // sorting state
  const [articleSort, setArticleSort] = useState("desc");
  const [summarySort, setSummarySort] = useState("desc");

  // fetch all articles and summaries
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, summariesRes] = await Promise.all([
          api.get(`/article/user/${currentUser.id}`),
          api.get(`/summary/user/${currentUser.id}`),
        ]);
        setArticles(
          Array.isArray(articlesRes.data)
            ? articlesRes.data
            : articlesRes.data.articles || []
        );
        setSummaries(
          Array.isArray(summariesRes.data)
            ? summariesRes.data
            : summariesRes.data.summaries || []
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

  if (loading) {
    return <Loader />;
  }

  const formatDate = (dateString) => {
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";
  };

  // Sorting
  const sortedArticles = [...articles].sort((a, b) =>
    articleSort === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const sortedSummaries = [...summaries].sort((a, b) =>
    summarySort === "asc"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Delete article
  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await api.delete(`/article/${id}`);
      setArticles(articles.filter((a) => a._id !== id));
      notifySuccess("Article deleted.");
    } catch {
      notifyError("Could not delete article.");
    }
  };

  // Delete summary
  const handleDeleteSummary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this summary?"))
      return;
    try {
      await api.delete(`/summary/${id}`);
      setSummaries(summaries.filter((s) => s._id !== id));
      notifySuccess("Summary deleted.");
    } catch {
      notifyError("Could not delete summary.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* replace this with image later */}
          <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentUser.username}
            </h1>
            <p className="text-sm text-gray-600 mb-2">News contributor</p>
            <div className="flex gap-8 text-center mt-1">
              <div>
                <span className="block text-xl font-bold text-blue-600">
                  {articles.length}
                </span>
                <span className="block text-xs text-gray-500">Articles</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-purple-600">
                  {summaries.length}
                </span>
                <span className="block text-xs text-gray-500">Summaries</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/*Articles*/}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-blue-900">Your Articles</h2>
              <select
                className="border border-blue-200 rounded px-2 py-1 text-sm"
                value={articleSort}
                onChange={(e) => setArticleSort(e.target.value)}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
            {sortedArticles.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No articles yet. Write something new!
              </p>
            ) : (
              <ul className="space-y-3">
                {sortedArticles.map((article) => (
                  <li
                    key={article._id}
                    className="border rounded flex flex-col px-3 py-2 hover:bg-blue-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-900">
                        {article.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {(article.body && article.body.substring(0, 120)) || ""}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                        {article.visibility}
                      </span>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        className="ml-auto px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Summaries */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-purple-800">
                Your Summaries
              </h2>
              <select
                className="border border-purple-200 rounded px-2 py-1 text-sm"
                value={summarySort}
                onChange={(e) => setSummarySort(e.target.value)}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
            {sortedSummaries.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No summaries yet. Try out the summarizer!
              </p>
            ) : (
              <ul className="space-y-3">
                {sortedSummaries.map((summary) => (
                  <li
                    key={summary._id}
                    className="border rounded flex flex-col px-3 py-2 hover:bg-purple-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-purple-900">
                        {summary.summaryText.slice(0, 80)}
                        {summary.summaryText.length > 80 ? "..." : ""}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(summary.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleDeleteSummary(summary._id)}
                        className="ml-auto px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
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
