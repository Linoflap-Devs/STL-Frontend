import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { LoginSectionData } from "../../data/LoginSectionData";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100vh",
          backgroundColor: "#f5f5f5",
          margin: 0,
        }}
      >
        {/* Left Column (Text Section) */}
        <Box
          sx={{
            flex: 1,
            //backgroundColor: "#1976d2",
            backgroundImage: `url(${LoginSectionData.image2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "16px",
            margin: "23px",
          }}
        >
          <ConfirmationNumberIcon sx={{ fontSize: 85, color: "white" }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              marginBottom: 0.3,
              marginTop: { xs: 4, sm: 5, md: 85 },
              textAlign: "start",
            }}
          >
            {LoginSectionData.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1.5,
              textAlign: "start",
            }}
          >
            {LoginSectionData.description}
          </Typography>
        </Box>

        {/* Right Column (Login Card Section) */}
        <Box
          sx={{
            //flex: 1,
            paddingLeft: { xs: 2, sm: 4, md: 5.5 }, // Adjust padding for different screen sizes
            paddingTop: { xs: 0, sm: 0, md: 8 }, // Adjust padding for different screen sizes
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              padding: 3,
            }}
          >
            <Box sx={{ textAlign: "center", marginBottom: 2 }}>
              <img
                src={LoginSectionData.image}
                alt="Logo"
                style={{ maxWidth: "90px", width: "100%" }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
              {LoginSectionData.cardTitle}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ marginTop: 1.3, color: "text.secondary" }}
            >
              {LoginSectionData.cardDescription}
            </Typography>

            <form onSubmit={handleLogin}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  sx={{
                    marginTop: 2.5,
                    marginBottom: 0.2,
                  }}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <FormControlLabel
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
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 0.1,
                    marginTop: 0.2,
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 2,
                  padding: "11px 20px",
                  borderRadius: "8px",
                }}
              >
                {LoginSectionData.buttonText}
              </Button>

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  marginTop: 3,
                  textAlign: "center",
                }}
              >
                <a
                  href="/forgot-password"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {LoginSectionData.forgotPassword}
                </a>
              </Typography>
            </form>
          </Box>

          {/* Copyright Text */}
          <Box
            sx={{
              position: "absolute",
              bottom: 21,
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
