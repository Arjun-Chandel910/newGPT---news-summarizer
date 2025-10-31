import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthProvider";
import TypeWriter from "../utils/TypeWriter";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/Toast";

const BOX_HEIGHT = "90px";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [source, setSource] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleCreate = async () => {
    if (!title.trim()) {
      notifyError("Title is required.");
      return;
    }
    if (!body.trim()) {
      notifyError("Body/Text is required.");
      return;
    }
    if (!currentUser?.id) {
      notifyError("Not authenticated.");
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      await api.post("/article", {
        title: title.trim(),
        body: body.trim(),
        source: source.trim(),
        visibility,
        owner: currentUser.id,
      });
      notifySuccess("Article created successfully!");
      setTitle("");
      setBody("");
      setSource("");
      setVisibility("private");
      navigate("/me");
    } catch (err) {
      notifyError(
        err?.response?.data?.error ||
          "Sorry, article could not be created. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[60vh] bg-gradient-to-r from-blue-50 via-gray-50 to-yellow-50 px-2 py-2">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-4">
        <TypeWriter
          className="text-lg font-bold bg-gradient-to-r from-blue-400 via-blue-800 to-blue-900 text-transparent bg-clip-text mb-3"
          text={"Create New Article"}
        />
        <div className="mb-3">
          <label className="block text-gray-600 mb-1 font-semibold">
            Title
          </label>
          <input
            className="w-full border border-blue-300 rounded-md p-2 text-sm mb-1 focus:outline-blue-400 bg-white"
            type="text"
            value={title}
            placeholder="Enter article title"
            maxLength={140}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-600 mb-1 font-semibold">Body</label>
          <textarea
            className="w-full resize-none border border-blue-300 rounded-md p-2 text-sm focus:outline-blue-400 bg-white mb-1"
            value={body}
            maxLength={10000}
            placeholder="Write your article here..."
            style={{ minHeight: BOX_HEIGHT, maxHeight: BOX_HEIGHT }}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-600 mb-1 font-semibold">
            Source (optional)
          </label>
          <input
            className="w-full border border-blue-300 rounded-md p-2 text-sm mb-1 focus:outline-blue-400 bg-white"
            type="text"
            value={source}
            placeholder="Article source or link"
            onChange={(e) => setSource(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-600 mb-1 font-semibold">
            Visibility
          </label>
          <select
            className="w-full border border-blue-300 rounded-md p-2 text-sm mb-1 focus:outline-blue-400 bg-white"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            disabled={loading}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="flex justify-center">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Article"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
