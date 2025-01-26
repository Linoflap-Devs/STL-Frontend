import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  //Checkbox,
  //FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoginSectionData } from "../../data/LoginSectionData";

import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // validation
  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // return true if no errors
  };

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // console.log(username, password);
    if (validate()) {
      console.log("Login Successful", { username, password });
    } else {
      console.log("Validation failed.");
    }
  };

  //const isButtonDisabled = !username || !password;

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // temporary link to admin w/ temporary validation
  const handleNavigation = () => {
    const isValid = validate();

    if (isValid) {
      router.push("/users");
    } else {
      console.log("Validation failed.");
    }
  };

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
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#2D2D2D",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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
            <Box
              sx={{
                marginBottom: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                component="img"
                src={LoginSectionData.image}
                alt="Logo"
                sx={{
                  maxWidth: {
                    xs: "60%",
                    sm: "60%",
                    md: "60%",
                    lg: "50%",
                    xl: "40%",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

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
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.cardTitle}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
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
                <div style={{ marginTop: "24px", marginBottom: "4px" }}>
                  <label
                    htmlFor="username"
                    style={{
                      display: "block",
                      marginBottom: "0.6rem",
                      fontSize: "16px",
                      color: errors.username ? "#F05252" : "#FFFFFF",
                    }}
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      fontSize: "14px",
                      borderRadius: "8px",
                      border: errors.username
                        ? "1px solid #F05252"
                        : "1px solid #D1D5DB",
                      outline: "none",
                      backgroundColor: "#374151",
                      color: "#ffffff",
                      caretColor: "#D1D5DB",
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.style.borderColor = "#D1D5DB";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.style.borderColor = "#374151";
                    }}
                  />
                  {errors.username && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#F05252",
                        marginTop: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <ErrorOutlineIcon fontSize="small" color="error" />
                      {errors.username}
                    </span>
                  )}
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: 1.7,
                  }}
                ></Box>

                <div
                  style={{
                    marginTop: "7px",
                    marginBottom: "5px",
                    position: "relative",
                  }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      marginBottom: "0.6rem",
                      fontSize: "16px",
                      color: errors.password ? "#F05252" : "#FFFFFF",
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={password}
                      placeholder="Enter Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 40px 10px 12px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        border: errors.password
                          ? "1px solid #F05252"
                          : "1px solid #D1D5DB",
                        outline: "none",
                        backgroundColor: "#374151",
                        color: "#ffffff",
                        caretColor: "#D1D5DB",
                        transition: "border-color 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.style.borderColor = "#D1D5DB";
                      }}
                      onMouseLeave={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.style.borderColor = "#374151";
                      }}
                    />
                    {/* Password Toggle Icon */}
                    <button
                      type="button"
                      onClick={handleTogglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#D1D5DB",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                  </div>
                  {errors.password && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "#F05252",
                        marginTop: "4px",
                        fontSize: "12px",
                      }}
                    >
                      <ErrorOutlineIcon fontSize="small" color="error" />
                      {errors.password}
                    </span>
                  )}
                </div>

                <Typography
                  sx={{
                    textAlign: "right",
                    marginBottom: 1,
                    marginTop: 0.2,
                    fontSize: 13.9,
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
              </Box>

              <Button
                onClick={handleNavigation}
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#2563EB",
                }}
              >
                {LoginSectionData.buttonText}
              </Button>
            </form>

            <Box
              sx={{
                position: "absolute",
                bottom: 35,
                textAlign: "center",
                color: "#FFFFFF",
                fontSize: "8px",
              }}
            >
              <Typography variant="body2">
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
