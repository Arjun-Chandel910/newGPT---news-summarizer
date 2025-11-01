import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import Loader from "../utils/Loader";
import { notifyError } from "../utils/Toast";

const MyArticles = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get(`/article`);
        // Filter articles for logged-in user by owner field
        const userArticles = Array.isArray(res.data.articles)
          ? res.data.articles.filter(
              (article) => article.owner === currentUser.id
            )
          : [];
        setArticles(userArticles);
      } catch {
        notifyError("Could not load articles.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchArticles();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-12 px-3">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">
          My Articles
        </h2>
        {articles.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            You haven&apos;t written any articles yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((article) => (
                <div
                  key={article._id}
                  className="rounded-xl border border-blue-100 bg-white shadow-md hover:shadow-lg transition-all px-6 py-5 flex flex-col gap-2 group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-blue-800 text-lg group-hover:text-blue-600">
                      {article.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        article.visibility === "public"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {article.visibility}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1">
                    {formatDate(article.createdAt)}
                  </div>
                  <div className="text-gray-700 text-base mb-2 leading-relaxed line-clamp-3">
                    {article.body.length > 180
                      ? article.body.slice(0, 175) + "..."
                      : article.body}
                  </div>
                  {article.source && (
                    <div className="text-xs text-blue-500 mt-1 font-medium">
                      Source:{" "}
                      <span className="underline cursor-pointer hover:text-blue-700">
                        {article.source}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;
