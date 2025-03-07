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
  Tooltip,
} from "@mui/material";
import { formatKey } from "../../utils/format";
import { User } from "./ManagerTable";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { inputStyles, inputErrorStyles, selectStyles } from "../../styles/theme";
import { fetchUserById } from "~/utils/api/users";
import dayjs, { Dayjs } from "dayjs";
import Swal from "sweetalert2";

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
    Street: string;
    phonenumber: string;
    username: string;
    password: string;
  }) => void;
  regions: any[];
  provinces: any[];
  cities: any[];
  manager?: User | null;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(({
  open,
  onClose,
  onSubmit,
  manager,
  regions,
  provinces,
  cities,
}) => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    suffix: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
    CreatedBy: string;
    DateOfRegistration: string;
    IsActive: number;
    IsDeleted: number;
    formattedDate: any;
    Status: any;
  }>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    suffix: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    street: "",
    CreatedBy: "",
    DateOfRegistration: "",
    IsActive: 1,
    IsDeleted: 1,
    formattedDate: "",
    Status: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const SPACE: string = "";
  const [selectState, setSelectState] = useState({
    region: manager?.region ?? SPACE,
    province: manager?.province ?? SPACE,
    city: manager?.city ?? SPACE,
    barangay: manager?.barangay ?? SPACE,
  });
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!open || !manager?.userId) return;
  
    const fetchManagerDetails = async () => {
      const controller = new AbortController();
      const signal = controller.signal;
  
      try {
        console.log("Fetching manager with ID:", manager.userId);
        const response = await fetchUserById(manager.userId);
  
        if (!response.success) {
          console.error("Failed to fetch manager details:", response.message);
          return;
        }
  
        console.log("Fetched Manager Details:", response.data);
  
        const updatedUser = {
          firstName: response.data.FirstName || "",
          lastName: response.data.LastName || "",
          phoneNumber: response.data.PhoneNumber || "",
          email: response.data.Email || "",
          password: response.data.password || "",
          suffix: response.data.Suffix || "",
          region: response.data.Region || "",
          province: response.data.Province || "",
          city: response.data.City || "",
          barangay: response.data.Barangay || "",
          street: response.data.Street || "",
          CreatedBy: response.data.CreatedBy || "",
          DateOfRegistration: response.data.DateOfRegistration || "",
          IsActive: response.data.IsActive ?? 1,  // Ensure boolean defaults are handled correctly
          IsDeleted: response.data.IsDeleted ?? 1,
          formattedDate: response.data.formattedDate || "",
          Status: response.data.Status || "Inactive",
        };
  
        setUser(updatedUser);
        setSelectState(updatedUser);
        setStatus(updatedUser.Status);
  
        // Handle region selection
        if (updatedUser.region) {
          const selectedRegion = regions.find((r) => r.RegionName === updatedUser.region);
          if (selectedRegion) {
            setFilteredProvinces(provinces.filter((p) => p.RegionId === selectedRegion.RegionId));
          }
        }
  
        // Handle province selection
        if (updatedUser.province) {
          const selectedProvince = provinces.find((p) => p.ProvinceName === updatedUser.province);
          if (selectedProvince) {
            const filteredCities = cities.filter((c) => c.province === selectedProvince.ProvinceKey);
            setFilteredCities(filteredCities);
  
            if (filteredCities.some((c) => c.name === updatedUser.city)) {
              setSelectState((prev) => ({ ...prev, city: updatedUser.city }));
              console.log("Updated City Value:", updatedUser.city);
            } else {
              console.warn(`City "${updatedUser.city}" not found in filtered cities!`);
              setSelectState((prev) => ({ ...prev, city: "" }));
            }
          } else {
            console.log("No matching province found!");
            setFilteredCities([]);
          }
        }
      } catch (error) {
        if (signal.aborted) {
          console.log("Fetch aborted:", error);
        } else {
          console.error("Error fetching manager:", error);
        }
      }
  
      return () => controller.abort();
    };
  
    fetchManagerDetails();
  }, [open, manager?.userId, regions, provinces, cities]);
  

  const handleUpdateClick = () => {
    setIsClicked((prev) => !prev);
    setIsDisabled((prev) => !prev);
  };

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
        setFilteredProvinces(newProvinces);
      } else {
        setFilteredProvinces([]);
      }
      setFilteredCities([]);
      setSelectState((prevState) => ({ ...prevState, province: "", city: "" }));
    }

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.ProvinceName === value);
      if (selectedProvince) {
        const newCities = cities.filter((c) => c.ProvinceId === selectedProvince.ProvinceId);
        setFilteredCities(newCities);
      } else {
        setFilteredCities([]);
      }
      setSelectState((prevState) => ({ ...prevState, city: "" }));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
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
                  <Typography variant="body1">{user?.CreatedBy || "N/A"}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{dayjs(user?.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                <Box>
                  <Typography variant="body1">Added By</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body1">Juan Dela Cruz</Typography>
                  <Typography sx={{ fontSize: 12 }}>{user?.formattedDate || "N/A"}</Typography>
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
              <Tooltip title={isClicked ? "Disable form" : "Update form"} arrow>
                <Button
                  component="a"
                  onClick={handleUpdateClick}
                  sx={{
                    backgroundColor: isClicked ? "#FFFFFF" : "#67ABEB",
                    textTransform: "none",
                    fontSize: "14px",
                    px: "2.5rem",
                    py: "0.5rem",
                    borderRadius: "8px",
                    color: "#181A1B",
                    alignSelf: "start",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: isClicked ? "#f0f0f0" : "#559ad6",
                    },
                  }}
                >
                  {isClicked ? "View" : "Update"}
                </Button>
              </Tooltip>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                <Box>
                  <Typography variant="body1">Status</Typography>
                </Box>
                <Box sx={{ marginLeft: "1rem", minWidth: 150 }}>
                    <FormControl fullWidth sx={selectStyles}>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Status"
                            disabled={isDisabled}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
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
                          value={user?.lastName || ""}
                          onChange={handleManagerChange}
                          label="Last Name"
                          disabled
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
                          value={user.suffix || "N/A"}
                          onChange={handleInputChange}
                          label="Suffix"
                          disabled
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
                          value={"********"}
                          onChange={handleInputChange}
                          label="Password"
                          disabled
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
                        {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
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
                      value={user[key as keyof typeof user] || ""}
                      onChange={handleInputChange}
                      label={formatKey(key)}
                      disabled={isDisabled || key === "firstName" || key === "email"}
                    />
                    {errors[key] && <FormHelperText error>{errors[key]}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Assigned Location
            </Typography>
            {["region", "province", "city", "barangay", "street"].map((key) => (
              <Grid item xs={12} key={key} sx={{ marginBottom: "1rem" }}>
                {["region", "province", "city"].includes(key) ? (
                  <FormControl fullWidth error={!!errors[key]}  sx={selectStyles}>
                    <InputLabel id={`${key}-label`}>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                    <Select
                      labelId={`${key}-label`}
                      value={selectState[key as keyof typeof selectState] || ""}
                      name={key}
                      onChange={(e) => handleSelectChange(e, key)}
                      disabled={isDisabled}
                    >
                      <MenuItem value="" disabled>
                        Select {key.charAt(0).toUpperCase() + key.slice(1)}
                      </MenuItem>
                      {(key === "region"
                        ? regions
                        : key === "province"
                          ? filteredProvinces
                          : filteredCities
                      ).map((option) => (
                        <MenuItem
                          key={
                            key === "region"
                              ? option.RegionId
                              : key === "province"
                                ? option.ProvinceKey
                                : option.CityId
                          }
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
                  <FormControl fullWidth error={!!errors[key]} variant="outlined" sx={inputStyles} >
                    <InputLabel htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      disabled={isDisabled}
                      placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                      value={user[key as keyof typeof user] || ""}
                      onChange={(e) =>
                        setUser((prevState) => ({ ...prevState, [key]: e.target.value }))
                      }
                      label={key.charAt(0).toUpperCase() + key.slice(1)}

                    />
                    {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>
          {isClicked && (
            <Grid item xs={12} sx={{ marginBottom: "1rem", paddingTop: "0px !important" }}>
              <FormControl fullWidth variant="outlined" sx={inputStyles}>
                <InputLabel >{"Remarks"}</InputLabel>
                <OutlinedInput
                  //id={key}
                  //name={key}
                  //disabled={isDisabled}
                  placeholder=""
                  //value={user[key as keyof typeof user] || ""}
                  //onChange={(e) => setUser((prevState) => ({ ...prevState, [key]: e.target.value })) }
                  label="remarks"
                />  
                {/* {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>} */}
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
);

export default UpdateManager;
