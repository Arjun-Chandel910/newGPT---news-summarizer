import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../utils/Loader";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const ViewArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/article/${id}`);
        setArticle(res.data.article);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <Loader />;
  if (!article)
    return (
      <div className="max-w-md mx-auto py-14 text-center text-gray-500">
        Article not found.
      </div>
    );

  return (
    <Box className="w-full max-w-md mx-auto py-6 px-2">
      <Card className="p-4 bg-white rounded-xl shadow-lg border border-blue-100">
        <Typography
          variant="h5"
          fontWeight={600}
          color="primary"
          gutterBottom
          className="mb-2"
        >
          {article.title}
        </Typography>
        <div className="flex gap-2 mb-2 items-center">
          <Chip label={article.visibility} color="primary" size="small" />
          <span className="text-xs text-gray-400">
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <Typography
          variant="body2"
          className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line"
        >
          {article.body}
        </Typography>
        {article.source && (
          <Typography variant="body2" className="mt-4 text-blue-800 text-xs">
            <strong>Source:</strong> {article.source}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default ViewArticlePage;
