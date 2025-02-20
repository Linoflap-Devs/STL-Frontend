import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginSectionData } from "../../data/LoginSectionData";
import { useRouter } from "next/router";
//import { loginValidate } from "../../utils/validation";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { inputStyles, inputErrorStyles } from "../../styles/theme";
import Swal from "sweetalert2";

const LoginPage = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    newpassword: "",
    setpassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    newpassword?: string;
    setpassword?: string;
    passwordMismatch?: string;
    passwordLimit?: string;
  }>({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


   // Validation Function
   const validatePasswords = () => {
    const { newpassword, setpassword } = credentials;
    const trimmedNewPassword = newpassword.trim();
    const trimmedSetPassword = setpassword.trim();
  
    let newErrors: { passwordMismatch?: string; passwordLimit?: string } = {};
  
    // Step 1: Check if passwords match
    if (trimmedNewPassword !== trimmedSetPassword) {
      newErrors.passwordMismatch = "Passwords do not match";
    } else {
      // Step 2: If passwords match, validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(trimmedNewPassword)) {
        newErrors.passwordLimit =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }
    }
  
    // Set errors in state
    setErrors(newErrors);
  
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
    
      // Stop submission if passwords don't match or don't meet criteria
      if (!validatePasswords()) return;
    
      // If no errors exist, show the success alert
      if (!errors.passwordLimit && !errors.passwordMismatch) {
        console.log("Login Successful.", credentials);
    
        Swal.fire({
          title: "Success!",
          text: "New password has been set, you will be directed to the login page.",
          icon: "success",
          confirmButtonText: "Redirect",
          confirmButtonColor: "#7565DE",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      }
    };
    

  const handleTogglePasswordVisibility = (
    type: "newpassword" | "setpassword"
  ) => {
    if (type === "newpassword") {
      setShowPassword((prev) => !prev);
    } else if (type === "setpassword") {
      setConfirmPassword((prev) => !prev);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(
      credentials.newpassword.trim() === "" &&
        credentials.setpassword.trim() === ""
    );
  }, [credentials.newpassword, credentials.setpassword]);

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

        {/* Right Column (Login Card Section) */}
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
              p: "2.8rem 0rem",
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
                  top: 30,
                  color: "#D1D5D8"[300],
                  backgroundColor: "#374151",
                  fontWeight: "bold",
                }}
              >
                <ArrowBackIosNewIcon
                  sx={{ fontSize: 25, fontWeight: "bold" }}
                />
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
                    marginTop: "-1rem",
                  }}
                  loading="lazy"
                />
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {LoginSectionData.SetNewPasswordTitle}
                </Typography>
                <Typography
                  sx={{ marginTop: 0.3, color: "#9CA3AF", fontSize: "12.5px" }}
                >
                  {LoginSectionData.SetNewPasswordDescription}
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
                  <Box sx={{ marginBottom: "1.5rem" }}>
                    <Typography
                      sx={{
                        display: "block",
                        textAlign: "left",
                        marginBottom: "0.5rem",
                      }}
                      color={errors.newpassword ? "error" : "text.primary"}
                    >
                      {LoginSectionData.PasswordTitle}
                    </Typography>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.newpassword}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            newpassword: e.target.value,
                          })
                        }
                        sx={{
                          ...inputStyles,
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: errors.passwordLimit ? "#F05252 !important" : undefined,
                            },
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              sx={{ color: "#9CA3AF", fontSize: "1.3rem" }}
                              onClick={() => handleTogglePasswordVisibility("newpassword")}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff sx={{ fontSize: "inherit" }} />
                              ) : (
                                <Visibility sx={{ fontSize: "inherit" }} />
                              )}
                            </IconButton>
                          ),
                        }}
                      />
                      

                    {/* {errors.newpassword && (
                      <span style={inputErrorStyles}>{errors.newpassword}</span>
                    )} */}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        display: "block",
                        textAlign: "left",
                        marginBottom: "0.5rem",
                      }}
                      color={errors.setpassword ? "error" : "text.primary"}
                    >
                      {LoginSectionData.ConfirmPassword}
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Re-enter password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={credentials.setpassword}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          setpassword: e.target.value,
                        })
                      }
                      sx={{
                        ...inputStyles,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: errors.passwordMismatch ? "#F05252 !important" : undefined,
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            sx={{ color: "#9CA3AF", fontSize: "1.3rem" }}
                            onClick={() =>
                              handleTogglePasswordVisibility("setpassword")
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff sx={{ fontSize: "inherit" }} />
                            ) : (
                              <Visibility sx={{ fontSize: "inherit" }} />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                    {errors.passwordLimit && (
                        <Typography sx={{ color: "#F05252", fontSize: "12px", marginTop: "5px" }}>
                          {errors.passwordLimit}
                        </Typography>
                      )}
                    {/* {errors.setpassword && (
                      <span style={inputErrorStyles}>{errors.setpassword}</span>
                    )} */}
                  </Box>
                </Box>
                    {errors.passwordMismatch && (
                      <Typography
                      sx={{ color: "#F05252", fontSize: "12px", marginTop: "5px" }}
                      >
                        {errors.passwordMismatch}
                      </Typography>
                    )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 4,
                    py: 1.5,  
                    padding: "8px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                    backgroundColor: isButtonDisabled ? "#D1D5D8" : "#CCA1FD",
                    color: isButtonDisabled ? "#F1F5F9" : "#ffffff",
                    cursor: isButtonDisabled ? "not-allowed" : "pointer",
                    "&:hover": {
                      backgroundColor: isButtonDisabled ? "#D1D5D8" : "#A070D3", // Change hover color
                    },
                  }}
                >
                  {LoginSectionData.UpdatePassword}
                </Button>
              </form>
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            <Typography>
              <span  style={{ fontSize: "12px", color: "#FFFFFF" }}>
                Powered by
              </span>
              <span style={{ color: "#D4AEFE" }}>
                {LoginSectionData.copyright}
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;