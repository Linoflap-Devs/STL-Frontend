import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Select,
  MenuItem,
  Stack,
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
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          <Stack direction="row" spacing={2.5}>
            {/* Left Column */}
            <Stack flex={1} spacing={2}>
              {["firstName", "lastName", "phoneNumber"].map((key) => (
                <Stack key={key} spacing={1}>
                  {key === "lastName" ? (
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
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
                    </Stack>
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
                </Stack>
              ))}
            </Stack>

            {/* Right Column */}
            <Stack flex={1} spacing={2}>
              {["operatorName", "email", "password"].map((key) => (
                <Stack key={key} spacing={1}>
                  {key === "operatorName" ? (
                    <FormControl fullWidth error={!!errors.operatorName}>
                      <InputLabel id="operatorName-label">Operator Name</InputLabel>
                      <Select
                        labelId="operatorName-label"
                        id="operatorName"
                        name="operatorName"
                        value={user.operatorName || ""}
                        onChange={handleManagerChange}
                        label="Operator Name"
                      >
                        <MenuItem value="">Select an operator</MenuItem>
                        <MenuItem value="Operator A">Operator A</MenuItem>
                        <MenuItem value="Operator B">Operator B</MenuItem>
                        <MenuItem value="Operator C">Operator C</MenuItem>
                      </Select>
                      {errors.operatorName && <FormHelperText>{errors.operatorName}</FormHelperText>}
                    </FormControl>
                  ) : key === "password" ? (
                    <Stack direction="row" spacing={1} alignItems="center">
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
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#67ABEB",
                          borderRadius: "8px",
                          color: "#282828",
                          minWidth: "120px",
                        }}
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </Button>
                    </Stack>
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
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Button
          onClick={handleCreateManagerSubmit}
          sx={{
            mt: 3,
            width: "100%",
            backgroundColor: "#67ABEB",
            textTransform: "none",
            fontSize: "12px",
            padding: "0.6rem",
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