import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";

import { Visibility, VisibilityOff, ErrorOutline } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Validation
  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!credentials.username) newErrors.username = "Username is required";
    if (!credentials.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login Successful", credentials);
    }
  };

  // temporary link to admin w/ temporary validation
  const handleNavigation = () => {
    const isValid = validate();

    if (isValid) {
      router.push("/managers");
    } else {
      console.log("Validation failed.");
    }
  };

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#2D2D2D",
          p: 4,
        }}
      >
        <Box component="img" src={LoginSectionData.image} alt="Logo" sx={{ maxWidth: "45%" }} />
      </Box>

      {/* Right Section */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 450, p: 3, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            {LoginSectionData.cardTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {LoginSectionData.cardDescription}
          </Typography>

          <form onSubmit={handleLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
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
                    <ErrorOutline fontSize="small" color="error" />
                    {errors.username}
                  </span>
                )}
              </Box>

              {/* Password Input */}
              <Box>
                <Typography sx={{ display: "block", textAlign: "left", marginBottom: "0.5rem" }} color={errors.password ? "error" : "text.primary"}>Password</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  sx={inputStyles}
                  InputProps={{
                    endAdornment: (
                      <IconButton style={{}} onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                {errors.password && (
                  <span style={inputErrorStyles}>
                    <ErrorOutline fontSize="small" color="error" />
                    {errors.password}
                  </span>
                )}

                {/* Forgot Password */}
                <Typography sx={{ textAlign: "right", fontSize: 13.9, marginTop: '0.4rem' }}>
                  <a href="/forgot-password" style={{ textDecoration: "none", color: "#2563EB", fontWeight: "bold" }}>
                    {LoginSectionData.forgotPassword}
                  </a>
                </Typography>

              </Box>

              {/* Login Button */}
              <Button type="submit" variant="contained" color="primary" onClick={handleNavigation} sx={{ mt: 1, py: 1.5, fontSize: "16px", padding: "8px 20px", borderRadius: "8px", textTransform: "none", backgroundColor: "#2563EB", }}>
                Login
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
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

export default LoginPage;