import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";

import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
//import { loginValidate } from "../../utils/validation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { inputStyles, inputErrorStyles } from "../../styles/theme";

const ForgotPassword = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "" });
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Validation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = credentials;
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login Successful.", credentials);
    } else {
      setErrors(validationErrors);
    }
  };

  // temporary validation
  const handleNavigation = () => {
    const validationErrors = credentials;
    if (Object.keys(validationErrors).length === 0) {
      router.push("/email-verification");
    } else {
      console.log("Validation failed.");
    }
  };

  useEffect(() => {
    setIsButtonDisabled(credentials.username.trim() === "");
  }, [credentials.username]);

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
        <Box
          sx={{
            position: "absolute",
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
              p: "8rem 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#242424",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            <Tooltip title={"Back to Login"}>
              <IconButton
                aria-label="close"
                href="/"
                sx={{
                  position: "absolute",
                  left: 30,
                  top: 40,
                  color: "#D1D5D8"[300],
                  backgroundColor: "#374151",
                  fontWeight: "bold",
                }}
              >
                <ArrowBackIosNewIcon
                  sx={{ fontSize: 23, fontWeight: "bold" }}
                />
              </IconButton>
            </Tooltip>

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
                  marginBottom: "0.6rem",
                  marginTop: '-4rem',
                }}
                loading="lazy"
              />

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.forgotPasswordTitle}
              </Typography>
              <Typography
                sx={{ marginTop: 0.4, color: "#9CA3AF", fontSize: "12.5px" }}
              >
                {LoginSectionData.forgotPasswordDescription}
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
                    color={errors.username ? "error" : "text.primary"}
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
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: 1.7,
                  }}
                ></Box>
              </Box>

              <Button
                type="submit"
                onClick={handleNavigation}
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 1,
                  py: 1.5,
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: isButtonDisabled
                    ? "#D1D5D8 !important"
                    : "#2563EB !important",
                  color: isButtonDisabled
                    ? "#F1F5F9 !important"
                    : "#ffffff !important",
                  cursor: isButtonDisabled ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
                disabled={isButtonDisabled}
              >
                {LoginSectionData.resetPasswordButton}
              </Button>
            </form>
          </Box>
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
    </>
  );
};

export default ForgotPassword;
