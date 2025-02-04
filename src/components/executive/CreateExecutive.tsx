import React, { useState } from "react";
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
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";
import { User } from "./ExecutiveTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UserSectionData } from "../../data/AdminSectionData";

import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { inputStyles } from "../../styles/theme";

export interface CreateExecutiveProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => void;
  userData: User | null;
  executives: User[];
}

const CreateExecutive: React.FC<CreateExecutiveProps> = ({ open, onClose, onSubmit, userData, executives }) => {
  const SPACE: string = "";
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [executive, setExecutive] = useState({
    id: userData?.id ?? SPACE,

    // Personal Information
    firstname: userData?.firstname ?? SPACE,
    lastname: userData?.lastname ?? SPACE,
    phonenumber: userData?.phonenumber ?? SPACE,
    username: userData?.username ?? SPACE,
    password: SPACE,

    // Home Address
    region: userData?.region ?? SPACE,
    province: userData?.province ?? SPACE,
    city: userData?.city ?? SPACE,
    barangay: userData?.barangay ?? SPACE,
    streetaddress: userData?.streetaddress ?? SPACE,

    // Assigned Location
    assignedRegion: userData?.assignedRegion ?? SPACE,
    assignedProvince: userData?.assignedProvince ?? SPACE,
    assignedCity: userData?.assignedCity ?? SPACE,
    assignedBarangay: userData?.assignedBarangay ?? SPACE,
    assignedAddress: userData?.assignedAddress ?? SPACE,

    regisdate: userData?.regisdate ?? SPACE,
  });

  const [selectState, setSelectState] = useState({
    region: userData?.region ?? SPACE,
    province: userData?.province ?? SPACE,
    city: userData?.city ?? SPACE,
    barangay: userData?.barangay ?? SPACE,

    assignedRegion: userData?.assignedRegion ?? SPACE,
    assignedProvince: userData?.assignedProvince ?? SPACE,
    assignedCity: userData?.assignedCity ?? SPACE,
    assignedBarangay: userData?.assignedBarangay ?? SPACE,
  });

  // form handlings
  const handleExecutiveChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setExecutive((prevExecutive) => ({ ...prevExecutive, [name as string]: value as string }));
  };

  const handleSelectExecutiveChange = (
    e: SelectChangeEvent<string | number>,
    key: string
  ) => {
    setSelectState((prevState) => ({
      ...prevState,
      [key]: String(e.target.value),
    }));

    setExecutive((prevExecutive) => ({
      ...prevExecutive,
      [key]: String(e.target.value),
    }));
  };

  // generate password
  const handleGeneratePassword = () => {
    const generatedPassword = "0912Gg33*12";
    setExecutive((prevExecutive) => ({ ...prevExecutive, password: generatedPassword }));
  };

  const handleExecutiveCreateSubmit = () => {
    const generatedId = executives.length + 1;
    const combinedUserData = {
      ...executive,
      ...selectState,
      id: generatedId,
    };
    const validationErrors = validateUser(combinedUserData);
    console.log("Submitted data:", combinedUserData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Valid user data, submitting...");

      Swal.fire({
        title: "Did you input the correct credentials?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No, let me check",
        confirmButtonText: "Yes, I did",
      }).then((result) => {
        if (result.isConfirmed) {
          onSubmit(combinedUserData);
          onClose();

          Swal.fire({
            title: "Success!",
            text: "Manager added successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          setExecutive({
            ...executive,
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            assignedAddress: "",
          });
          setSelectState({
            region: "",
            province: "",
            city: "",
            barangay: "",
            assignedRegion: "",
            assignedProvince: "",
            assignedCity: "",
            assignedBarangay: "",
          });
        }
      });
    } else {
      console.log("Validation errors:", validationErrors);
    }
  };

  const handleDummyData = () => {
    setExecutive({
      id: executives.length + 1,
      // Personal Information
      firstname: "John",
      lastname: "Doe",
      phonenumber: "0912 345 6789",
      username: "johndoe",
      password: "DummyPass123!",
      // Home Address
      region: "Region IV-A",
      province: "Cavite",
      city: "Dasmariñas",
      barangay: "Salawag",
      streetaddress: "123 Main St",
      // Assigned Location
      assignedRegion: "100",
      assignedProvince: "100",
      assignedCity: "100",
      assignedBarangay: "100",
      assignedAddress: "123 Main St",

      regisdate: new Date().toISOString(),
    });

    setSelectState({
      region: "10",
      province: "25",
      city: "50",
      barangay: "100",
      assignedRegion: "100",
      assignedProvince: "100",
      assignedCity: "100",
      assignedBarangay: "100",
    });
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
            lg: "700px",
            xl: "1150px",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'justify', }} >
        Add Executive
        <Button
          onClick={handleDummyData}
          variant="contained"
          sx={{
            marginLeft: 2,
            paddingX: 3,
            paddingY: 0.5,
            textTransform: "none",
            fontSize: 12,
            borderRadius: "8px",
            backgroundColor: "#2563EB",
            width: "auto",
          }}
        > Dummy Data
        </Button>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 30,
            top: 30,
            color: '#D1D5D8'[300],
            backgroundColor: '#374151',
          }}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: 'bold' }} />
        </IconButton>

      </DialogTitle>
      <DialogContent>
        <Grid
          container
          rowSpacing={2.5}
          columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}
        >
          {/* Column 1 - Personal Information */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Personal Information
            </Typography>
            {["firstname", "lastname", "phonenumber", "username", "password"].map(
              (key) => (
                <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                  <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
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
                          value={executive[key as keyof typeof executive]}
                          onChange={handleExecutiveChange}
                          name={key}
                          error={!!errors[key]}
                          helperText={errors[key] || ""}
                          sx={inputStyles}
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
                    </Grid>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={`Enter ${formatKey(key)}`}
                      value={executive[key as keyof typeof executive] || SPACE}
                      onChange={handleExecutiveChange}
                      name={key}
                      error={!!errors[key]}
                      helperText={errors[key] || SPACE}
                      sx={inputStyles}
                    />
                  )}
                </Grid>
              )
            )}
          </Grid>

          {/* Column 2 - Home Address */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Home Address
            </Typography>
            {["region", "province", "city", "barangay", "streetaddress"].map(
              (key) => (
                <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                  <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                    {formatKey(key)}
                  </Typography>
                  {["region", "province", "city", "barangay"].includes(key) ? (
                    <FormControl fullWidth error={!!errors[key]}>
                      <Select
                        displayEmpty
                        value={selectState[key as keyof typeof selectState] || SPACE}
                        onChange={(e) => handleSelectExecutiveChange(e, key)}
                        name={key}
                        inputProps={{ "aria-label": formatKey(key) }}
                      >
                        <MenuItem value="" disabled>
                          Select a {formatKey(key)}
                        </MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="25">25</MenuItem>
                        <MenuItem value="50">50</MenuItem>
                        <MenuItem value="100">100</MenuItem>
                      </Select>
                      {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={`Enter ${formatKey(key)}`}
                      value={executive[key as keyof typeof executive] || SPACE}
                      onChange={handleExecutiveChange}
                      name={key}
                      error={!!errors[key]}
                      helperText={errors[key] || SPACE}
                      sx={inputStyles}
                    />
                  )}
                </Grid>
              )
            )}
          </Grid>

          {/* Column 3 - Assigned Location */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Assigned Location
            </Typography>
            {[
              "assignedRegion",
              "assignedProvince",
              "assignedCity",
              "assignedBarangay",
              "assignedAddress",
            ].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>
                {[
                  "assignedRegion",
                  "assignedProvince",
                  "assignedCity",
                  "assignedBarangay",
                ].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]}>
                    <Select
                      displayEmpty
                      value={executive[key as keyof typeof executive] || SPACE}
                      onChange={(e) => handleSelectExecutiveChange(e, key)}
                      name={key}
                      inputProps={{ "aria-label": formatKey(key) }}
                    >
                      <MenuItem value="" disabled>
                        Select a {formatKey(key)}
                      </MenuItem>
                      <MenuItem value="10">10</MenuItem>
                      <MenuItem value="25">25</MenuItem>
                      <MenuItem value="50">50</MenuItem>
                      <MenuItem value="100">100</MenuItem>
                    </Select>
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Enter ${formatKey(key)}`}
                    value={executive[key as keyof typeof executive] || SPACE}
                    onChange={handleExecutiveChange}
                    name={key}
                    error={!!errors[key]}
                    helperText={errors[key] || SPACE}
                    sx={inputStyles}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Button
          onClick={handleExecutiveCreateSubmit}
          sx={{
            mt: 3,
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
          {UserSectionData.addExecutiveButton}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExecutive;