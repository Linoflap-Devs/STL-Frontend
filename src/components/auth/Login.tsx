// src\components\auth\Login.tsx

import React, { useState } from "react";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { inputStyles, inputErrorStyles } from "../../styles/theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import { verifyCredentials } from "../../utils/loginValidate";
import LoginBackgroundSection from "../layout/LoginBackgroundSection";
import { loginUser } from '../../utils/api/login'; // db

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  // submit login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = await verifyCredentials(credentials.username!, credentials.password!);

    if (Object.keys(validationErrors).length === 0) {
      loginUser(credentials)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error) => {
          setErrors({ general: error.message });
        });
    } else {  
      setErrors(validationErrors);
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row", md: "row", lg: "row" },
          margin: 0,
          height: "100vh",
        }}
      >
        {/* Left Column (Text Section) */}
        <LoginBackgroundSection
          imageSrc={LoginSectionData.image2}
          logoSrc={LoginSectionData.image}
        />

        {/* Right Column (Login Card Section) */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "100%", md: "100%" },
              maxWidth: 500,
              padding: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
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
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.cardTitle}
              </Typography>
              <Typography
                sx={{ marginTop: 1, color: "#9CA3AF", fontSize: "12.5px" }}
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
                    color={errors.username || errors.general ? "error" : "text.primary"}
                  >
                    {LoginSectionData.UsernameTitle}
                  </Typography>

                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Username"
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
                    <span style={inputErrorStyles}>
                      {errors.general}
                    </span>
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
                    color={errors.password || errors.general ? "error" : "text.primary"}
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
                    <span style={inputErrorStyles}>
                      {errors.general}
                    </span>
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
                  href="/forgot-password"
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
                bottom: 35,
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
