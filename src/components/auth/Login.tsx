import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
//import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { LoginSectionData } from "../../data/LoginSectionData";

import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    //console.log(username, password);
  };

  const handleNavigation = () => { // temporary link to dashboard
    router.push("/dashboard");
  };

  const isButtonDisabled = !username || !password;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          backgroundColor: "#f5f5f5",
          margin: 0,
          height: "100vh",
        }}
      >
        {/* Left Column (Text Section) */}
        <Box
          sx={{
            flex: 1,
            //backgroundColor: "#1976d2",
            backgroundImage: `url(${LoginSectionData.image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            //borderRadius: "16px",
            //margin: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100vh",
            }}
          >
            <ConfirmationNumberIcon sx={{ fontSize: 85, color: "white" }} />

            <Box
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  marginBottom: 1,
                }}
              >
                {LoginSectionData.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 0.3,
                }}
              >
                {LoginSectionData.description}
              </Typography>
            </Box>
          </Box>

        </Box>

        {/* Right Column (Login Card Section) */}
        <Box
          sx={{
            flex: 1,
            paddingLeft: { xs: 2, sm: 4, md: 5.5 },
            paddingTop: { xs: 0, sm: 0, md: 8 },
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "75%",
              maxWidth: 500,
              padding: 3,
            }}
          >
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <img
                src={LoginSectionData.image}
                alt="Logo"
                style={{ maxWidth: "75px", width: "100%" }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: "bold" }}
            >
              {LoginSectionData.cardTitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: 1, color: "text.secondary" }}
            >
              {LoginSectionData.cardDescription}
            </Typography>

            <form onSubmit={handleLogin}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  sx={{
                    marginTop: 3.2,
                    marginBottom: 0.2,
                  }}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        padding: 0.5,
                      }}
                    />
                  }
                  label={
                    <Typography variant="subtitle2">
                      {LoginSectionData.rememberMe}
                    </Typography>
                  }
                />
              </Box>

              <Button
                onClick={handleNavigation}
                disabled={isButtonDisabled}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: "8px 20px",
                  borderRadius: "8px",
                }}
              >
                {LoginSectionData.buttonText}
              </Button>

              <Typography
                variant="subtitle2"
                sx={{
                  marginTop: 2.9,
                  textAlign: "center",
                }}
              >
                <a
                  href="/forgot-password"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {LoginSectionData.forgotPassword}
                </a>
              </Typography>
            </form>
          </Box>

          {/* Copyright Text */}
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: 15,
              color: "#888",
              fontSize: "12px",
            }}
          >
            <Typography variant="body2">
              {LoginSectionData.copyright}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
