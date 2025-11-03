import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../api/axios";
import Loader from "../utils/Loader";
import { notifyError, notifySuccess } from "../utils/Toast";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
const PAGE_SIZE = 5;
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const SummariesPage = () => {
  const { currentUser } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/summary/user/${currentUser.id}?limit=${PAGE_SIZE}&page=${page}&sort=${sort}`
        );
        setSummaries(res.data.summaries || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        notifyError("Failed to fetch summaries.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchSummaries();
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
    if (!window.confirm("Are you sure you want to delete this summary?"))
      return;
    try {
      await api.delete(`/summary/${id}`);
      setSummaries((prev) => prev.filter((s) => s._id !== id));
      notifySuccess("Deleted summary!");
    } catch {
      notifyError("Could not delete summary.");
    }
  };

  const handleView = (id) => {
    navigate(`/summaries/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl font-bold text-purple-900">My Summaries</h1>
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
        ) : summaries.length === 0 ? (
          <div className="text-gray-400 text-center py-16">
            No summaries found. Start by generating one!
          </div>
        ) : (
          <ul className="space-y-5">
            {summaries.map((summary) => (
              <li
                key={summary._id}
                className="bg-white shadow-md rounded-lg p-5 hover:bg-purple-50 border border-purple-100 transition group cursor-pointer flex flex-col"
                onClick={() => handleView(summary._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-purple-800 truncate">
                    {summary.summaryText.slice(0, 70)}
                    {summary.summaryText.length > 70 ? "..." : ""}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {formatDate(summary.createdAt)}
                    </span>
                    <Tooltip title="Delete Summary">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(summary._id);
                        }}
                        style={{ marginLeft: "12px" }}
                      >
                        <DeleteIcon sx={{ color: "#d32f2f" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
                {summary.article && (
                  <div className="text-xs text-blue-600 mt-2">
                    <a
                      className="hover:underline"
                      href={`/articles/${summary.article}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Source Article
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition ${
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
                    ? "bg-purple-800 text-white"
                    : "bg-white text-purple-900 hover:bg-purple-50"
                } font-semibold`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className={`px-3 py-1 rounded bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition ${
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

export default SummariesPage;
