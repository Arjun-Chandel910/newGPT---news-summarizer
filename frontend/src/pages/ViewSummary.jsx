import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../utils/Loader";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

const ViewSummary = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/summary/${id}`);
        setSummary(res.data.summary);
        if (res.data.summary.article) {
          const artRes = await api.get(`/article/${res.data.summary.article}`);
          setOriginal(artRes.data.article.body || "");
        } else {
          setOriginal(res.data.summary.originalText || "");
        }
      } catch {
        setSummary(null);
        setOriginal("");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [id]);

  if (loading) return <Loader />;
  if (!summary)
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-gray-500">
        Summary not found.
      </div>
    );

  return (
    <Box className="w-full max-w-xl mx-auto py-8 px-2">
      <Card className="p-5 bg-white rounded-2xl shadow-xl border border-blue-100">
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          className="mb-5 text-center"
        >
          Summary View
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Original Text */}
          <div className="flex flex-col min-h-[180px]">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="primary"
              className="mb-1"
            >
              Original Text
            </Typography>
            <div className="flex-1 overflow-y-auto bg-blue-50 rounded-md p-3 border border-blue-100 text-gray-700 text-[0.98rem] max-h-[260px] min-h-[120px] whitespace-pre-line">
              {original}
            </div>
          </div>
          {/* Summary */}
          <div className="flex flex-col min-h-[180px]">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="secondary"
              className="mb-1"
            >
              Summary
            </Typography>
            <div className="flex-1 overflow-y-auto bg-yellow-50 rounded-md p-3 border border-yellow-100 text-gray-900 font-semibold max-h-[260px] min-h-[120px] whitespace-pre-line">
              {summary.summaryText}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 px-1 text-xs text-gray-400">
          <span>
            {summary.createdAt &&
              `Created ${new Date(summary.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}`}
          </span>
          {summary.article && (
            <a
              href={`/articles/${summary.article}`}
              className="text-blue-700 hover:underline font-semibold transition"
            >
              View Source Article
            </a>
          )}
        </div>
      </Card>
    </Box>
  );
};

export default ViewSummary;
