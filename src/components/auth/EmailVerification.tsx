import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { LoginSectionData } from "../../data/LoginSectionData";

const EmailVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  useEffect(() => {
    setIsButtonDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleNavigation = () => {
    if (!isButtonDisabled) {
      router.push("/set-password");
    }
  };

  return (
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
            zIndex: 2,
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
              <ArrowBackIosNewIcon sx={{ fontSize: 23, fontWeight: "bold" }} />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
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
                marginTop: "-4rem",
              }}
              loading="lazy"
            />

            <Typography variant="h4" fontWeight="bold">
              {LoginSectionData.EmailVerificationTitle}
            </Typography>
            <Typography mt={1} color="#9CA3AF" fontSize={"12.5px"}>
              {LoginSectionData.EmailVerificationDescription}
            </Typography>

            <Box display="flex" justifyContent="center" mt={3.5}>
              <Grid
                container
                justifyContent="center"
                spacing={0.5}
                flexWrap="nowrap"
                direction="row"
              >
                {otp.map((digit, index) => (
                  <Grid item key={index}>
                    <TextField
                      id={`otp-input-${index}`}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      variant="outlined"
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: "center",
                          fontSize: "16px",
                          width: "10px !important",
                          maxWidth: "20px",
                          height: "35px",
                          outline: "none",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          padding: "4px",
                          backgroundColor: "transparent !important",
                          "& fieldset": {
                            border: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Button
              onClick={handleNavigation}
              variant="contained"
              sx={{
                mt: 0.5,
                py: 1,
                borderRadius: "8px",
                ontWeight: "bold",
                textTransform: "none",
                width: "85%",
                marginTop: "2rem",
                backgroundColor: isButtonDisabled
                  ? "#D1D5D8 !important"
                  : "#2563EB !important",
                color: isButtonDisabled
                  ? "#F1F5F9 !important"
                  : "#ffffff !important",
                fontWeight: "bold",
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
              }}
              disabled={isButtonDisabled}
            >
              {LoginSectionData.resetPasswordButton}
            </Button>
            <Typography mt={1.3} fontSize="13px">
              {LoginSectionData.resendEmailDescription}
            </Typography>
          </Box>
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
  );
};

export default EmailVerification;
