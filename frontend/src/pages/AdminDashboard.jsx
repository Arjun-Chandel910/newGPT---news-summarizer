import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { notifySuccess } from "../utils/Toast";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [articlesPage, setArticlesPage] = useState(1);
  const [articlesTotal, setArticlesTotal] = useState(0);
  const [summariesPage, setSummariesPage] = useState(1);
  const [summariesTotal, setSummariesTotal] = useState(0);
  const [order, setOrder] = useState("desc");
  const [activeTab, setActiveTab] = useState("articles");
  const limit = 10;

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  useEffect(() => {
    const fetchArticles = () =>
      api
        .get(
          `/admin/articles?limit=${limit}&page=${articlesPage}&sort=${order}`
        )
        .then((res) => {
          setArticles(res.data.articles || []);
          setArticlesTotal(res.data.total || 0);
        });
    const fetchSummaries = () =>
      api
        .get(
          `/admin/summaries?limit=${limit}&page=${summariesPage}&sort=${order}`
        )
        .then((res) => {
          setSummaries(res.data.summaries || []);
          setSummariesTotal(res.data.total || 0);
        });
    if (activeTab === "articles") fetchArticles();
    if (activeTab === "summaries") fetchSummaries();
  }, [articlesPage, summariesPage, order, activeTab]);

  const handleDeleteArticle = async (id) => {
    try {
      const updatedArticles = articles.filter((article) => article._id !== id);
      setArticles(updatedArticles);
      setArticlesTotal((prev) => prev - 1);

      await api.delete(`/admin/article/${id}`);
      notifySuccess("Article deleted!");

      if (updatedArticles.length === 0 && articlesPage > 1) {
        setArticlesPage((page) => page - 1);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      api
        .get(
          `/admin/articles?limit=${limit}&page=${articlesPage}&sort=${order}`
        )
        .then((res) => {
          setArticles(res.data.articles || []);
          setArticlesTotal(res.data.total || 0);
        });
    }
  };

  const handleDeleteSummary = async (id) => {
    try {
      const updatedSummaries = summaries.filter(
        (summary) => summary._id !== id
      );
      setSummaries(updatedSummaries);
      setSummariesTotal((prev) => prev - 1);

      await api.delete(`/admin/summary/${id}`);
      notifySuccess("Summary deleted!");

      if (updatedSummaries.length === 0 && summariesPage > 1) {
        setSummariesPage((page) => page - 1);
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      api
        .get(
          `/admin/summaries?limit=${limit}&page=${summariesPage}&sort=${order}`
        )
        .then((res) => {
          setSummaries(res.data.summaries || []);
          setSummariesTotal(res.data.total || 0);
        });
    }
  };

  const totalArticlesPages = Math.ceil(articlesTotal / limit);
  const totalSummariesPages = Math.ceil(summariesTotal / limit);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">
        Welcome Admin!
      </h1>
      {stats && (
        <div className="flex justify-center gap-4 mb-8">
          <SmallStatsCard
            label="Users"
            value={stats.usersCount}
            color="bg-blue-50"
          />
          <SmallStatsCard
            label="Articles"
            value={stats.articlesCount}
            color="bg-green-50"
          />
          <SmallStatsCard
            label="Summaries"
            value={stats.summariesCount}
            color="bg-purple-50"
          />
        </div>
      )}

      <div className="flex mb-6 justify-center gap-3">
        <TabButton
          active={activeTab === "articles"}
          color="blue"
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </TabButton>
        <TabButton
          active={activeTab === "summaries"}
          color="purple"
          onClick={() => setActiveTab("summaries")}
        >
          Summaries
        </TabButton>
      </div>

      <div className="rounded-lg shadow-sm bg-white p-3 transition-all duration-300">
        {activeTab === "articles" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-blue-700">Articles</h2>
              <SortSelector order={order} setOrder={setOrder} />
            </div>
            <DataTable
              type="articles"
              data={articles}
              onDelete={handleDeleteArticle}
            />
            <PaginationControls
              page={articlesPage}
              setPage={setArticlesPage}
              totalPages={totalArticlesPages}
            />
          </>
        )}
        {activeTab === "summaries" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-purple-700">
                Summaries
              </h2>
              <SortSelector order={order} setOrder={setOrder} />
            </div>
            <DataTable
              type="summaries"
              data={summaries}
              onDelete={handleDeleteSummary}
            />
            <PaginationControls
              page={summariesPage}
              setPage={setSummariesPage}
              totalPages={totalSummariesPages}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SmallStatsCard({ label, value, color }) {
  return (
    <div
      className={`rounded shadow-sm px-5 py-2 ${color} flex flex-col items-center border border-gray-100`}
    >
      <span className="text-sm text-slate-600 mb-1">{label}</span>
      <div className="text-xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

function TabButton({ active, color, children, ...props }) {
  const colorActive =
    color === "blue"
      ? "text-blue-700 border-blue-600"
      : "text-purple-700 border-purple-600";
  return (
    <button
      className={`px-6 py-2 font-medium rounded transition-colors duration-150 ${
        active
          ? `bg-white shadow border-b-2 ${colorActive}`
          : "bg-gray-100 text-gray-400 border-b-2 border-transparent"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function SortSelector({ order, setOrder }) {
  return (
    <label className="flex items-center text-xs font-medium gap-2">
      <span>Sort:</span>
      <select
        className="border rounded px-2 py-1"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </label>
  );
}

function DataTable({ type, data, onDelete }) {
  if (!data.length) {
    return (
      <div className="py-8 text-gray-400 text-center text-sm italic">
        {type === "articles" ? "No articles found." : "No summaries found."}
      </div>
    );
  }
  return (
    <table className="w-full border rounded mb-2 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-2">
            {type === "articles" ? "Title" : "Summary Text"}
          </th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id} className="border-t text-slate-700">
            <td className="py-2">
              {type === "articles" ? item.title : item.summaryText}
            </td>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td>
              <button
                onClick={() => onDelete(item._id)}
                className="px-3 py-1 bg-red-50 text-red-500 rounded hover:bg-red-100 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PaginationControls({ page, setPage, totalPages }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-1 mb-1">
      <button
        className="px-2 py-1 bg-gray-200 rounded text-xs"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      <span className="px-2 py-1 text-xs text-slate-500">
        Page {page} of {totalPages || 1}
      </span>
      <button
        className="px-2 py-1 bg-gray-200 rounded text-xs"
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default AdminDashboard;
