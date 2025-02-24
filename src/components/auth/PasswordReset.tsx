import React, { useState, useEffect } from "react";
import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material";

import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const PasswordReset = () => {
  const router = useRouter();

  // temporary navigation
  const handleNavigation = () => {
    router.push("/auth/login");
  };

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
              maxWidth: 470,
              p: "9rem 0.3rem",
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
                  marginTop: "-2rem",
                }}
                loading="lazy"
              />

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {LoginSectionData.PasswordResetTitle}
              </Typography>
              <Typography
                sx={{ marginTop: 0.4, color: "#9CA3AF", fontSize: "12.5px" }}
              >
                {LoginSectionData.PasswordResetDescription}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1.7,
                }}
              ></Box>
            </Box>

            <Button
              type="button"
              onClick={handleNavigation}
              variant="contained"
              fullWidth
              sx={{
                marginTop: 0,
                py: 1.5,
                width: "90%",
                padding: "8px 20px",
                borderRadius: "8px",
                textTransform: "none",
                backgroundColor: "#2563EB !important",
                color: "#181A1B !important",
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
    </>
  );
};

export default PasswordReset;
