import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Grid
} from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoginBackgroundSection from "../../components/auth/LoginBackgroundSection";
import { LoginSectionData } from "../../data/LoginSectionData";

const EmailVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(otp.some((digit) => digit === ""));
  }, [otp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
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

  const handleBackspace = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleNavigation = () => {
    if (!isButtonDisabled) {
      router.push("/password-reset");
    }
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} height="100vh">
      <LoginBackgroundSection imageSrc={LoginSectionData.image2} logoSrc={LoginSectionData.image} />

      <Box flex={1} display="flex" justifyContent="center" alignItems="center" position="relative">
        <Tooltip title="Back to Forgot Password">
          <IconButton href="/forgot-password" sx={{ position: "absolute", left: 30, top: 30, color: "#D1D5D8", backgroundColor: "#374151" }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 25 }} />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: "100%", maxWidth: 600, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            {LoginSectionData.EmailVerificationTitle}
          </Typography>
          <Typography mt={1} color="#9CA3AF" fontSize={"12.5px"}>
            {LoginSectionData.EmailVerificationDescription}
          </Typography>

          <Box display="flex" justifyContent="center" mt={3.5}>
            <Grid container justifyContent="center" spacing={0.5} flexWrap="nowrap" direction="row">
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
                width: '65%', 
                marginTop: '2rem',
                backgroundColor: isButtonDisabled ? "#D1D5D8 !important" : "#2563EB !important",
                color: isButtonDisabled ? "#F1F5F9 !important" : "#ffffff !important",
                fontWeight: 'bold',
                cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
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
    </Box>
  );
};

export default EmailVerification;
