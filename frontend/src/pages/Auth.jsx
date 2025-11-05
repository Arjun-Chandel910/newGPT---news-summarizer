import React, { useState } from "react";
import { Box, Button, Card, TextField, Typography, Link } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useAuth } from "../context/AuthProvider";
import { notifyError, notifySuccess } from "../utils/Toast.js";
import { useNavigate } from "react-router-dom";

const emailRegex = /\S+@\S+\.\S+/;

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
    else if (!isLogin && form.username.length < 3)
      errs.username = "Username too short";
    if (!form.email.trim()) errs.email = "Email required";
    else if (!emailRegex.test(form.email)) errs.email = "Email invalid";
    if (!form.password) errs.password = "Password required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 chars";
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
      alignItems="center"
      justifyContent="center"
      bgcolor="#f8fafc"
    >
      <Card
        sx={{
          p: 2.5,
          borderRadius: 2.5,
          maxWidth: 330,
          width: "100%",
          boxShadow: "0 6px 28px 0px rgba(40,40,70,0.10)",
          bgcolor: "#192340",
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

        <Box textAlign="center" my={2}>
          <Typography color="#aaa" fontSize="0.95rem">
            or
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={1} mt={1}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon fontSize="small" />}
            fullWidth
            sx={{
              borderRadius: 2,
              borderColor: "#ffd700",
              color: "#ffd700",
              background: "#232c49",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.97rem",
              "&:hover": { bgcolor: "#222a40", borderColor: "#fcc302" },
            }}
            onClick={() => {
              /* add Oauth later */
            }}
          >
            {isLogin ? "Login" : "Sign Up"} with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<LinkedInIcon fontSize="small" />}
            fullWidth
            sx={{
              borderRadius: 2,
              borderColor: "#2867B2",
              color: "#66b2ff",
              background: "#232c49",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.97rem",
              "&:hover": { bgcolor: "#212a3f", borderColor: "#254b73" },
            }}
            onClick={() => {
              /* add Oauth later */
            }}
          >
            {isLogin ? "Login" : "Sign Up"} with LinkedIn
          </Button>
        </Box>
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
