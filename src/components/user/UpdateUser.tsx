import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  TextField,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Box,
  Stack,
} from "@mui/material";

import { formatKey } from "../../utils/format";
import { User } from "./UsersTable";
import CloseIcon from '@mui/icons-material/Close';
import { inputStyles, selectStyles } from "../../styles/theme";
import { fetchUserById } from "~/utils/api/users";
import dayjs, { Dayjs } from "dayjs";
import EditLogModalPage from "./EditLogModal";
import { validateUser } from "~/utils/validation"
import ConfirmUpdateManagerPage from "./ConfirmUpdateUser";
import Swal from "sweetalert2";

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
    operatorName: string;
  }) => void;
  isDisabled: boolean;
  isClicked: boolean;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(({
  open,
  onClose,
  onSubmit,
  manager,
}) => {
  const [user, setUser] = useState<{
    UserId: number | null;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    suffix: string;
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
  //const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openEditLogModal, setOpenEditLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogType | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (!open || !manager?.userId) return;

    const fetchManagerDetails = async () => {
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
        //setSelectState(updatedUser);
        setStatus(updatedUser.Status);
      } catch (error) {
        console.error("Error fetching manager:", error);
      }
    };

    fetchManagerDetails();
  }, [open, manager?.userId]);

  const handleDisable = () => {
    setIsViewMode((prev) => !prev);
    setIsDisabled((prev) => prev ? false : true);
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
        <Stack spacing={2} key={status} sx={{ my: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Box sx={{ flex: 1, maxWidth: 100 }}>
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
                {isViewMode ? "Update" : "View"}
              </Button>
            </Box>
          </Box>

          {/* Personal Information Fields */}
          <Stack direction="row" spacing={3}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography>Personal Information</Typography>
              {["firstName", "lastName", "phoneNumber", "email"].map((key) => (
                <Stack key={key} spacing={0}>
                  {key === "status" ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1">Status</Typography>
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
                    </Stack>
                  ) : key === "lastName" ? (
                    <Stack direction="row" spacing={2}>
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
                    </Stack>
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
                </Stack>
              ))}
            </Stack>

            {/* History Fields */}
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography sx={{ marginBottom: 0 }}>History</Typography> {/* Remove marginBottom */}
              {["CreatedBy", "DateOfRegistration", "phoneNumber", "email"].map((key) => (
                <FormControl key={key} fullWidth error={!!errors[key]} sx={inputStyles} variant="outlined">
                  <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    placeholder={`Enter ${formatKey(key)}`}
                    value={user[key as keyof typeof user] || ""}
                    onChange={handleManagerChange}
                    label={formatKey(key)}
                    disabled={isDisabled || key === "CreatedBy" || key === "DateOfRegistration" || key === "DateOfRegistration"}
                  />
                  {errors[key] && <FormHelperText error>{errors[key]}</FormHelperText>}
                </FormControl>
              ))}

              {/* View Summary */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Typography
                  sx={{ fontSize: 12, color: "#67ABEB", cursor: "pointer", mt: -1 }}
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
            </Stack>
          </Stack>

          {/* Authorized Agents Corporations */}
          <Stack sx={{ flex: 1, width: '100%' }}>
            <Typography>Authorized Agents</Typography>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              {["firstName", "DateOfRegistration"].map((key) => (
                <Stack key={key} spacing={3}>
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
                </Stack>
              ))}
            </Stack>

            {/* History Fields */}
            <Stack spacing={3} sx={{ flex: 1 }}>
              <FormControl fullWidth variant="outlined" sx={inputStyles} error={Boolean(errors.remarks)}>
                <TextField
                  id="AreaOfOperations"
                  name="areaofoperations"
                  onChange={handleManagerChange}
                  label="Areaofoperations"
                  disabled={isDisabled}
                  multiline
                  minRows={4}
                  variant="outlined"
                />
              </FormControl>
            </Stack>
          </Stack>

          {/* Remarks Field */}
          {!isDisabled && (
            <FormControl fullWidth variant="outlined" sx={inputStyles} error={Boolean(errors.remarks)}>
              <TextField
                id="remarks"
                name="remarks"
                onChange={handleManagerChange}
                label="Remarks"
                multiline
                minRows={3}
                variant="outlined"
                sx={{ mt: 1, mb: 2, }}
              />
            </FormControl>
          )}

          {!isDisabled && (
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
              onSubmit={onSubmit}
              setUser={setUser}
            />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
);

export default UpdateManager;