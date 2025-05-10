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
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReusableModalPageProps } from "~/types/interfaces";
import { buttonUpdateStyles, selectStyles } from "~/styles/theme";
import { useUpdateModalState } from "../../../../store/useUpdateModalStore";
import { formatKey } from "~/utils/format";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import { getUserStatus } from "~/utils/dashboarddata";
import dayjs from "dayjs";
import axiosInstance from "~/utils/axiosInstance";
import { AxiosError } from "axios";
import EditModalDataPage from "./EditLogModal";
import { useModalStore } from "../../../../store/useModalStore";

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
    setIsVerifyModalOpen,
    selectedUserId,
    setSelectedUserId,
    openEditLogModal,
    setOpenEditLogModal,
    handleManagerChange,
  } = useUpdateModalState();

  const { operators, setOperators } = useOperatorsData();
  const [originalUserData, setOriginalUserData] = useState(null);
  const { openModal, modalOpen, modalType, selectedData, closeModal } = useModalStore();

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

  // keys will not update
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

  const handleSubmit = async () => {
    try {
      if (!endpoint) throw new Error("Endpoint is missing.");
      if (typeof endpoint === 'object' && !endpoint.update) {
        throw new Error("Invalid endpoint: 'update' endpoint is required.");
      }

      const endpointUrl = typeof endpoint === 'string' ? endpoint : endpoint.update;
      console.log("Using endpoint:", endpointUrl);

      if (!originalUserData) throw new Error("Original user data is missing.");

      // Only include fields that changed
      const updatedFields: Record<string, any> = {
        userId: user.UserId,
      };

      Object.entries(user).forEach(([key, value]) => {
        const originalValue = originalUserData[key];
        if (key !== 'UserId' && value !== originalValue) {
          // Normalize casing for API
          const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
          updatedFields[normalizedKey] = value;
        }
      });

      console.log("Final payload (only changed fields):", updatedFields);

      if (!updatedFields.userId) {
        throw new Error("userId is missing from the payload.");
      }

      const response = await axiosInstance.patch(endpointUrl, updatedFields, {
        withCredentials: true,
      });

      console.log("Update success:", response.data);
    } catch (error) {
      const err = error as AxiosError;

      console.error("Error object:", err);
      console.error("Error message:", err.message);

      if (err.response) {
        console.error("Error response:", err.response);
        console.error("Error status code:", err.response.status);
        console.error("Error response data:", err.response.data);
      }

      if (err.request) {
        console.error("Error request:", err.request);
      }

      if (err.stack) {
        console.error("Error stack:", err.stack);
      }
    }
  };

  const handleVerifySubmit = async () => {
    try {
      console.log("Submitting update to endpoint:", endpoint, user);
      setIsVerifyModalOpen(false);
    } catch (err) {
      console.error(err);
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
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status}
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
                      <FormControl fullWidth error={!!errors[key]}>
                        <InputLabel htmlFor={key}>
                          {formatKey(key)}
                        </InputLabel>
                        <OutlinedInput
                          id={key}
                          name={key}
                          placeholder={`Enter ${formatKey(key)}`}
                          value={user[key as keyof typeof user] ||
                            (isLoading ? "Loading..." : "")}
                          onChange={handleManagerChange}
                          label={formatKey(key)}
                          disabled={
                            alwaysDisabledKeys.includes(key) || isDisabled
                          }
                          size="small"
                        />
                        {errors[key] && (
                          <FormHelperText error>
                            {errors[key]}
                          </FormHelperText>
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
                <FormControl key={key} fullWidth error={!!errors[key]}>
                  <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    placeholder={`Enter ${formatKey(key)}`}
                    value={
                      isLoading
                        ? "Loading..."
                        : key === "DateOfRegistration"
                          ? (() => {
                            const date = user?.[key as keyof typeof user];
                            return date && !isNaN(new Date(date as string).getTime())
                              ? new Date(date as string).toISOString().split("T")[0].replace(/-/g, "/")
                              : "N/A";
                          })()
                          : user?.[key as keyof typeof user] ?? "N/A"
                    }
                    onChange={handleManagerChange}
                    disabled={
                      alwaysDisabledKeys.includes(key) ||
                      isDisabled ||
                      isLoading
                    }
                    label={formatKey(key)}
                    size="small"
                  />
                  {errors[key] && (
                    <FormHelperText error>{errors[key]}</FormHelperText>
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
              {["OperatorName", "DateOfOperation"].map((key) => (
                <Stack key={key} spacing={3}>
                  <FormControl fullWidth error={!!errors[key]}>
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={
                        isLoading
                          ? "Loading..."
                          : key === "DateOfOperation"
                            ? (() => {
                              const date = operators?.[0]?.DateOfOperation;
                              return date && !isNaN(new Date(date).getTime())
                                ? new Date(date).toISOString().split("T")[0].replace(/-/g, "/")
                                : "N/A";
                            })()
                            : operators?.[0]?.[key as keyof typeof operators[0]] ?? "N/A"
                      }
                      onChange={handleManagerChange}
                      label={formatKey(key)}
                      disabled={alwaysDisabledKeys.includes(key) || isDisabled}
                      size="small"
                    />
                    {errors[key] && <FormHelperText error>{errors[key]}</FormHelperText>}
                  </FormControl>
                </Stack>
              ))}
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
                      ? "Loading..."
                      : operators && operators.length > 0
                        ? (() => {
                          const cities = operators.flatMap((operator) => operator?.Cities || []);
                          return cities.length > 0
                            ? cities.map((city: any) => city.CityName).join(", ")
                            : "N/A";
                        })()
                        : "N/A"
                  }
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
                placeholder={`Enter Remarks`}
                value={user.remarks || ""}
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
