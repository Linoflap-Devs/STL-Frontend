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
  TextField,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Box,
} from "@mui/material";
import { formatKey } from "../../utils/format";
import { User } from "./UsersTable";
import { SelectChangeEvent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { inputStyles, selectStyles } from "../../styles/theme";
import { fetchUserById } from "~/utils/api/users";
import dayjs, { Dayjs } from "dayjs";
import Swal from "sweetalert2";
import EditLogModalPage from "./EditLogModal";
import { validateUser } from "~/utils/validation"
import ConfirmUpdateManagerPage from "./ConfirmUpdateUser";

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
    operatorName: string,
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
    operatorName: "",
  });
  const pageType = window.location.pathname.includes('manager') ? 'manager' : 'executive';
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (!open || !manager?.userId) return;

    const fetchManagerDetails = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetchUserById(manager.userId);

        if (!response.success) {
          console.error("Failed to fetch manager details:", response.message);
          return;
        }

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
          operatorName: response.data.operatorName || "",
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
  
  const handleDisable = () => {
    if (isViewMode) {
      setIsDisabled(false);
      setIsViewMode(false);
    } else {
      setIsViewMode(true);
      setIsDisabled(true);
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
          operatorName: "",
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
    const validationErrors = validateUser(user);

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
      <DialogTitle sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", pt: 0, }}>
        <IconButton
          sx={{
            backgroundColor: "#171717",
            alignSelf: "flex-end",
          }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: 700 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold", }}>
          {pageType === "manager" ? "View Manager" : "View Executive"}
        </Typography>
      </DialogTitle>
      <DialogContent>

        {/* Status Field */}
        <Grid item xs={12} key={status} sx={{ my: 1.5, }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} sx={{ marginBottom: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
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
                <Box>
                  <Button
                    onClick={handleDisable}
                    sx={{
                      mt: 1,
                      backgroundColor: "#67ABEB",
                      textTransform: "none",
                      fontSize: "14px",
                      px: "1.7rem",
                      borderRadius: "8px",
                      color: "#181A1B",
                    }}
                    variant="contained"
                  >
                    {isViewMode ? "View" : "Update"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Start Rows for other text fields */}
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }}>
          <Grid item xs={6} sm={6}>
            <Typography sx={{ marginBottom: "0.9rem" }}>
              Personal Information
            </Typography>
            {["firstName", "lastName", "phoneNumber", "email",].map((key) => (
              <Grid item xs={12} key={key} sx={{ mb: 3, }}>
                {key === "status" ? (
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sx={{ marginBottom: 1 }}>
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

                ) : key === "lastName" ? (
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
            <Typography sx={{ marginBottom: "0.9rem" }}>
              History
            </Typography>
            {["CreatedBy", "DateOfRegistration", "phoneNumber", "email",].map((key) => (
              <Grid item xs={12} key={key} sx={{ mb: 3, }}>
                <FormControl fullWidth error={!!errors[key]} sx={inputStyles} variant="outlined">
                  <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    placeholder={`Enter ${formatKey(key)}`}
                    value={user[key as keyof typeof user] || ""}
                    onChange={handleManagerChange}
                    label={formatKey(key)}
                    disabled={isDisabled || key === "CreatedBy" || key === "DateOfRegistration" }
                  />
                  {errors[key] && <FormHelperText error>{errors[key]}</FormHelperText>}
                </FormControl>
              </Grid>
            ))}

            {/* View Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography
                sx={{ fontSize: 12, color: "#67ABEB", cursor: "pointer", mt: -1, }}
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
          </Grid>
        </Grid>

        {/* Second Row */}
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 3, md: 2.5 }} sx={{ mt: 0.1, }}>
          <Grid item xs={12}>
            <Typography>
              Authorized Agents Corporations
            </Typography>
          </Grid>

          <Grid item xs={6}>
            {["DateOfRegistration", "DateOfRegistration"].map((key) => (
              <Grid item xs={12} key={key} sx={{ mb: 3, }}>
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
              </Grid>
            ))}
          </Grid>

          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={!!errors.AreaOfOperations}
                  sx={inputStyles}
                  variant="outlined"
                >
                  <InputLabel htmlFor="AreaOfOperations">{formatKey("AreaOfOperations")}</InputLabel>
                  <TextField
                    id="AreaOfOperations"
                    name="AreaOfOperations"
                    placeholder="Enter Area of Operations"
                    onChange={handleManagerChange}
                    label={formatKey("AreaOfOperations")}
                    disabled={isDisabled}
                    multiline
                    minRows={4}
                    variant="outlined"
                    fullWidth
                  />
                  {errors.AreaOfOperations && (
                    <FormHelperText error>{errors.AreaOfOperations}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Remarks Field */}
          {isDisabled && (
            <Grid item xs={12} sx={{ paddingTop: "0rem !important", }}>
              <FormControl fullWidth variant="outlined" sx={inputStyles} error={Boolean(errors.remarks)}>
                <InputLabel>Remarks</InputLabel>
                <TextField
                  id="remarks"
                  name="remarks"
                  value={user.remarks}
                  onChange={handleManagerChange}
                  label="Remarks"
                  multiline
                  minRows={3}
                  variant="outlined"
                />
                {errors.remarks && <FormHelperText>{errors.remarks}</FormHelperText>}
              </FormControl>
            </Grid>
          )}
        </Grid>

        {isDisabled && (
          <Button
            onClick={handleUpdateManagerSubmit}
            sx={{
              mt: 3,
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