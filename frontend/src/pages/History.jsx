import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import { notifySuccess, notifyError } from "../utils/Toast";
import Loader from "../utils/Loader";

const History = () => {
  const { currentUser } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await api.get(`/summary/user/${currentUser.id}`);
        setSummaries(
          Array.isArray(res.data) ? res.data : res.data.summaries || []
        );
      } catch {
        notifyError("Couldn't load your summary history.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchSummaries();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this summary forever?")) return;
    try {
      await api.delete(`/summary/${id}`);
      setSummaries(summaries.filter((s) => s._id !== id));
      notifySuccess("Summary deleted.");
    } catch {
      notifyError("Delete failed. Try again later.");
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-2">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Your Summaries</h2>
        {summaries.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            No summaries generated yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {summaries
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((summary) => (
                <li key={summary._id} className="py-4 flex flex-col gap-2">
                  <div className="font-medium text-gray-800">
                    {summary.summaryText.length > 90
                      ? summary.summaryText.slice(0, 88) + "..."
                      : summary.summaryText}
                  </div>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold mr-1">Source:</span>
                    {summary.originalText.length > 50
                      ? summary.originalText.slice(0, 47) + "..."
                      : summary.originalText}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDate(summary.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDelete(summary._id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 rounded px-3 py-1 text-xs font-semibold transition"
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
  );
};

export default History;
