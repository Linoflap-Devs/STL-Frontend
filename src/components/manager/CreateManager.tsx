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
import { inputStyles } from "../../styles/theme";
import { City, Province, Region } from "~/utils/api/locationTypes";
import { UserSectionData } from "~/data/AdminSectionData";
import { addUser } from "~/utils/api/users"

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
  const SPACE: string = "";
  const [user, setUser] = useState({
    firstName: userData?.firstName ?? SPACE,
    lastName: userData?.lastName ?? SPACE,
    suffix: userData?.suffix ?? SPACE,
    phoneNumber: userData?.phoneNumber ?? SPACE,
    email: userData?.email ?? SPACE,
    password: SPACE,
    streetaddress: userData?.streetaddress ?? SPACE,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectState, setSelectState] = useState({
    region: userData?.region ?? SPACE,
    province: userData?.province ?? SPACE,
    city: userData?.city ?? SPACE,
    barangay: userData?.barangay ?? SPACE,
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
        province: "", // Reset province
        city: "", // Reset city
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

  const formatKey = (key: string) => {
    const mapping: { [key: string]: string } = {
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      email: "Email",
      password: "Password",
      region: "Assigned Region",
      province: "Assigned Province",
      city: "Assigned City",
      barangay: "Assigned Barangay",
      streetAddress: "Assigned Street Address",
    };
    return mapping[key] || key;
  };

  const handleGeneratePassword = () => {
    const generatedPassword = "0912Gg33*12"; // hardcoded
    setUser((prevUser) => ({ ...prevUser, password: generatedPassword }));
  };

  const handleCreateManagerSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
  
    // Basic validation
    if (!user.firstName.trim()) newErrors.firstName = "First name is required";
    if (!user.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!user.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!user.password.trim()) newErrors.password = "Password is required";
  
    // Location validation (optional, if required)
    if (!selectState.region.trim()) newErrors.Region = "Region is required";
    if (!selectState.province.trim()) newErrors.Province = "Province is required";
    if (!selectState.city.trim()) newErrors.City = "City is required";
    if (!selectState.barangay.trim()) newErrors.Barangay = "Barangay is required";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
      userTypeId: 3,
      region: selectState.region,
      province: selectState.province,
      city: selectState.city,
      barangay: selectState.barangay,
    };  
    console.log("Payload:", newUser);
  
    try {
      const response = await addUser(newUser);
      if (response.success) {
        console.log("User added successfully:", response.data);
        onSubmit(newUser);
        onClose();
      } else {
        console.error("Error adding user:", response.message);
  
        if (response.errors) {
          setErrors(response.errors);
        } else {
          setErrors({ form: response.message });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
  
      if (error instanceof Error) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
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
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Add Manager
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#282828",
          }}
        >
          <CloseIcon sx={{ fontSize: 18, fontWeight: "700" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          {/* Column 1 - Personal Information */}
          <Grid item xs={6} sm={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>

                {key === "lastName" ? (
                  // Last Name with Suffix Input. This is optional
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Last Name"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleManagerChange}
                        error={!!errors.LastName}
                        helperText={errors.LastName || SPACE}
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
                        helperText={errors.suffix || SPACE}
                        sx={inputStyles}
                      />
                    </Grid>
                  </Grid>
                ) : key === "password" ? (
                  // Password Input with Visibility Toggle
                  <Grid container spacing={1.5} alignItems="center">
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={`Enter ${key}`}
                        type={showPassword ? "text" : "password"}
                        name={key}
                        value={user.password}
                        onChange={handleManagerChange}
                        error={!!errors[key]}
                        helperText={""}
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
                          backgroundColor: "#CCA1FD",
                          borderRadius: "8px",
                          color: "#282828",
                        }}
                        onClick={handleGeneratePassword}
                      >
                        Generate
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  // Default TextField for Other Inputs
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={`Enter ${formatKey(key)}`}
                    name={key}
                    value={user[key as keyof typeof user]}
                    onChange={handleManagerChange}
                    error={!!errors[key]}
                    helperText={errors[key] || SPACE}
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
          mt: 1,
          width: "100%",
          backgroundColor: "#CCA1FD",
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