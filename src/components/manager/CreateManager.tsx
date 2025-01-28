// manager/createmanager.tsx

import React, { useState } from "react";
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";

import {
  Dialog,
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
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import { User } from "./ManagerTable";

export interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => void;
  userData: User | null;
  managers: User[];
}

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
  managers,
}) => {
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

  const handleManagerChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name as string]: value as string }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    setSelectState((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const handleUserCreateSubmit = () => {
    const combinedUserData = { ...user, ...selectState };
    console.log("Submitted data:", combinedUserData);
  
    const validationErrors = validateUser(combinedUserData);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      console.log("Valid user data, submitting...");
      onSubmit(combinedUserData);
      onClose();
    } else {
      console.log("Validation errors:", validationErrors);
    }
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
      <DialogTitle>Add Manager</DialogTitle>
      <DialogContent>
        <Grid
          container
          rowSpacing={2.5}
          columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}
        >
          {Object.keys(user).map((key) => (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ padding: { xs: 0, sm: 0 } }}
              key={key}
            >
              <Typography
                sx={{
                  textAlign: "left",
                  marginBottom: "0.3rem",
                  fontSize: "0.90rem",
                }}
              >
                {formatKey(key)}
              </Typography>

              {key === "password" ? (
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
                      helperText={""}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            sx={{ color: "#9ca3af" }}
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                          >
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
                      sx={{
                        width: "100%",
                        textTransform: "none",
                        backgroundColor: "#2563EB",
                        borderRadius: "8px",
                      }}
                    >
                      Generate
                    </Button>
                  </Grid>
                  {errors[key] && (
                    <Box
                      sx={{
                        color: "error.main",
                        mt: "3px",
                        marginLeft: "12px",
                        fontSize: "0.80rem",
                      }}
                    >
                      {errors[key]}
                    </Box>
                  )}
                </Grid>
              ) : key === "region" ||
                key === "province" ||
                key === "city" ||
                key === "barangay" ? (
                <FormControl fullWidth error={!!errors[key]}>
                  <Select
                    displayEmpty
                    value={selectState[key as keyof typeof selectState] || ''}
                    onChange={(e) => handleSelectChange(e, key)}
                    name={key}
                    inputProps={{
                      "aria-label": formatKey(key),
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select a {formatKey(key)}
                    </MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                  </Select>
                  {errors[key] && (
                    <FormHelperText>{errors[key]}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={`Enter ${formatKey(key)}`}
                  value={user[key as keyof typeof user]}
                  onChange={handleManagerChange}
                  name={key}
                  error={!!errors[key]}
                  helperText={errors[key]}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Button
           onClick={handleUserCreateSubmit}
          sx={{
            mt: 6,
            width: "100%",
            backgroundColor: "#2563EB",
            textTransform: "none",
            fontSize: "12px",
            padding: "0.8rem",
            borderRadius: "8px",
            fontWeight: 700,
          }}
          variant="contained"
        >
          Add Manager
        </Button>
        <button onClick={onClose}>Close</button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;
