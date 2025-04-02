import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { User } from "./UsersTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { inputErrorStyles } from "../../styles/theme";
import { formatKey } from "~/utils/format"
import { validateUser } from "~/utils/validation"
import Swal from "sweetalert2";
import ConfirmCreateUserPage from "./ConfirmCreateUser";

interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => Promise<void>;
  userData: User | null;
  managers: User[];
}

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
}) => {
  const [user, setUser] = useState({
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    suffix: userData?.suffix ?? "",
    operatorName: userData?.operatorName ?? "",
    phoneNumber: userData?.phoneNumber ?? "",
    email: userData?.email ?? "",
    password: "",
  });
  const pageType = window.location.pathname.includes('manager') ? 'manager' : 'executive';
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCreateManagerSubmit = async () => {
    const validationErrors = validateUser(user);
    console.log("Validation Errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirmation = await Swal.fire({
      title: "Add Confirmation",
      text: "Did you enter the correct details?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: '<span style="color: #212121;">Yes, I did.</span>',
      cancelButtonText: '<span style="color: #212121;">No, let me check</span>',
      confirmButtonColor: "#67ABEB",
      cancelButtonColor: "#f0f0f0",
      customClass: {
        cancelButton: "no-hover",
      },
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    // Open the password verification modal
    setIsVerifyModalOpen(true);
  };

  const handleGeneratePassword = () => {
    const generatedPassword = "0912Gg33*12";
    setUser((prevUser) => ({ ...prevUser, password: generatedPassword }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: {
            xs: "90%",
            sm: "80%",
            md: "600px",
            lg: "650px",
            xl: "800px",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", py: 0 }}>
        <IconButton
          sx={{
            backgroundColor: "#171717",
            alignSelf: "flex-end",
          }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: 700 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: -1 }}>
          {pageType === "manager" ? "Add Manager" : "Add Executive"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }} sx={{ mt: 0.1, }}>
          <Grid item xs={6} sm={6}>
            {["firstName", "lastName", "phoneNumber"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {key === "lastName" ? (
                  <Grid container spacing={1.5} alignItems="flex-start" wrap="nowrap">
                    <Grid item xs={8}>
                      <FormControl fullWidth error={!!errors.lastName}>
                        <InputLabel sx={{ fontSize: "14px" }} htmlFor="lastName">
                          Last Name
                        </InputLabel>
                        <OutlinedInput
                          id="lastName"
                          name="lastName"
                          placeholder="Enter Last Name"
                          value={user.lastName}
                          onChange={handleManagerChange}
                          label="Last Name"
                        />
                        {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth error={!!errors.suffix}>
                        <InputLabel htmlFor="suffix">Suffix</InputLabel>
                        <OutlinedInput
                          id="suffix"
                          name="suffix"
                          placeholder="Enter Suffix"
                          onChange={handleManagerChange}
                          label="Suffix"
                        />
                        {errors.suffix && <FormHelperText>{errors.suffix}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : (
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user]}
                      onChange={handleManagerChange}
                      label={formatKey(key)}
                    />
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>
          <Grid item xs={6} sm={6}>
            {["operatorName", "email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {key === "password" ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={7}>
                      <FormControl fullWidth error={!!errors.password} variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={user.password}
                          onChange={handleManagerChange}
                          label="Password"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                sx={{ color: "#9ca3af" }}
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ width: "100%", textTransform: "none", backgroundColor: "#67ABEB", borderRadius: "8px", color: "#282828" }}
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </Button>
                    </Grid>
                    {errors.password && (
                      <Grid item xs={12}>
                        <Typography sx={inputErrorStyles}>{errors.password}</Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user]}
                      onChange={handleManagerChange}
                      label={formatKey(key)}
                    />
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Button
          onClick={handleCreateManagerSubmit}
          sx={{
            mt: 2,
            width: "100%",
            backgroundColor: "#67ABEB",
            textTransform: "none",
            fontSize: "12px",
            padding: "0.5rem",
            borderRadius: "8px",
            color: '#181A1B',
          }}
          variant="contained"
        >
          {pageType === 'manager' ? 'Add Manager' : 'Add Executive'}
        </Button>
        {isVerifyModalOpen && (
          <ConfirmCreateUserPage
            open={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            onVerified={handleCreateManagerSubmit}
            user={user}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;