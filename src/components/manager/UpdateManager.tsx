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
  Box,
  Tooltip,
} from "@mui/material";
import { formatKey } from "../../utils/format";
import { User } from "./ManagerTable";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { inputStyles, selectStyles } from "../../styles/theme";
import { fetchUserById } from "~/utils/api/users";
import dayjs, { Dayjs } from "dayjs";
import Swal from "sweetalert2";
import EditLogModalPage from "./EditLogModal";
import { validateUser } from "~/utils/validation"
import ConfirmUpdateManagerPage from "./ConfirmUpdateManager";

type LogType = {
  id: number;
  title: string;
  description: string;
};

interface UpdateManagerProps {
  open: boolean;
  manager: User | null;
  onClose: () => void;
  onSubmit: (userData: {
    UserId: number | null;
    firstName: string;
    lastName: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
    street: string;
    phoneNumber: string;
    password: string;
    email: string;
    remarks: string;
  }) => void;
  regions: any[];
  provinces: any[];
  cities: any[];
  isDisabled: boolean;
  isClicked: boolean;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(({
  open,
  onClose,
  onSubmit,
  manager,
  regions,
  provinces,
  cities,
  isDisabled,
  isClicked,
}) => {
  const [user, setUser] = useState<{
    UserId: number | null;
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
    remarks: string,
  }>({
    UserId: null,
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
    remarks: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectState, setSelectState] = useState({
    region: manager?.region ?? "",
    province: manager?.province ?? "",
    city: manager?.city ?? "",
    barangay: manager?.barangay ?? "",
  });
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openEditLogModal, setOpenEditLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogType | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

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
          UserId: response.data.UserId ?? null,
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
          IsActive: response.data.IsActive ?? 1,
          IsDeleted: response.data.IsDeleted ?? 1,
          formattedDate: response.data.formattedDate || "",
          Status: response.data.Status || "Inactive",
          remarks: response.data.remarks || "",
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

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    const value = e.target.value;

    setSelectState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setUser((prevUser) => {
      if (!prevUser) return prevUser; // Avoid overwriting user state if it's null

      return {
        ...prevUser,
        [name]: value, // Update the selected field in user
      };
    });

    if (name === "region") {
      const selectedRegion = regions.find((r) => r.RegionName === value);
      if (selectedRegion) {
        const newProvinces = provinces.filter((p) => p.RegionId === selectedRegion.RegionId);
        setFilteredProvinces(newProvinces);
      } else {
        setFilteredProvinces([]);
      }

      // Reset province & city when region changes
      setSelectState((prev) => ({ ...prev, province: "", city: "" }));
      setUser((prev) => ({ ...prev, province: "", city: "" }));
      setFilteredCities([]);
    }

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.ProvinceName === value);
      if (selectedProvince) {
        const newCities = cities.filter((c) => c.province === selectedProvince.ProvinceKey);
        setFilteredCities(newCities);
      } else {
        setFilteredCities([]);
      }

      // Reset city when province changes
      setSelectState((prev) => ({ ...prev, city: "" }));
      setUser((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleManagerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      if (!prevUser) {
        return {
          UserId: null, // Ensure all required fields exist
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
          remarks: "", // Include remarks
          [name]: value, // Ensure dynamic field update
        };
      }

      return {
        ...prevUser,
        [name]: value, // Ensure correct key update
      };
    });
  };

  // for edit log modal behaviors
  const handleOpenEditLogModal = (userId: number | null) => {
    setSelectedUserId(userId);
    setOpenEditLogModal(true);
  };

  const handleCloseEditLogModal = () => {
    setOpenEditLogModal(false);
    setSelectedLog(null);
  };

  const handleUpdateManagerSubmit = async () => {
    const validationErrors = validateUser(user, selectState);

    // Separate validation for remarks
    if (!user.remarks || user.remarks.trim() === "") {
      validationErrors.remarks = "Remarks is required";
    }

    console.log("Validation Errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const confirmation = await Swal.fire({
      title: "Update Confirmation",
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

    // Open verification modal before proceeding
    setIsVerifyModalOpen(true);
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
      <DialogTitle>
      <Box sx={{paddingBottom: '1rem', }}>
        <Box sx={{paddingBottom: '2.5rem', }}>
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
        </Box>
          <Grid container spacing={3} alignItems="stretch">
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between",}}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body1">Last Updated by</Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#67ABEB", cursor: "pointer" }}
                    onClick={() => handleOpenEditLogModal(user.UserId)}
                  >
                    View Summary
                  </Typography>

                  {openEditLogModal && selectedUserId !== null && (
                    <EditLogModalPage
                      open={openEditLogModal}
                      onClose={handleCloseEditLogModal}
                      userId={selectedUserId}
                    />
                  )}
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body1">{user?.CreatedBy || "N/A"}</Typography>
                  <Typography sx={{ fontSize: 12 }}>{dayjs(user?.DateOfRegistration).format("YYYY/MM/DD HH:mm:ss")}</Typography>
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
          </Grid>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          <Grid item xs={6} sm={6}>
            <Typography variant="h6" sx={{ marginBottom: "0.9rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email", "status"].map((key) => (
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
                          onChange={handleManagerChange}
                          label="Suffix"
                          disabled
                        />
                        {errors.suffix && <FormHelperText>{errors.suffix}</FormHelperText>}
                      </FormControl>
                    </Grid>

                  </Grid>
                ) : key === "status" ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sx={{ marginBottom: 1, }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                ) : (
                  <FormControl fullWidth error={!!errors[key]} sx={inputStyles} variant="outlined">
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user] || ""}
                      onChange={handleManagerChange}
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
                  <FormControl fullWidth error={!!errors[key]} sx={selectStyles}>
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
                      onChange={handleManagerChange}
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
              <FormControl fullWidth variant="outlined" sx={inputStyles} error={Boolean(errors.remarks)}>
                <InputLabel htmlFor="remarks">Remarks</InputLabel>
                <OutlinedInput
                  id="remarks"
                  name="remarks"
                  placeholder="Enter Remarks"
                  value={user.remarks}
                  onChange={handleManagerChange}
                  label="Remarks"
                />
                {errors.remarks && <FormHelperText>{errors.remarks}</FormHelperText>}
              </FormControl>
            </Grid>
          )}
        </Grid>
        {isClicked && (
          <Button
            onClick={handleUpdateManagerSubmit}
            sx={{
              mt: 1,
              width: "100%",
              backgroundColor: "#67ABEB",
              textTransform: "none",
              fontSize: "12px",
              padding: "0.8rem",
              borderRadius: "8px",
              color: "#181A1B",
            }}
            variant="contained"
          >
            Update Manager
          </Button>
        )}

        {isVerifyModalOpen && (
          <ConfirmUpdateManagerPage
            open={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
            onVerified={handleUpdateManagerSubmit}
            user={user}
            selectState={selectState}
            onSubmit={onSubmit}
            setUser={setUser}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
);

export default UpdateManager;
