import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import { loginValidate } from "../../utils/validation";

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // validation
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
          backgroundImage: `url('${LoginSectionData.image2}')`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <Box component="img" src={LoginSectionData.image} alt="Logo" sx={{ maxWidth: "40%" }} />
      </Box>

      {/* Right Section */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 450, p: 3, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">
            {LoginSectionData.cardTitle}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#9CA3AF' }}>
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
                    {errors.username}
                  </span>
                )}
              </Box>

              {/* Password Input */}
              <Box>
                <Typography
                  sx={{
                    display: "block",
                    textAlign: "left",
                    marginBottom: "0.5rem"
                  }}
                  color={errors.password ? "error" : "text.primary"}>
                  Password
                </Typography>
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
                      <IconButton
                        sx={{ color: '#9CA3AF', fontSize: '1.3rem', }}
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ?
                          <VisibilityOff sx={{ fontSize: 'inherit' }} /> :
                          <Visibility sx={{ fontSize: 'inherit' }} />}
                      </IconButton>
                    ),
                  }}
                />
                {errors.password && (
                  <span style={inputErrorStyles}>
                    {errors.password}
                  </span>
                )}
              </Box>

              {/* Login Button */}
              <Button type="submit"
                variant="contained"
                color="primary"
                onClick={handleNavigation}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "16px",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#2563EB",
                }}>
                Login
              </Button>

              {/* Forgot Password */}
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 13.9,
                  marginTop: '-5px'

                }}>
                <a href="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: "#2563EB",
                    fontWeight: "bold"
                  }}>
                  {LoginSectionData.forgotPassword}
                </a>
              </Typography>
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