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

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoginSectionData } from "../../data/LoginSectionData";

import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // validation
  const validate = () => {
    const newErrors: { username?: string; password?: string } = {}

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
      console.log("Validation failed.")
    }
  };

  return (
      <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          //backgroundColor: "#f5f5f5",
          margin: 0,
          height: "100vh",
        }}
      >
        {/* Left Column (Text Section) */}
        <Box
          sx={{
            //flex: 1,
            //backgroundColor: "#1976d2",
            backgroundImage: `url(${LoginSectionData.image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            //borderRadius: "10px",
            //margin: "12px",
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
                  color: 'white',
                }}
              >
                {LoginSectionData.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginBottom: 0.3,
                  color: 'white',
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
            paddingLeft: { xs: 0, sm: 0, md: 5.5 },
            paddingTop: { xs: 10, sm: 10, md: 0 },
            paddingBottom: { xs: 8, sm: 8, md: 0 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: '100%', md: '48%' },
              maxWidth: 500,
              padding: 3,
            }}
          >
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <img
                src={LoginSectionData.image}
                alt="Logo"
                style={{ maxWidth: "60px", width: "100%" }}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {LoginSectionData.cardTitle}
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginTop: 1 }}
            >
              {LoginSectionData.cardDescription}
            </Typography>

            <form onSubmit={handleLogin}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <TextField
                  sx={{ marginTop: 3.2, marginBottom: 0.2 }}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  error={!!errors.username}
                  helperText={
                    errors.username && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                        {errors.username}
                      </span>
                    )
                  }
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                    mt: 1.7,
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "right",
                      marginBottom: 0,
                      marginTop: 0.5,
                      fontSize: 14,
                    }}
                  >
                    <a
                      href="/forgot-password"
                      style={{ textDecoration: "none", color: "inherit", }}
                    >
                      {LoginSectionData.forgotPassword}
                    </a>
                  </Typography>
                </Box>

                <TextField
                  sx={{ marginTop: 1 }}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  error={!!errors.password}
                  helperText={
                    errors.password && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <ErrorOutlineIcon fontSize="small" color="error" />
                        {errors.password}
                      </span>
                    )
                  }
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

                {/* <FormControlLabel
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
                /> */}
              </Box>

              <Button
                onClick={handleNavigation}
                //disabled={isButtonDisabled}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 1.7,
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                {LoginSectionData.buttonText}
              </Button>
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
