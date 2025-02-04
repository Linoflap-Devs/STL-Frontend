import React, { useState, useEffect } from "react";
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
import { inputStyles, inputErrorStyles } from "../../styles/theme";

export interface UpdateExecutiveProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (updatedExecutive: User) => void;
  userData: User | null;
  executives: User | null;
}

const UpdateExecutives: React.FC<UpdateExecutiveProps> = React.memo(
  ({ open, onClose, onSubmit, executives }) => {
    const [executive, setExecutive] = useState<User | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const SPACE: string = "";
    const [selectState, setSelectState] = useState({
      region: executive?.region ?? SPACE,
      province: executive?.province ?? SPACE,
      city: executive?.city ?? SPACE,
      barangay: executive?.barangay ?? SPACE,

      assignedRegion: executive?.region ?? SPACE,
      assignedProvince: executive?.region ?? SPACE,
      assignedCity: executive?.region ?? SPACE,
      assignedBarangay: executive?.region ?? SPACE,
    });

    // Custom order for fields
    const customFieldOrder = [
      "firstname",
      "lastname",
      "region",
      "province",
      "city",
      "barangay",
      "streetaddress",
      "phonenumber",
      "username",
      "password",
    ];

    useEffect(() => {
        if (executives) {
        setExecutive(executives)
          setSelectState({
            region: executives.region ?? SPACE,
            province: executives.province ?? SPACE,
            city: executives.city ?? SPACE,
            barangay: executives.barangay ?? SPACE,

            assignedRegion: executives.assignedRegion ?? SPACE,
            assignedProvince: executives.assignedProvince ?? SPACE,
            assignedCity: executives.assignedCity ?? SPACE,
            assignedBarangay: executives.assignedBarangay ?? SPACE,
          });
        }
    }, [executives]);
    

    const handleExecutiveChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      setExecutive((prevExecutive) => {
        if (prevExecutive === null) {
          return {
            id: undefined,
            firstname: SPACE,
            lastname: SPACE,
            region: SPACE,
            province: SPACE,
            city: SPACE,
            barangay: SPACE,
            streetaddress: SPACE,
            phonenumber: SPACE,
            username: SPACE,
            password: SPACE,
            regisdate: SPACE,
            assignedRegion: SPACE,
            assignedProvince: SPACE,
            assignedAddress: SPACE,
            assignedCity: SPACE,
            assignedBarangay: SPACE,
            [name]: value,
          };
        }

        return {
          ...prevExecutive,
          [name]: value,
        };
      });
    };

    const handleSelectExecutiveChange = (e: SelectChangeEvent<string>, name: string) => {
      const value = e.target.value.toString();

      setSelectState((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      setExecutive((prevExecutive) => {
        if (prevExecutive) {
          return {
            ...prevExecutive,
            [name]: value,
          };
        }
        return prevExecutive;
      });
    };

    const handleExecutiveUpdateSubmit = () => {
      //console.log(user);
      if (!executive) {
        setErrors({ general: "User data is missing." });
        return;
      }

      const validationErrors = validateUser(executive);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      Swal.fire({
        title: "Did you input the correct credentials?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No, let me check",
        confirmButtonText: "Yes, I did",
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedExecutiveData = {
            id: executive.id ?? 0,
            firstname: executive.firstname ?? SPACE,
            lastname: executive.lastname ?? SPACE,
            phonenumber: executive.phonenumber ?? SPACE,
            username: executive.username ?? SPACE,
            region: executive.region ?? SPACE,
            province: executive.province ?? SPACE,
            city: executive.city ?? SPACE,
            barangay: executive.barangay ?? SPACE,
            streetaddress: executive.streetaddress ?? SPACE,
            assignedRegion: executive.assignedRegion ?? SPACE,
            assignedProvince: executive.assignedProvince ?? SPACE,
            assignedCity: executive.assignedCity ?? SPACE,
            assignedBarangay: executive.assignedBarangay ?? SPACE,
            assignedAddress: executive.assignedAddress ?? SPACE,
            regisdate: executive.regisdate ?? SPACE,
            password: executive.password ?? SPACE,
          };

          console.log("Update User Data...");
          onSubmit(updatedExecutiveData);

          Swal.fire({
            title: "Updated!",
            text: "The manager's information has been successfully updated.",
            icon: "success",
            confirmButtonText: "OK",
          });

          onClose();
          setExecutive(null);
        }
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
        Update Executive

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
                          value={executive?.[key as keyof typeof executive]?.toString() || SPACE}
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
                      value={executive?.[key as keyof typeof executive]?.toString() || SPACE}
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
                      value={executive?.[key as keyof typeof executive]?.toString() || SPACE}
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
                      value={executive?.[key as keyof typeof executive]?.toString() || SPACE}
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
                    value={executive?.[key as keyof typeof executive]?.toString() || SPACE}
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
          onClick={handleExecutiveUpdateSubmit}
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
}
);

export default UpdateExecutives;