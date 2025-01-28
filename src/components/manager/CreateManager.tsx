import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  FormHelperText,
  Box,
  useMediaQuery,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";

interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    firstname: string;
    lastname: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    streetaddress: string;
    phonenumber: string;
    username: string;
    password: string;
  }) => void;
}

const CreateManager: React.FC<CreateManagerProps> = ({ open, onClose, onSubmit }) => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    streetaddress: "",
    phonenumber: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectState, setSelectState] = useState({
    region: "",
    province: "",
    city: "",
    barangay: "",
  });

  // for form inputs
  const handleManagerChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name as string]: value as string }));
  };

  // for select dropdown
  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    setSelectState((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    Object.entries(user).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = `${formatKey(key)} is required`;
      }
      if (user.firstname && user.lastname) {
        const nameRegex = /^[A-Za-z]+$/;

        if (!nameRegex.test(user.firstname)) {
          newErrors.firstname = 'First Name can only contain letters.';
        }

        if (!nameRegex.test(user.lastname)) {
          newErrors.lastname = 'Last Name can only contain letters.';
        }
      }
      if (user.phonenumber) {
        const phoneRegex = /^09\d{2} \d{3} \d{4}$/;

        if (!phoneRegex.test(user.phonenumber)) {
          newErrors.phonenumber = 'Please enter a valid phone number. e.g. 09xx xxx xxxx';
        }
      }
      if (user.username) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailRegex.test(user.username)) {
          newErrors.username = 'Please enter a valid email address.';
        }
      }
      if (user.password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(user.password)) {
          newErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserCreateSubmit = () => {
    if (validate()) {
      onSubmit(user);
    }
  };

  // formatting key
  const formatKey = (key: string) => {
    return key
      .replace(/(name|address|number)/gi, " $1")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
            xl: "800px"
          }
        }
      }}
    >
      <DialogTitle>Add Manager</DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={2.3} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          {Object.keys(user).map((key) => (
            <Grid item xs={12} sm={6} sx={{ padding: { xs: 0, sm: 0 } }} key={key}>

              <Typography sx={{ textAlign: "left", marginBottom: "0.3rem", fontSize: "0.90rem" }}>
                {formatKey(key)}
              </Typography>

              {key === "password" ? ( // Input password
                <Grid container spacing={1.5} alignItems="center">
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={`Enter ${key}`}
                      type={showPassword ? "text" : "password"}
                      value={user[key as keyof typeof user]}
                      onChange={handleManagerChange}
                      name={key}
                      error={!!errors[key]}
                      helperText={''}
                      InputProps={{
                        endAdornment: (
                          <IconButton sx={{ color: "#9ca3af" }} onClick={() => setShowPassword((prev) => !prev)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ width: "100%", textTransform: "none", backgroundColor: "#2563EB", borderRadius: "8px" }}
                    >
                      Generate
                    </Button>
                  </Grid>
                  {errors[key] && (
                    <Box sx={{ color: 'error.main', mt: "3px", marginLeft: '12px', fontSize: '0.80rem' }}>
                      {errors[key]}
                    </Box>
                  )}
                </Grid>

              ) : key === "region" || key === "province" || key === "city" || key === "barangay" ? (
                <FormControl fullWidth error={!!errors[key]}>
                  <Select
                    displayEmpty
                    value={selectState[key as keyof typeof selectState]}
                    onChange={(e) => handleSelectChange(e, key)}
                    name={key}
                    //sx={selectStyles}
                    inputProps={{
                      "aria-label": formatKey(key),
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select a {formatKey(key)}
                    </MenuItem>
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                  </Select>
                  {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                </FormControl>

              ) : (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Enter ${formatKey(key)}`}
                  value={user[key as keyof typeof user]}
                  onChange={handleManagerChange}
                  name={key}
                  //sx={inputStyles}
                  error={!!errors[key]}
                  helperText={errors[key]}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Button onClick={handleUserCreateSubmit}
          sx={{
            mt: 6,
            width: "100%",
            backgroundColor: "#2563EB",
            textTransform: "none",
            fontSize: "12px",
            padding: '0.8rem',
            borderRadius: '8px',
            fontWeight: 700,
          }}
          variant="contained"
        >
          Add Manager
        </Button>

      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;