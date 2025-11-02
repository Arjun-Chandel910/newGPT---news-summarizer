import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Loader from "../utils/Loader";
import { notifySuccess, notifyError } from "../utils/Toast";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

const visibilityOptions = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Draft", value: "draft" },
];

const EditArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    body: "",
    source: "",
    visibility: "private",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/article/${id}`);
        const art = res.data.article;
        setForm({
          title: art.title,
          body: art.body,
          source: art.source || "",
          visibility: art.visibility || "private",
        });
      } catch {
        notifyError("Article not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/article/${id}`, form);
      notifySuccess("Article updated!");
      navigate(`/articles/${id}`);
    } catch {
      notifyError("Failed to update article.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Box className="max-w-2xl mx-auto py-10">
      <Card className="p-6 bg-white rounded-xl shadow-lg border border-blue-100">
        <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
          Edit Article
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Body"
            name="body"
            value={form.body}
            onChange={handleChange}
            multiline
            rows={6}
            required
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Source"
            name="source"
            value={form.source}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
          <TextField
            select
            label="Visibility"
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          >
            {visibilityOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: "8px", fontWeight: "bold", mt: 2 }}
          >
            Save Changes
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default EditArticlePage;
