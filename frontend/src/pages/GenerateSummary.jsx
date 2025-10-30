import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";

const BOX_HEIGHT = "320px";

const GenerateSummary = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSummary("");
    try {
      const res = await api.post("/summary", {
        originalText: input,
        user: currentUser ? currentUser.id : "6900b65279c93047c5097355",
      });
      setSummary(res.data.summary.summaryText || "No summary returned.");
    } catch (err) {
      setSummary(
        err?.response?.data?.error ||
          "Sorry, I couldn't generate a summary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-r from-blue-50 via-gray-50 to-yellow-50 px-2">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Enter Text</h2>
          <textarea
            className="resize-none border border-blue-300 rounded-lg p-4 text-lg text-gray-800 focus:outline-blue-400 bg-white mb-6"
            value={input}
            placeholder="Type or paste your text to summarize..."
            style={{ minHeight: BOX_HEIGHT, maxHeight: BOX_HEIGHT }}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2.5 px-6 rounded shadow transition-all mt-auto ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerate}
            disabled={loading}
            style={{ minHeight: "50px" }}
          >
            {loading ? "Summarizing..." : "Generate Summary"}
          </button>
        </div>
        <div className="flex-1 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Summary</h2>
          <div
            className={`border border-yellow-300 rounded-lg p-4 text-lg bg-white text-gray-900 whitespace-pre-line transition-all ${
              loading ? "opacity-60" : ""
            }`}
            style={{
              minHeight: BOX_HEIGHT,
              maxHeight: BOX_HEIGHT,
              overflowY: "auto",
            }}
          >
            {summary
              ? summary
              : "Your summary will appear here after you click Generate."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSummary;
