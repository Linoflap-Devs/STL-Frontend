// this is a reusable update component
// that needed to customize the fields

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  OutlinedInput,
  Box,
  Stack,
  IconButton,
  FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { ReusableModalPageProps } from "~/types/interfaces";
import { buttonUpdateStyles, selectStyles } from "~/styles/theme";
import { getUserStatus } from "~/utils/dashboarddata";
import axiosInstance from "~/utils/axiosInstance";
import { useUpdateModalState } from "../../../../store/useUpdateModalStore";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import EditModalDataPage from "./EditLogModal";
import Swal from "sweetalert2";
import { updateSchema } from "~/utils/validation";

const ReusableUpdateModal: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  endpoint,
  initialUserData,
  operatorMap,
  children
}) => {
  const {
    user,
    setUser,
    errors,
    setErrors,
    status,
    setStatus,
    isDisabled,
    isLoading,
    isViewMode,
    selectedUserId,
    setSelectedUserId,
    openEditLogModal,
    setOpenEditLogModal,
    handleManagerChange,
  } = useUpdateModalState();

  const { operators, setOperators } = useOperatorsData();
  const [originalUserData, setOriginalUserData] = useState(null);

  // fetching of initial data
  useEffect(() => {
    if (!initialUserData || !operatorMap) return;

    const sevenDaysAgo = dayjs().subtract(7, "day");

    const transformedUser = {
      ...initialUserData,
      userId: initialUserData.UserId || "N/A",
      phoneNumber: initialUserData.PhoneNumber || "N/A",
      email: initialUserData.Email || "N/A",
      LastUpdatedBy: initialUserData.LastUpdatedBy || "N/A",
      LastUpdatedDate: initialUserData.LastUpdatedDate || "N/A",
    };

    setUser(transformedUser);
    setOriginalUserData(transformedUser);

    const operatorId = Number(initialUserData.OperatorId);
    const operator = operatorMap[operatorId] ?? null;
    setOperators(operator ? [operator] : []);

    const userStatus = getUserStatus(initialUserData, sevenDaysAgo);
    setStatus(userStatus);
  }, [initialUserData, operatorMap]);

  // keys that will not update
  const alwaysDisabledKeys = [
    "FirstName",
    "LastName",
    "OperatorName",
    "CreatedBy",
    "DateOfRegistration",
    "DateOfOperation",
    "LastUpdatedBy",
    "LastUpdatedDate",
  ];

  const handleCloseEditLogModal = () => setOpenEditLogModal(false);

  const handleOpenEditLogModal = (userId: number | null) => {
    setSelectedUserId(userId);
    setOpenEditLogModal(true);
  };

  const handleDisable = () => {
    useUpdateModalState.setState((state) => ({
      isDisabled: !state.isDisabled,
    }));
  };

  const formatKey = (key: string) => {
    // Insert space before capital letters (e.g. "FirstName" → "First Name")
    return key.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const handleSubmit = async () => {
    try {
      if (!endpoint) throw new Error("Endpoint is missing.");
      if (typeof endpoint === 'object' && !endpoint.update) {
        throw new Error("Invalid endpoint: 'update' endpoint is required.");
      }

      const endpointUrl = typeof endpoint === 'string' ? endpoint : endpoint.update;

      if (!originalUserData) throw new Error("Original user data is missing.");

      const parsed = updateSchema.safeParse(user);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.errors.forEach((err) => {
          const key = err.path[0] as string;
          fieldErrors[key] = err.message;
        });

        setErrors(fieldErrors);  // Show inline errors only
        return; // Don't show a Swal popup here
      }

      const updatedFields: Record<string, any> = { userId: user.UserId };
      Object.entries(user).forEach(([key, value]) => {
        const originalValue = originalUserData[key];
        if (key !== 'UserId' && value !== originalValue) {
          const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
          updatedFields[normalizedKey] = value;
        }
      });

      if (!updatedFields.userId) {
        throw new Error("userId is missing from the payload.");
      }

      // Add confirmation prompt before making the API call
      const confirmationResult = await Swal.fire({
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

      if (!confirmationResult.isConfirmed) {
        // User canceled, exit function
        return;
      }

      const response = await axiosInstance.patch(endpointUrl, updatedFields, {
        withCredentials: true,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User updated successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      const err = error as AxiosError;

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: (err.response?.data as { message?: string })?.message || err.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
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
            xl: "720px",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0 }}>
        <IconButton
          sx={{ alignSelf: 'flex-end' }}
          onClick={onClose}
        >
          <CloseIcon
            sx={{
              fontSize: 28,
              fontWeight: 700,
              backgroundColor: '#ACA993',
              borderRadius: '50%',
              padding: '4px',
              color: '#FFFFFF',
            }}
          />
        </IconButton>
        <Typography sx={{ fontSize: 26, fontWeight: 'bold', mt: -1 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} key={status} sx={{ my: 1.5 }}>
          {/* Status & Toggle Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Box sx={{ flex: 1, maxWidth: 100 }}>
              <FormControl fullWidth sx={selectStyles} error={!status && !isDisabled}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status || ""}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  disabled={isDisabled}
                  size="small"
                  autoFocus
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Button
                onClick={handleDisable}
                sx={{ ...buttonUpdateStyles, mt: 1, fontSize: "14px", px: "1.7rem" }}
                variant="contained"
              >
                {isViewMode ? "View" : "Update"}
              </Button>
            </Box>
          </Box>

          {/* Personal Information Fields */}
          <Stack direction="row" spacing={3}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography>Personal Information</Typography>
              {["FirstName", "LastName", "PhoneNumber", "Email"].map(
                (key) => (
                  <Stack key={key} spacing={0}>
                    {key === "lastName" ? (
                      <Stack direction="row" spacing={2}>
                        <FormControl fullWidth error={!!errors.lastName}>
                          <InputLabel
                            sx={{ fontSize: "14px" }}
                            htmlFor="lastName"
                          >
                            Last Name
                          </InputLabel>
                          <OutlinedInput
                            id="lastName"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={user?.lastName
                              || (isLoading ? "Loading..." : "")}
                            onChange={handleManagerChange}
                            label="Last Name"
                            disabled
                            size="small"
                          />
                          {errors.lastName && (
                            <FormHelperText>
                              {errors.lastName}
                            </FormHelperText>
                          )}
                        </FormControl>
                        <FormControl fullWidth error={!!errors.suffix}>
                          <InputLabel htmlFor="suffix">Suffix</InputLabel>
                          <OutlinedInput
                            id="suffix"
                            name="suffix"
                            placeholder="Enter Suffix"
                            value={user?.suffix || (isLoading ? "Loading..." : "")}
                            onChange={handleManagerChange}
                            label="Suffix"
                            disabled
                            size="small"
                          />
                          {errors.suffix && (
                            <FormHelperText>{errors.suffix}</FormHelperText>
                          )}
                        </FormControl>
                      </Stack>
                    ) : (
                      <FormControl fullWidth error={Boolean(errors[key])} size="small">
                        <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                        <OutlinedInput
                          id={key}
                          name={key}
                          label={formatKey(key)}
                          placeholder={`Enter ${formatKey(key)}`}
                          value={user[key as keyof typeof user] || ""}
                          onChange={handleManagerChange}
                          disabled={alwaysDisabledKeys.includes(key) || isDisabled}
                        />
                        {errors[key] && (
                          <FormHelperText>{errors[key]}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Stack>
                )
              )}
            </Stack>

            {/* History Fields */}
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Typography sx={{ mb: 0 }}>History</Typography>
              {[
                "CreatedBy",
                "DateOfRegistration",
                "LastUpdatedBy",
                "LastUpdatedDate",
              ].map((key) => (
                <FormControl key={key} fullWidth error={!!errors[key]} size="small">
                  <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    label={formatKey(key)}
                    placeholder={`Enter ${formatKey(key)}`}
                    value={
                      isLoading
                        ? ""
                        : key === "DateOfRegistration" || key === "LastUpdatedDate"
                          ? (() => {
                            const dateValue = user?.[key as keyof typeof user];
                            return dateValue && !isNaN(Date.parse(dateValue as string))
                              ? new Date(dateValue as string).toISOString().split("T")[0]
                              : "";
                          })()
                          : (user?.[key as keyof typeof user] ?? "")
                    }
                    onChange={handleManagerChange}
                    disabled={
                      alwaysDisabledKeys.includes(key) || isDisabled || isLoading
                    }
                  />
                  {errors[key] && (
                    <FormHelperText>{errors[key]}</FormHelperText>
                  )}
                </FormControl>
              ))}

              {/* View Summary */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#67ABEB",
                    cursor: "pointer",
                    mt: -1,
                  }}
                  onClick={() => handleOpenEditLogModal(user.UserId)}
                >
                  View Summary
                </Typography>
                {/* open edit modal */}
                {openEditLogModal && selectedUserId != null && (
                  <EditModalDataPage
                    userId={selectedUserId}
                    onClose={handleCloseEditLogModal}
                  />
                )}
              </Box>
            </Stack>
          </Stack>

          {/* Authorized Agents Corporations */}
          <Stack sx={{ flex: 1, width: "100%" }}>
            <Typography>Authorized Agents</Typography>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              {["OperatorName", "DateOfOperation"].map((key) => {
                const value =
                  isLoading
                    ? ""
                    : key === "DateOfOperation"
                      ? (() => {
                        const date = operators?.[0]?.DateOfOperation;
                        return date && !isNaN(new Date(date).getTime())
                          ? new Date(date).toISOString().split("T")[0]
                          : "";
                      })()
                      : operators?.[0]?.[key as keyof typeof operators[0]] ?? "";

                return (
                  <FormControl key={key} fullWidth error={!!errors[key]}>
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      label={formatKey(key)}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={value}
                      type={key === "DateOfOperation" ? "date" : "text"}
                      onChange={handleManagerChange}
                      disabled={alwaysDisabledKeys.includes(key) || isDisabled || isLoading}
                      size="small"
                    />
                    {errors[key] && (
                      <FormHelperText error>{errors[key]}</FormHelperText>
                    )}
                  </FormControl>
                );
              })}

            </Stack>
            <Stack spacing={3} sx={{ flex: 1 }}>
              <FormControl fullWidth>
                <TextField
                  id="AreaOfOperations"
                  name="areaofoperations"
                  onChange={handleManagerChange}
                  label="Area of Operations"
                  multiline
                  minRows={4}
                  value={
                    isLoading
                      ? ""
                      : operators && operators.length > 0
                        ? operators
                          .flatMap((operator) => operator?.Cities || [])
                          .map((city) => city.CityName)
                          .join(", ")
                        : ""
                  }
                  placeholder={isLoading ? "Loading..." : "No cities available"}
                  variant="outlined"
                  disabled
                  size="small"
                />
              </FormControl>
            </Stack>
          </Stack>

          {/* Remarks Field */}
          {!isDisabled && (
            <FormControl fullWidth error={!!errors.remarks}>
              <InputLabel htmlFor="remarks">Remarks</InputLabel>
              <OutlinedInput
                id="remarks"
                name="remarks"
                label="Remarks"
                placeholder="Enter Remarks"
                value={typeof user.remarks === "string" ? user.remarks : ""}
                onChange={handleManagerChange}
                size="small"
                multiline
                minRows={3}
              />
              {errors.remarks && (
                <FormHelperText>{errors.remarks}</FormHelperText>
              )}
            </FormControl>
          )}
          {!isDisabled && (
            <div className="mt-4">
              {children({ handleSubmit })}
            </div>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableUpdateModal;
