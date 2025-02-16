// src\components\auth\Login.tsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { inputStyles, inputErrorStyles } from "../../styles/theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import { verifyCredentials } from "../../utils/loginValidate";
import { loginUser } from "../../utils/api/login"; // db

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("Checking authentication status...");

    // Fetching the token
    const token = localStorage.getItem("accessToken");
    console.log("Checking localStorage:", localStorage.getItem("accessToken"));

    if (!token) {
      console.log("No valid auth found! Redirecting to login...");
      router.replace("/auth/login");
    }
  }, []);

  // submit login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const userData = await loginUser(credentials, router);

      console.log("Login successful! Storing token...");
      const token = localStorage.getItem("accessToken");
      console.log("Token inside useAuth.ts:", token);

      setTimeout(() => {
        console.log(
          "Verifying stored token:",
          localStorage.getItem("accessToken")
        );
        router.replace("/dashboard");
      }, 100);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Login failed. Please try again.",
      }));
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          margin: 0,
          height: "100vh",
          backgroundImage: `url(${LoginSectionData.image2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* overlay  */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#242424D9",
            zIndex: 1,
          }}
        />
        {/* start content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "100%" },
              maxWidth: 500,
              p: "2.5rem 1.2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#242424",
              borderRadius: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <Box
                component="img"
                src={LoginSectionData.image}
                alt="altLogo"
                sx={{
                  maxWidth: {
                    xs: "10%",
                    sm: "35%",
                    md: "32%",
                    lg: "32%",
                    xl: "32%",
                  },
                  margin: "0 auto",
                  display: "block",
                  marginBottom: "0.7rem",
                }}
                loading="lazy"
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", marginTop: "-0.5rem" }}
              >
                {LoginSectionData.cardTitle}
              </Typography>
              <Typography
                sx={{ marginTop: 0.3, color: "#9CA3AF", fontSize: "12.5px" }}
              >
                {LoginSectionData.cardDescription}
              </Typography>
            </Box>

            <form onSubmit={handleLogin} style={{ width: "88%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  width: "100%",
                }}
              >
                <Box sx={{ mb: "0.3rem" }}>
                  <Typography
                    sx={{
                      display: "block",
                      textAlign: "left",
                      marginBottom: "0.5rem",
                    }}
                    color={
                      errors.username || errors.general
                        ? "error"
                        : "text.primary"
                    }
                  >
                    {LoginSectionData.EmailAddressTitle}
                  </Typography>

                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Email Address"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    error={!!errors.username}
                    sx={inputStyles}
                  />
                  {errors.username && (
                    <span style={inputErrorStyles}>{errors.username}</span>
                  )}

                  {errors.general && (
                    <span style={inputErrorStyles}>{errors.general}</span>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: 1.7,
                  }}
                ></Box>

                <Box>
                  <Typography
                    sx={{
                      display: "block",
                      textAlign: "left",
                      marginBottom: "0.5rem",
                    }}
                    color={
                      errors.password || errors.general
                        ? "error"
                        : "text.primary"
                    }
                  >
                    {LoginSectionData.PasswordTitle}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    error={!!errors.password || !!errors.general}
                    sx={inputStyles}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          sx={{ color: "#9CA3AF", fontSize: "1.3rem" }}
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: "inherit" }} />
                          ) : (
                            <Visibility sx={{ fontSize: "inherit" }} />
                          )}
                        </IconButton>
                      ),
                    }}
                  />
                  {errors.password && (
                    <span style={inputErrorStyles}>{errors.password}</span>
                  )}

                  {errors.general && (
                    <span style={inputErrorStyles}>{errors.general}</span>
                  )}
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 3.5,
                  py: 1.5,
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#2563EB",
                  fontWeight: "bold",
                }}
              >
                {LoginSectionData.buttonText}
              </Button>

              {/* Forgot Password */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 13,
                  marginTop: "0.8rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <a
                  href="/auth/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "#2563EB",
                    fontWeight: "bold",
                  }}
                >
                  {LoginSectionData.forgotPassword}
                </a>
              </Typography>
            </form>

            <Box
              sx={{
                position: "absolute",
                bottom: 60,
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              <Typography sx={{ fontSize: "13px" }}>
                {LoginSectionData.copyright}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
