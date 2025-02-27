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
      case "Region":
      case "Province":
      case "City":
        return data.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ));
      case "Barangay":
        return <MenuItem value="Sample Barangay">Sample Barangay</MenuItem>;
      default:
        return null;
    }
  };

  return { renderOptions };
};

const mapToLocationItem = (data: Region[] | Province[] | City[]): LocationItem[] => {
  return data.map((item) => ({ // 
    id: item.key,
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
    FirstName: userData?.firstname ?? SPACE,
    LastName: userData?.lastname ?? SPACE,
    PhoneNumber: userData?.phonenumber ?? SPACE,
    Email: userData?.email ?? SPACE,
    password: SPACE,
    StreetAddress: userData?.streetaddress ?? SPACE,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectState, setSelectState] = useState({
    Region: userData?.region ?? SPACE,
    Province: userData?.province ?? SPACE,
    City: userData?.city ?? SPACE,
    Barangay: userData?.barangay ?? SPACE,
  });

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name as string]: value as string }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    const value = e.target.value;
  
    console.log(`Selected ${name}:`, value); // Log selected value
  
    setSelectState((prevState) => ({ ...prevState, [name]: value }));
  
    if (name === "Region") {
      const selectedRegion = regions.find((r) => r.name === value);
      console.log("Selected Region Object:", selectedRegion);
  
      if (selectedRegion) {
        const newProvinces = provinces.filter((p) => p.region === selectedRegion.key);
        console.log("Filtered Provinces:", newProvinces);
        setFilteredProvinces(newProvinces);
      }
  
      setFilteredCities([]);
  
      setSelectState((prevState) => ({
        ...prevState,
        Province: "",
        City: "",
      }));
    }
  
    if (name === "Province") {
      const selectedProvince = provinces.find((p) => p.name === value);
      console.log("Selected Province Object:", selectedProvince);
  
      if (selectedProvince) {
        const newCities = cities.filter((c) => c.province === selectedProvince.key);
        console.log("Filtered Cities:", newCities);
        setFilteredCities(newCities);
      }
  
      setSelectState((prevState) => ({
        ...prevState,
        City: "",
      }));
    }
  };

  const formatKey = (key: string) => {
    const mapping: { [key: string]: string } = {
      FirstName: "First Name",
      LastName: "Last Name",
      PhoneNumber: "Phone Number",
      Email: "Email",
      Password: "Password",
      Region: "Assigned Region",
      Province: "Assigned Province",
      City: "Assigned City",
      Barangay: "Assigned Barangay",
      StreetAddress: "Assigned Street Address",
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
    if (!user.FirstName.trim()) newErrors.FirstName = "First name is required";
    if (!user.LastName.trim()) newErrors.LastName = "Last name is required";
    if (!user.PhoneNumber.trim()) newErrors.PhoneNumber = "Phone number is required";
    if (!user.password.trim()) newErrors.password = "Password is required";
  
    // Location validation (optional, if required)
    if (!selectState.Region.trim()) newErrors.Region = "Region is required";
    if (!selectState.Province.trim()) newErrors.Province = "Province is required";
    if (!selectState.City.trim()) newErrors.City = "City is required";
    if (!selectState.Barangay.trim()) newErrors.Barangay = "Barangay is required";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // Include location data in the payload
    const newUser = {
      ...user, // Spread personal information fields
      userTypeId: 2, // for managers pero 2 muna.
      region: selectState.Region,
      province: selectState.Province,
      city: selectState.City,
      barangay: selectState.Barangay,
    };
  
    console.log("Payload:", newUser);
  
    try {
      const response = await addUser(newUser);
      if (response.success) {
        console.log("User added successfully:", response.data);
        onSubmit(newUser); // Update state/UI
        onClose(); // Close modal or form
      } else {
        console.error("Error adding user:", response.message);
  
        // Handle specific errors from the server
        if (response.errors) {
          // If the server returns specific field errors, update the errors state
          setErrors(response.errors);
        } else {
          // If no specific errors, display a generic error message
          setErrors({ form: response.message });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
  
      // Handle unexpected errors (e.g., network issues, server down)
      if (error instanceof Error) {
        setErrors({ form: error.message }); // Display the error message
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
            {["FirstName", "LastName", "PhoneNumber", "Email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>

                {key === "LastName" ? (
                  // Last Name with Suffix Input. This is optional
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter Last Name"
                        name="LastName"
                        value={user.LastName}
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
                        name="Suffix"
                        error={!!errors.Suffix}
                        helperText={errors.Suffix || SPACE}
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
            {["Region", "Province", "City", "Barangay", "StreetAddress"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                <Typography sx={{ fontSize: "0.90rem", marginBottom: "0.3rem" }}>
                  {formatKey(key)}
                </Typography>
                {["Region", "Province", "City", "Barangay"].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]}>
                    <Select
                      displayEmpty
                      value={selectState[key as keyof typeof selectState] || ""}
                      onChange={(e) => handleSelectChange(e, key)}
                      name={key}
                      inputProps={{ "aria-label": formatKey(key) }}
                      disabled={
                        (key === "Province" && !selectState.Region) ||
                        (key === "City" && !selectState.Province) ||
                        (key === "Barangay" && !selectState.City)
                      }
                    >
                      <MenuItem value="" disabled>
                        Select a {formatKey(key)}
                      </MenuItem>
                      {renderOptions(
                        key,
                        key === "Region"
                          ? mapToLocationItem(regions)
                          : key === "Province"
                            ? mapToLocationItem(filteredProvinces)
                            : key === "City"
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