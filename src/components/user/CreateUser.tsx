import React, { useState, useEffect } from "react";
import {
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
  TextField,
} from "@mui/material";
import { User } from "./UsersTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatKey } from "~/utils/format";
import { userSchema } from "~/utils/validation";
import Swal from "sweetalert2";
import ConfirmCreateUserPage from "./ConfirmCreateUser";
import { zodToJsonErrors } from "~/utils/zodToJsonErrors";
import { ZodError } from "zod";
import generatePassword from 'generate-password';

interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => Promise<void>;
  userData: User | null;
  //managers: User[];
  operators: any[];
}

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
  operators,
}) => {
  const [user, setUser] = useState({
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    suffix: userData?.suffix ?? "",
    operatorName: userData?.operatorName ?? "",
    operatorId: userData?.operatorId ?? "",
    phoneNumber: userData?.phoneNumber ?? "",
    email: userData?.email ?? "",
    password: "",
  });
  const pageType = window.location.pathname.includes("manager")
    ? "manager"
    : "executive";
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleManagerChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    // If the name is operatorName, find the selected operator and update both operatorName and operatorId
    if (name === "operatorName") {
      const selectedOperator = operators.find(
        (operator) => operator.OperatorId === parseInt(value, 10)
      );

      if (selectedOperator) {
        setUser((prevUser) => ({
          ...prevUser,
          operatorName: selectedOperator.OperatorName,
          operatorId: selectedOperator.OperatorId.toString(),
        }));
      }
    } else {
      // For other field
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }
  };

  const handleCreateManagerSubmit = async () => {
    const newErrors: Record<string, string> = {};
  
    // Manual validation for operatorId
    if (!user.operatorId || user.operatorId.trim() === "") {
      newErrors.operatorId = "Assigned Company is required";
    }
  
    try {
      userSchema.parse(user);
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = zodToJsonErrors(err);
        console.log("Zod Validation Errors:", formattedErrors);
        Object.assign(newErrors, formattedErrors);
      } else {
        console.error("Unexpected error during validation:", err);
      }
    }
  
    // If there are any errors, set them and exit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          py: 0,
        }}
      >
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
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <FormControl fullWidth error={!!errors.lastName}>
                        <InputLabel
                          sx={{ fontSize: "14px" }}
                          htmlFor="lastName"
                        >
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
                        {errors.lastName && (
                          <FormHelperText>{errors.lastName}</FormHelperText>
                        )}
                      </FormControl>
                      <FormControl fullWidth error={!!errors.suffix}>
                        <InputLabel id="suffix-label">Suffix</InputLabel>
                        <Select
                          labelId="suffix-label"
                          id="suffix"
                          name="suffix"
                          onChange={handleManagerChange}
                          label="Suffix"
                        >
                          <MenuItem value="">N/A</MenuItem>
                          <MenuItem value="Jr.">Jr.</MenuItem>
                          <MenuItem value="Sr.">Sr.</MenuItem>
                          <MenuItem value="II">II</MenuItem>
                          <MenuItem value="III">III</MenuItem>
                          <MenuItem value="IV">IV</MenuItem>
                        </Select>
                        {errors.suffix && (
                          <FormHelperText>{errors.suffix}</FormHelperText>
                        )}
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
                      {errors[key] && (
                        <FormHelperText>{errors[key]}</FormHelperText>
                      )}
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
                    <FormControl fullWidth error={!!errors.operatorId}>
                      <InputLabel id="operatorName-label">
                        Assigned Company
                      </InputLabel>
                      <Select
                        labelId="operatorName-label"
                        id="operatorName"
                        name="operatorName"
                        value={user.operatorId || ""}
                        onChange={handleManagerChange}
                        label="Assigned Company"
                      >
                        <MenuItem value="">Select an operator</MenuItem>
                        {operators && operators.length > 0 ? (
                          operators.map(
                            (operator: {
                              OperatorName: string;
                              OperatorId: number;
                            }) => (
                              <MenuItem
                                key={operator.OperatorId}
                                value={operator.OperatorId}
                              >
                                {operator.OperatorName}
                              </MenuItem>
                            )
                          )
                        ) : (
                          <MenuItem value="">No operators available</MenuItem>
                        )}
                      </Select>
                      {errors.operatorId && (
                        <FormHelperText>{errors.operatorId}</FormHelperText>
                      )}
                    </FormControl>
                  ) : key === "password" ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControl
                        fullWidth
                        error={!!errors.password}
                        variant="outlined"
                      >
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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        {errors.password && (
                          <FormHelperText>{errors.password}</FormHelperText>
                        )}
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
                        onClick={() => {
                          const newPassword = generatePassword.generate({
                            length: 12,
                            numbers: true,
                            symbols: true,
                            uppercase: true,
                            lowercase: true,
                            strict: true, // ensures at least one of each selected type
                          });

                          setUser((prev) => ({
                            ...prev,
                            password: newPassword,
                          }));
                        }}
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
                      {errors[key] && (
                        <FormHelperText>{errors[key]}</FormHelperText>
                      )}
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
            color: "#181A1B",
          }}
          variant="contained"
        >
          {pageType === "manager" ? "Add Manager" : "Add Executive"}
        </Button>
        {isVerifyModalOpen && (
          <ConfirmCreateUserPage
            open={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            onVerified={handleCreateManagerSubmit}
            user={user}
            setUser={setUser}
            onSubmit={onSubmit}
            setErrors={setErrors}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;
