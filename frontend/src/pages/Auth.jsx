import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#fff"
    >
      <Card
        sx={{
          p: 2.2,
          borderRadius: 3,
          maxWidth: 280,
          width: "100%",
          boxShadow: "0px 7px 32px -8px rgba(40,40,70,0.18)",
          border: "1.5px solid #ececec",
          bgcolor: "#101a2c",
        }}
      >
        <Box display="flex" justifyContent="center" gap={0.5} mb={1}>
          <Button
            variant={isLogin ? "contained" : "text"}
            color="primary"
            onClick={() => setIsLogin(true)}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              minWidth: 54,
              py: 0.3,
              textTransform: "none",
              fontSize: "0.97rem",
              boxShadow: isLogin ? "0 1px 4px rgba(60,60,60,.11)" : "",
            }}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "contained" : "text"}
            color="primary"
            onClick={() => setIsLogin(false)}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              minWidth: 54,
              py: 0.3,
              textTransform: "none",
              fontSize: "0.97rem",
              boxShadow: !isLogin ? "0 1px 4px rgba(60,60,60,.11)" : "",
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.9,
            mt: 1,
          }}
        >
          {!isLogin && (
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
              size="small"
              InputProps={{
                sx: {
                  bgcolor: "#192340",
                  fontSize: "0.96rem",
                  color: "#fff",
                },
              }}
              InputLabelProps={{ sx: { fontSize: "0.95rem", color: "#aaa" } }}
            />
          )}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            size="small"
            InputProps={{
              sx: {
                bgcolor: "#192340",
                fontSize: "0.96rem",
                color: "#fff",
              },
            }}
            InputLabelProps={{ sx: { fontSize: "0.95rem", color: "#aaa" } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            size="small"
            InputProps={{
              sx: {
                bgcolor: "#192340",
                fontSize: "0.96rem",
                color: "#fff",
              },
            }}
            InputLabelProps={{ sx: { fontSize: "0.95rem", color: "#aaa" } }}
          />
          {isLogin && (
            <FormControlLabel
              control={<Checkbox color="primary" size="small" />}
              label={
                <Typography color="#bbb" fontSize="0.93rem">
                  Remember me
                </Typography>
              }
              sx={{ alignSelf: "flex-start", my: -0.3 }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 0.8,
              py: 1,
              fontWeight: "bold",
              borderRadius: 2,
              bgcolor: "#ffd700",
              color: "#212a3f",
              textTransform: "none",
              fontSize: "0.99rem",
              minHeight: 36,
              "&:hover": { bgcolor: "#f5c518" },
              boxShadow: "0 2px 8px rgba(20,20,20,0.09)",
            }}
            fullWidth
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </Box>

        <Divider sx={{ my: 1.5, color: "#2a304a" }}>or</Divider>

        <Box display="flex" flexDirection="column" gap={0.7}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon fontSize="small" />}
            fullWidth
            sx={{
              borderRadius: 2,
              borderColor: "#ffd700",
              color: "#ffd700",
              background: "#181f2c",
              fontWeight: "bold",
              textTransform: "none",
              minHeight: 34,
              fontSize: "0.97rem",
              "&:hover": { bgcolor: "#23272a", borderColor: "#fcc302" },
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
              background: "#181f2c",
              fontWeight: "bold",
              textTransform: "none",
              minHeight: 34,
              fontSize: "0.97rem",
              "&:hover": { bgcolor: "#212a3f", borderColor: "#254b73" },
            }}
          >
            {isLogin ? "Login" : "Sign Up"} with LinkedIn
          </Button>
        </Box>

        <Typography
          sx={{ textAlign: "center", color: "#aaa", fontSize: "0.9rem", mt: 1 }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              color: "#ffc300",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.92rem",
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
