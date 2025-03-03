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
} from "@mui/material";
import { User } from "./ManagerTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { inputStyles, inputErrorStyles } from "../../styles/theme";
import { City, Province, Region } from "~/utils/api/locationTypes";
import { UserSectionData } from "~/data/AdminSectionData";
import { addUser } from "~/utils/api/users"
import Swal from "sweetalert2";
import { formatKey } from "~/utils/format"
import { validateUser } from "~/utils/validation"

export interface CreateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: User | null) => void;
  userData: User | null;
  managers: User[];
  regions: Region[];
  provinces: Province[];
  cities: City[];
}

interface LocationItem {
  id: string;
  name: string;
}

// populating locations on api philippines
export const useRenderOptions = () => {
  const renderOptions = (key: string, data: LocationItem[]) => {
    switch (key) {
      case "region":
      case "province":
      case "city":
        return data.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ));
      case "barangay":
        return <MenuItem value="Sample">Barangay2</MenuItem>;
      default:
        return null;
    }
  };

  return { renderOptions };
};

const mapToLocationItem = (data: Region[] | Province[] | City[]): LocationItem[] => {
  return data.map((item) => ({
    id: (item as any).key || (item as any).code || "",
    name: item.name,
  }));
};

const CreateManager: React.FC<CreateManagerProps> = ({
  open,
  onClose,
  onSubmit,
  userData,
  managers,
  regions,
  provinces,
  cities,
}) => {
  const { renderOptions } = useRenderOptions();
  const [user, setUser] = useState({
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    suffix: userData?.suffix ?? "",
    phoneNumber: userData?.phoneNumber ?? "",
    email: userData?.email ?? "",
    userName: userData?.userName ?? "",
    password: "",
    streetaddress: userData?.streetaddress ?? "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectState, setSelectState] = useState({
    region: userData?.region ?? "",
    province: userData?.province ?? "",
    city: userData?.city ?? "",
    barangay: userData?.barangay ?? "",
  });

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    const value = e.target.value;

    console.log(`Selected ${name}:`, value); // Log selected value

    setSelectState((prevState) => ({ ...prevState, [name.toLowerCase()]: value }));

    if (name === "region") {
      const selectedRegion = regions.find((r) => r.name === value);
      console.log("Selected Region Object:", selectedRegion);

      if (selectedRegion?.key) {
        const newProvinces = provinces.filter((p) => p.region === selectedRegion.key);
        console.log("Filtered Provinces:", newProvinces);
        setFilteredProvinces(newProvinces);
      }

      setFilteredCities([]);

      setSelectState((prevState) => ({
        ...prevState,
        province: "",
        city: "",
      }));
    }

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.name === value);
      console.log("Selected Province Object:", selectedProvince);

      if (selectedProvince) {
        const newCities = cities.filter((c) => c.province === selectedProvince.key);
        console.log("Filtered Cities:", newCities);
        setFilteredCities(newCities);
      }

      setSelectState((prevState) => ({
        ...prevState,
        city: "",
      }));
    }
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

    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      region: selectState.region,
      province: selectState.province,
      city: selectState.city,
      barangay: selectState.barangay,
      streetaddress: user.streetaddress,
      email: user.email,
      password: user.password,
      userName: "",
      suffix: user.suffix,
      phoneNumber: user.phoneNumber,
      userTypeId: 3,
    };

    try {
      const response = await addUser(newUser);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Manager Created!",
          text: `The manager has been added successfully.`,
          confirmButtonColor: "#67ABEB",
        });

        onSubmit(newUser);
        onClose();
      } else {
        setErrors(response.errors || { form: response.message });
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.message || "Something went wrong. Please try again.",
          confirmButtonColor: "#D32F2F",
        });
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "An unexpected error occurred. Please try again." });
      Swal.fire({
        icon: "error",
        title: "Unexpected Error!",
        text: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        confirmButtonColor: "#D32F2F",
      });
    }
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
        Add Manager
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
          {/* Column 1 - Personal Information */}
          <Grid item xs={6} sm={6} sx={{ marginBottom: "0px !important" }}>
            <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>
                {key === "lastName" ? (
                  <Grid container spacing={1} alignItems="flex-start" wrap="nowrap">
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Last Name"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleManagerChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName || ""}
                        sx={inputStyles}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Suffix"
                        name="suffix"
                        error={!!errors.suffix}
                        helperText={errors.suffix || ""}
                        sx={inputStyles}
                      />
                    </Grid>
                  </Grid>
                ) : key === "password" ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={user.password}
                        onChange={handleManagerChange}
                        error={!!errors.password}
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
                      <Grid item xs={12}>
                        <Typography sx={inputErrorStyles}>
                          {errors.password}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Enter ${formatKey(key)}`}
                    name={key}
                    value={user[key as keyof typeof user]}
                    onChange={handleManagerChange}
                    error={!!errors[key]}
                    helperText={errors[key] || ""}
                    sx={inputStyles}
                  />
                )}
              </Grid>
            ))}
          </Grid>

          {/* Column 2 - Assigned Location */}
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
              Assigned Location
            </Typography>
            {["region", "province", "city", "barangay", "streetaddress"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>
                {["region", "province", "city", "barangay"].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]}>
                    <Select
                      displayEmpty
                      value={selectState[key as keyof typeof selectState] || ""}
                      onChange={(e) => handleSelectChange(e, key)}
                      name={key}
                      inputProps={{ "aria-label": formatKey(key) }}
                      disabled={
                        (key === "province" && !selectState.region) ||
                        (key === "city" && !selectState.province) ||
                        (key === "barangay" && !selectState.city)
                      }
                    >
                      <MenuItem value="" disabled>
                        Select a {formatKey(key)}
                      </MenuItem>
                      {renderOptions(
                        key,
                        key === "region"
                          ? mapToLocationItem(regions)
                          : key === "province"
                            ? mapToLocationItem(filteredProvinces)
                            : key === "city"
                              ? mapToLocationItem(filteredCities)
                              : []
                      )}
                    </Select>
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Enter ${formatKey(key)}`}
                    name={key}
                    value={user[key as keyof typeof user]}
                    onChange={handleManagerChange}
                    error={!!errors[key]}
                    helperText={errors[key] || ""}
                    sx={inputStyles}
                  />
                )}
              </Grid>
            ))}
          </Grid>

        </Grid>
      </DialogContent>

      <Button
        onClick={handleCreateManagerSubmit}
        sx={{
          mt: 0.5,
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
        {UserSectionData.addManagerButton}
      </Button>
    </Dialog>
  );
};

export default CreateManager;