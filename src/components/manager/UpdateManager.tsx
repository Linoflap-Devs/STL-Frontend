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
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Box,
} from "@mui/material";
import { validateUser } from "../../utils/validation";
import { formatKey } from "../../utils/format";
import { UserSectionData } from "~/data/AdminSectionData";
import { User } from "./ManagerTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { inputStyles, inputErrorStyles } from "../../styles/theme";
import { City, Province, Region } from "~/utils/api/locationTypes";

interface UpdateManagerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    id: number;
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
  manager: User | null;
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

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(({ open, onClose, onSubmit, manager, regions, provinces, cities, }) => {
  const [user, setUser] = useState<User | null>(manager);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const SPACE: string = "";
  const [selectState, setSelectState] = useState({
    region: manager?.region ?? SPACE,
    province: manager?.province ?? SPACE,
    city: manager?.city ?? SPACE,
    barangay: manager?.barangay ?? SPACE,
  });
  const { renderOptions } = useRenderOptions();
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

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
    if (manager) {
      setUser(manager);
      setSelectState({
        region: manager.region || SPACE,
        province: manager.province || SPACE,
        city: manager.city || SPACE,
        barangay: manager.barangay || SPACE,
      });
    }
  }, [manager]);

  const mapToLocationItem = (data: Region[] | Province[] | City[]): LocationItem[] => {
    return data.map((item) => ({
      id: (item as any).key || (item as any).code || "",
      name: item.name,
    }));
  };

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      if (prevUser === null) {
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
          [name]: value,
        };
      }

      return {
        ...prevUser,
        [name]: value,
      };
    });
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
      <DialogTitle sx={{ paddingY: '2rem', }} >
        <Box>
          <Grid container spacing={3} alignItems="stretch">
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1">Last Updated by</Typography>
                  <Typography sx={{ fontSize: 12, color: "#67ABEB", cursor: "pointer" }}>
                    View Summary
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body1">Renato Villareal</Typography>
                  <Typography sx={{ fontSize: 12 }}>2025/01/22 13:05:32</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                <Box>
                  <Typography variant="body1">Added By</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body1">Juan Dela Cruz</Typography>
                  <Typography sx={{ fontSize: 12 }}>2025/01/23 09:30:45</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#67ABEB",
                  textTransform: "none",
                  fontSize: "14px",
                  px: "2.5rem",
                  py: "0.5rem",
                  borderRadius: "8px",
                  color: "#181A1B",
                  alignSelf: "start",
                }}
                variant="contained"
              >
                Update
              </Button>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                <Box>
                  <Typography variant="body1">Status</Typography>
                </Box>
                <Box sx={{ marginLeft: "1rem", minWidth: 150 }}>
                  <FormControl fullWidth>
                    <InputLabel id="status">Status</InputLabel>
                    <Select labelId="status" id="status" value={status} label="Status">
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 30,
            top: 30,
            color: '#D1D5D8'[300],
            backgroundColor: '#282828',
          }}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: 'bold' }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          {/* Column 1 - Personal Information */}
          <Grid item xs={6} sm={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email", "password"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {key === "lastName" ? (
                  <Grid container spacing={1.5} alignItems="flex-start" wrap="nowrap">
                    <Grid item xs={8}>
                      <FormControl fullWidth error={!!errors.lastName} sx={inputStyles}>
                        <InputLabel sx={{ fontSize: '14px' }} htmlFor="lastName">Last Name</InputLabel>
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

                    <Grid item xs={4}>
                      <FormControl fullWidth error={!!errors.suffix} sx={inputStyles}>
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
                    <Grid item xs={7} sx={{ marginBottom: 1, }}>
                      <FormControl fullWidth error={!!errors.password} sx={inputStyles} variant="outlined">
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

                      >
                        Generate
                      </Button>
                    </Grid>

                    {errors.password && (
                      <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                        <Typography sx={inputErrorStyles}>
                          {errors.password}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <FormControl fullWidth error={!!errors[key]} sx={inputStyles} variant="outlined">
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
                      <FormHelperText error={true}>{errors[key]}</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>

          {/* Column 2 - Assigned Location */}
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Assigned Location
            </Typography>
            {["region", "province", "city", "barangay", "streetaddress"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {["region", "province", "city", "barangay"].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]} sx={inputStyles}>
                    <InputLabel id={`${key}-label`}>{formatKey(key)}</InputLabel>
                    <Select
                      labelId={`${key}-label`}
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
                  <FormControl fullWidth error={!!errors[key]} sx={inputStyles} variant="outlined">
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user]}
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
      </DialogContent>
    </Dialog>
  );
}
);

export default UpdateManager;
