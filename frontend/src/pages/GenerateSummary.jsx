import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";
const BOX_HEIGHT = "320px";
const MODES = ["Paragraph", "Bullet Points"];
const GenerateSummary = () => {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Paragraph");
  const { currentUser } = useAuth();

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSummary("");
    try {
      const res = await api.post("/summary", {
        originalText: input,
        user: currentUser.id,
        mode: mode.toLowerCase().replace(" ", "_"),
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

  // statistics
  const getStats = (text) => {
    if (!text) return { words: 0, sentences: 0 };
    const words = text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    return { words, sentences };
  };

  const stats = getStats(summary);

  // display summary
  const renderSummary = () => {
    if (!summary) {
      return "Your summary will appear here after you click Summarize.";
    }
    if (mode === "Bullet Points") {
      const bulletSentences = summary
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <ul className="pl-6 list-disc">
          {bulletSentences.map((point, i) => (
            <li key={i} className="mb-1">
              {point}
            </li>
          ))}
        </ul>
      );
    }
    return <span className="whitespace-pre-line">{summary}</span>;
  };
  return (
    <div className="flex flex-col items-center min-h-[80vh] bg-gradient-to-r from-blue-50 via-gray-50 to-yellow-50 px-2 py-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* input panel */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-gray-800 text-md mb-2">
              Enter your text and press{" "}
              <span className="font-bold">"Summarize"</span>.
            </div>
            <textarea
              className="resize-none border border-blue-300 rounded-lg p-4 text-lg text-gray-800 focus:outline-blue-400 bg-white mb-2 w-full"
              value={input}
              placeholder="Type or paste your text to summarize..."
              style={{ minHeight: BOX_HEIGHT, maxHeight: BOX_HEIGHT }}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
          </div>
          {/*  summary */}
          <div className="flex-1 flex flex-col gap-4">
            {/*modes*/}
            <div className="flex items-center gap-6 mb-1">
              {MODES.map((m) => (
                <button
                  key={m}
                  className={`pb-1 text-lg font-semibold transition border-b-2 ${
                    mode === m
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-400 hover:text-blue-500"
                  }`}
                  onClick={() => setMode(m)}
                  disabled={loading}
                  style={{ outline: "none" }}
                >
                  {m}
                </button>
              ))}
            </div>
            <div
              className={`border border-yellow-300 rounded-lg p-4 text-lg bg-white text-gray-900 shadow-sm transition-all h-full`}
              style={{
                minHeight: BOX_HEIGHT,
                maxHeight: BOX_HEIGHT,
                overflowY: "auto",
                opacity: loading ? "0.6" : "1",
              }}
            >
              {renderSummary()}
            </div>
            {/* stats*/}
            <div className="flex justify-end gap-8 pr-1 text-sm text-gray-500">
              <span>{stats.sentences} sentences</span>
              <span>{stats.words} words</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-8">
          <button
            className={`bg-green-600 hover:bg-green-700 text-white text-xl font-semibold px-8 py-3 rounded-full shadow-lg transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleGenerate}
            disabled={loading}
            style={{ minWidth: "180px", minHeight: "48px" }}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default GenerateSummary;
