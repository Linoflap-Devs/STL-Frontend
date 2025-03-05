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

  //By default button is disabled.
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  //check whether the email fields i empty or invalid.
  // Function to validate email field
  const validateCredentials = (credentials: { username: string }) => {
    let errors: { username?: string } = {};

    if (!credentials.username.trim()) {
      errors.username = "Email Address is Required.";
    } else if (
      //Regular Expression(regex) - for validating email format
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.username)
    ) {
      errors.username = "Please enter a valid email address.";
    }

    return errors;
  };

  // Handle form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCredentials(credentials);

    //If no errors exist, returns an empty array ( [] )
    //if array is empty, meaning no errors exist.
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login Successful.", credentials);
      setErrors({}); // Clear errors if successful
    } else {
      setErrors(validationErrors);
    }
  };

  // temporary validation
  const handleNavigation = () => {
    const validationErrors = validateCredentials(credentials);
    // setErrors(validationErrors)
    //If no errors exist, returns an empty array ( [] )
    //if array is empty, meaning no errors exist.
    if (Object.keys(validationErrors).length === 0) {
      router.push("/email-verification");
    } else {
      setErrors(validationErrors)
    }
  };

  // Disable button if email is empty
  // useEffect(() => {
  //   setIsButtonDisabled(credentials.username.trim() === "");
  // }, [credentials.username]);

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
              backgroundColor: "#181A1B",
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
                    helperText={errors.username}
                    sx={inputStyles}
                  />
                  {/* {errors.username === "required" && (
                    <span style={inputErrorStyles}>Email Address is Required.</span>
                  )}
                  {errors.username === "invalid" && (
                    <span style={inputErrorStyles}>Please enter a valid email address.</span> */}
                  {/* )} */}
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
                  //backgroundColor: isButtonDisabled ? "#2563EB" : "#CCA1FD",
                  cursor: isButtonDisabled ? "not-allowed" : "pointer",
                }}

                disabled={false}
              >
                {LoginSectionData.resetPasswordButton}
              </Button>
            </form>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 40,
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