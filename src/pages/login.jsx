import React from "react";
import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  // console.log(process.env.GOOGLE_API_KEY)
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
     
      alert(`Welcome, ${user.displayName}`);
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1920&q=80)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 320,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Sign In to Continue
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            backgroundColor: "#4285F4",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#3367D6",
            },
          }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
