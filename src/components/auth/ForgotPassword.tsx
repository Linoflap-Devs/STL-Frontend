import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip
} from "@mui/material";

import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import { loginValidate } from "../../utils/validation";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LoginBackgroundSection from '../layout/LoginBackgroundSection';
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Validation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = loginValidate(credentials);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login Successful.", credentials)
    } else {
      setErrors(validationErrors);
    }
  }

  // temporary validation
  const handleNavigation = () => {
    const validationErrors = loginValidate(credentials);
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
        
        <Tooltip title={"Back to Login"}>
        <IconButton
          aria-label="close"
          href="/"
          sx={{
            position: 'absolute',
            left: 30,
            top: 30,
            color: '#D1D5D8'[300],
            backgroundColor: '#374151',
            fontWeight: 'bold',
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 25, fontWeight: 'bold' }} />
        </IconButton>
        </Tooltip>

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
                marginBottom: '1rem',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.forgotPasswordTitle}
              </Typography>
              <Typography sx={{ marginTop: 1, color: '#9CA3AF', fontSize: '12.5px' }}>
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
                <Box sx={{ mb: '0.3rem' }}>
                  <Typography
                    sx={{
                      display: "block",
                      textAlign: "left",
                      marginBottom: "0.5rem",
                    }}
                    color={errors.username ? "error" : "text.primary"}
                  >
                    Username
                  </Typography>

                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    error={!!errors.username}
                    sx={inputStyles}
                  />
                  {errors.username && (
                    <span style={inputErrorStyles}>
                      {errors.username}
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
                    backgroundColor: isButtonDisabled ? "#D1D5D8 !important" : "#2563EB !important",
                    color: isButtonDisabled ? "#F1F5F9 !important" : "#ffffff !important",
                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                }}
                disabled={isButtonDisabled}
                >
                {LoginSectionData.resetPasswordButton}
                </Button>
            
            </form>
            <Box
              sx={{
                position: "absolute",
                bottom: 35,
                textAlign: "center",
                color: "#FFFFFF",
              }}
            >
              <Typography
                sx={{ fontSize: "13px" }}>
                {LoginSectionData.copyright}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#D1D5DB", padding: "14px 40px 10px 14px", },
    "&.Mui-error fieldset": { borderColor: "#F05252" },
  },
};

const inputErrorStyles = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  color: "#F05252",
  marginTop: "4px",
  fontSize: "12px",
};


export default ForgotPassword;