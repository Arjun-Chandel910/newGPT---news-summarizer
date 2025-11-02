import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import Loader from "../utils/Loader";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../utils/Toast";

const PAGE_SIZE = 5;

const ArticlesPage = () => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/article/user/${currentUser.id}?limit=${PAGE_SIZE}&page=${page}&sort=${sort}`
        );
        setArticles(res.data.articles || []);
        setTotal(res.data.total || 0);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchArticles();
  }, [currentUser, page, sort]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await api.delete(`/article/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      notifySuccess("Article deleted successfully !");
    } catch {}
  };

  const handleEdit = (id) => {
    navigate(`/articles/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/articles/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold text-blue-900">My Articles</h1>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
        {loading ? (
          <Loader />
        ) : articles.length === 0 ? (
          <div className="text-gray-400 text-center py-16">
            No articles yet. Start writing and share your insights!
          </div>
        ) : (
          <ul className="space-y-5">
            {articles.map((article) => (
              <li
                key={article._id}
                className="bg-white shadow-md rounded-lg p-5 hover:bg-blue-50 border border-blue-100 transition group cursor-pointer"
                onClick={() => handleView(article._id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <Tooltip title="View Article">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(article._id);
                        }}
                      >
                        <VisibilityIcon sx={{ color: "#1976d2" }} />
                      </IconButton>
                    </Tooltip>
                    <span className="font-semibold text-lg text-blue-800 truncate">
                      {article.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 mr-4">
                      {formatDate(article.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Tooltip title="Edit Article">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(article._id);
                          }}
                        >
                          <EditIcon sx={{ color: "#fbc02d" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Article">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(article._id);
                          }}
                        >
                          <DeleteIcon sx={{ color: "#d32f2f" }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-blue-900 italic mb-2">
                  {article.visibility}
                </div>
                <div className="text-sm text-gray-700 line-clamp-3 mb-2">
                  {(article.body && article.body.substring(0, 270)) || ""}
                  {article.body && article.body.length > 270 ? "..." : ""}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Prev
            </button>
            {[...Array(pageCount)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  page === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-900 hover:bg-blue-50"
                } font-semibold`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className={`px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition ${
                page === pageCount ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
