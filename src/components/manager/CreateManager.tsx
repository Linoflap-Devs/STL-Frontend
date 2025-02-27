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
    id: userData?.id ?? SPACE,
    FirstName: userData?.firstname ?? SPACE,
    LastName: userData?.lastname ?? SPACE,
    PhoneNumber: userData?.phonenumber ?? SPACE,
    UserName: userData?.username ?? SPACE,
    password: SPACE,
    Region: userData?.region ?? SPACE,
    Province: userData?.province ?? SPACE,
    City: userData?.city ?? SPACE,
    Barangay: userData?.barangay ?? SPACE,
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

    setSelectState((prevState) => ({ ...prevState, [name]: value }));

    if (name === "Region") {
      const selectedRegion = regions.find((r) => r.name === value);
      if (selectedRegion) {
        // Filter provinces where province.region === selectedRegion.key
        const newProvinces = provinces.filter((p) => p.region === selectedRegion.key);
        setFilteredProvinces(newProvinces);
      }
      setFilteredCities([]);
      setSelectState((prevState) => ({ ...prevState, Province: "", City: "" }));
    }

    if (name === "Province") {
      const selectedProvince = provinces.find((p) => p.name === value);
      if (selectedProvince) {
        // Filter cities where city.province === selectedProvince.key
        const newCities = cities.filter((c) => c.province === selectedProvince.key);
        setFilteredCities(newCities);
      }
      setSelectState((prevState) => ({ ...prevState, City: "" }));
    }
  };

  const formatKey = (key: string) => {
    const mapping: { [key: string]: string } = {
      FirstName: "First Name",
      LastName: "Last Name",
      PhoneNumber: "Phone Number",
      UserName: "Username",
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
            {["FirstName", "LastName", "PhoneNumber", "UserName", "Password"].map((key) => (
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
                ) : key === "Password" ? (
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
    </Dialog>
  );
};

export default CreateManager;