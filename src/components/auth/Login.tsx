import React, { useState } from "react";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/router";
import { LoginSectionData } from "../../data/LoginSectionData";
import { loginUser } from "../../utils/api/login";
import { inputStyles, inputErrorStyles } from "../../styles/theme";

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setErrors({});

    try {
      const response = await loginUser(credentials, router);
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Login failed." });
      setIsLoggingIn(false);
    }
  };

  const handleTogglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundImage: `url(${LoginSectionData.image2})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#242424D9",
          zIndex: 1,
        }}
      />
      {/* Content */}
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
            width: { xs: "90%", sm: "60%", md: "40%" },
            maxWidth: 500,
            p: "2.4rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#181A1B",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ textAlign: "center", marginBottom: "1rem", marginTop: 2, }}>
            <Box
              component="img"
              src={LoginSectionData.image}
              alt="altLogo"
              sx={{ maxWidth: "60%", margin: "0 auto 0.7rem", }}
              loading="lazy"
            />
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {LoginSectionData.cardTitle}
            </Typography>
            <Typography sx={{ color: "#9CA3AF", fontSize: "12.5px" }}>
              {LoginSectionData.cardDescription}
            </Typography>
          </Box>
          <form onSubmit={handleLogin} style={{ width: "85%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <Box sx={{ mb: "1rem" }}>
                <Typography
                  sx={{ textAlign: "left", marginBottom: "0.5rem" }}
                  color={errors.email || errors.general ? "#FF7A7A" : "text.primary"}
                >
                  {LoginSectionData.EmailAddressTitle}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Email Address"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  error={!!errors.email || !!errors.general}
                  sx={inputStyles}
                />
                {errors.email && <span style={inputErrorStyles}>{errors.email}</span>}
                {errors.general && <span style={inputErrorStyles}>{errors.general}</span>}
              </Box>
              <Box>
                <Typography
                  sx={{ textAlign: "left", marginBottom: "0.5rem" }}
                  color={errors.password || errors.general ? "#FF7A7A" : "text.primary"}
                >
                  {LoginSectionData.PasswordTitle}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  error={!!errors.password || !!errors.general}
                  sx={inputStyles}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        sx={{ color: "#9CA3AF", fontSize: "1.3rem" }}
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                {errors.password && <span style={inputErrorStyles}>{errors.password}</span>}
                {errors.general && <span style={inputErrorStyles}>{errors.general}</span>}
              </Box>
            </Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoggingIn}
              sx={{
                mt: 3,
                py: 1.1,
                borderRadius: "8px",
                textTransform: "none",
                color: "#181A1B",
              }}
            >
              {isLoggingIn ? "Logging in..." : LoginSectionData.buttonText}
            </Button>

            {/* Forgot Password */}
            <Typography sx={{ textAlign: "center", fontSize: 13, mt: "0.5rem" }}>
              <a href="/auth/forgot-password" style={{ textDecoration: "none", color: '#67ABEB', }}>
                {LoginSectionData.forgotPassword}
              </a>
            </Typography>
          </form>

          {/* Footer */}
          <Box sx={{ position: "absolute", bottom: 30, textAlign: "center", }}>
            <Typography sx={{ fontSize: "13px" }}>{LoginSectionData.copyright}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
