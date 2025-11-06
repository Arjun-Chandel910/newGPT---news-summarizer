import React, { useState } from "react";
import { Box, Button, Card, TextField, Typography, Link } from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { notifyError, notifySuccess } from "../utils/Toast.js";
import { useNavigate } from "react-router-dom";

const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();

  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    let errs = {};
    if (!isLogin && !form.username.trim()) errs.username = "Username required";
    else if (!isLogin && !usernameRegex.test(form.username.trim()))
      errs.username =
        "Username must be 3-20 characters and contain only letters, digits, underscore, or hyphen";
    if (!form.email.trim()) errs.email = "Email required";
    else if (!emailRegex.test(form.email.trim()))
      errs.email = "Please enter a valid email address";
    if (!form.password) errs.password = "Password required";
    else if (!passwordRegex.test(form.password))
      errs.password =
        "Password must be 8-64 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isLogin) {
        const res = await login({ email: form.email, password: form.password });
        notifySuccess(res.message || "Login successful!");
        navigate("/");
      } else {
        const res = await signup({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        notifySuccess(res.message || "Sign up successful!");
        setIsLogin(true);
        navigate("/");
      }
    } catch (err) {
      notifyError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Authentication error. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      bgcolor="#f8fafc"
      pt={8}
    >
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 8px 32px 0px rgba(40,40,70,0.15)",
          bgcolor: "#192340",
          border: "1px solid rgba(255, 215, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={700}
          color="#ffd700"
          mb={2}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <>
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                fullWidth
                required
                size="small"
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  sx: {
                    bgcolor: "#232c49",
                    fontSize: "1rem",
                    color: "#fff",
                  },
                }}
                InputLabelProps={{
                  sx: { color: "#aaa", fontWeight: 500 },
                }}
              />
            </>
          )}
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            size="small"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              sx: {
                bgcolor: "#232c49",
                fontSize: "1rem",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "#aaa", fontWeight: 500 },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            size="small"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              sx: {
                bgcolor: "#232c49",
                fontSize: "1rem",
                color: "#fff",
              },
            }}
            InputLabelProps={{
              sx: { color: "#aaa", fontWeight: 500 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={submitting}
            sx={{
              mt: 1,
              py: 1,
              borderRadius: 2,
              bgcolor: "#ffd700",
              color: "#222",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": { bgcolor: "#f5c518" },
              boxShadow: "none",
            }}
          >
            {submitting
              ? isLogin
                ? "Logging In..."
                : "Signing Up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </Button>
        </form>

        <Typography
          sx={{
            textAlign: "center",
            color: "#aaa",
            fontSize: "0.93rem",
            mt: 2,
          }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Link
            component="button"
            underline="hover"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              color: "#ffc300",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.96rem",
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default AuthForm;
