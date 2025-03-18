import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
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
import { UserSectionData } from "~/data/AdminSectionData";
import { formatKey } from "~/utils/format"
import { validateUser } from "~/utils/validation"
import ConfirmCreateManagerPage from "./ConfirmCreateUser";
import Swal from "sweetalert2";

interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => Promise<void>;
  userData: User | null;
  managers: User[];
  regions: any[];
  provinces: any[];
  cities: any[];
}

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
  regions,
  provinces,
  cities,
}) => {
  const [user, setUser] = useState({
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    suffix: userData?.suffix ?? "",
    phoneNumber: userData?.phoneNumber ?? "",
    email: userData?.email ?? "",
    password: "",
    barangay: userData?.barangay ?? "",
    street: userData?.Street ?? "",
  });
  const pageType = window.location.pathname.includes('manager') ? 'manager' : 'executive';
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectState, setSelectState] = useState({
    region: userData?.region ?? "",
    province: userData?.province ?? "",
    city: userData?.city ?? "",
  });
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    const value = e.target.value;

    setSelectState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "region") {
      const selectedRegion = regions.find((r) => r.RegionName === value);
      if (selectedRegion) {
        const newProvinces = provinces.filter((p) => p.RegionId === selectedRegion.RegionId);
        console.log("Filtered Provinces:", newProvinces);
        setFilteredProvinces(newProvinces);
      } else {
        console.log("No matching region found!");
        setFilteredProvinces([]);
      }

      setFilteredCities([]);
      setSelectState((prevState) => ({
        ...prevState,
        province: "",
        city: "",
      }));
    }

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.ProvinceName === value);
      if (selectedProvince) {
        const newCities = cities.filter((c) => c.province === selectedProvince.ProvinceKey);
        console.log("Filtered Cities:", newCities);
        setFilteredCities(newCities);
      } else {
        console.log("No matching province found!");
        setFilteredCities([]);
      }

      setSelectState((prevState) => ({
        ...prevState,
        city: "",
      }));
    }
  };

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCreateManagerSubmit = async () => {
    const validationErrors = validateUser(user, selectState);
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
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {pageType === 'manager' ? 'Add Manager' : 'Add Executive'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#fffff",
            backgroundColor: '#282828',
          }}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: "700" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          <Grid item xs={6} sm={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {key === "lastName" ? (
                  <Grid container spacing={1.5} alignItems="flex-start" wrap="nowrap">
                    <Grid item xs={8} key="lastName-field">
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

                    <Grid item xs={4} key="suffix-field">
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
                ) : key === "password" ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={7} sx={{ marginBottom: 1 }} key="password-field">
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
                    <Grid item xs={5} key="password-generate-btn">
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          width: "100%",
                          textTransform: "none",
                          backgroundColor: "#67ABEB",
                          borderRadius: "8px",
                          color: "#282828",
                        }}
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </Button>
                    </Grid>

                    {errors.password && (
                      <Grid item xs={12} sx={{ paddingTop: "0px !important" }} key="password-error">
                        <Typography sx={inputErrorStyles}>{errors.password}</Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel id={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user]}
                      onChange={handleManagerChange}
                      label={formatKey(key)}
                    />
                    {errors[key] && <FormHelperText error={true}>{errors[key]}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Assigned Location
            </Typography>
            {['region', 'province', 'city', 'barangay', 'street'].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {['region', 'province', 'city'].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel id={`${key}-label`}>{formatKey(key)}</InputLabel>
                    <Select
                      labelId={`${key}-label`}
                      id={`${key}-select`}  // Use a different id to avoid conflicts
                      value={selectState[key as keyof typeof selectState] || ""}
                      onChange={(e) => handleSelectChange(e, key)}
                      disabled={
                        (key === 'province' && !selectState.region) ||
                        (key === 'city' && !selectState.province)
                      }
                      inputProps={{ 'aria-label': formatKey(key) }}
                      label={formatKey(key)}  // this is to make the label work properly
                    >
                      <MenuItem value="" disabled>Select {formatKey(key)}</MenuItem>
                      {(key === "region"
                        ? regions
                        : key === "province"
                          ? filteredProvinces
                          : filteredCities
                      ).map((option) => (
                        <MenuItem
                          key={`${key}-${option.ProvinceId || option.RegionId || option.name}`}
                          value={
                            key === "region"
                              ? option.RegionName
                              : key === "province"
                                ? option.ProvinceName
                                : option.name
                          }
                        >
                          {key === "region"
                            ? option.RegionName
                            : key === "province"
                              ? option.ProvinceName
                              : option.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>

                ) : (
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user] || ""}
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
            mt: 1,
            width: "100%",
            backgroundColor: "#67ABEB",
            textTransform: "none",
            fontSize: "12px",
            padding: "0.8rem",
            borderRadius: "8px",
            color: '#181A1B',
          }}
          variant="contained"
        >
          {pageType === 'manager' ? 'Add Manager' : 'Add Executive'}
        </Button>
        {isVerifyModalOpen && (
          <ConfirmCreateManagerPage
            open={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            onVerified={handleCreateManagerSubmit}
            user={user}
            selectState={selectState}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateManager;