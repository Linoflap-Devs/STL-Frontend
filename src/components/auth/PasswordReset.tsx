import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";

import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LoginBackgroundSection from "../layout/LoginBackgroundSection";

const PasswordReset = () => {
  const router = useRouter();

  // temporary navigation
  const handleNavigation = () => {
    router.push("/");
  };

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
                position: "absolute",
                left: 30,
                top: 30,
                color: "#D1D5D8"[300],
                backgroundColor: "#374151",
                fontWeight: "bold",
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 25, fontWeight: "bold" }} />
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
                marginBottom: "1rem",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.PasswordResetTitle}
              </Typography>
              <Typography
                sx={{ marginTop: 1, color: "#9CA3AF", fontSize: "12.5px" }}
              >
                {LoginSectionData.PasswordResetDescription}
              </Typography>
            </Box>

            <Box style={{ width: "75%" }}>
              <Button
                type="button"
                onClick={handleNavigation}
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 1,
                  py: 1.5,
                  padding: "8px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#2563EB !important",
                  color: "#F1F5F9 !important",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {LoginSectionData.ConfirmButton}
              </Button>
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 35,
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
      </Box>
    </>
  );
};

export default PasswordReset;
