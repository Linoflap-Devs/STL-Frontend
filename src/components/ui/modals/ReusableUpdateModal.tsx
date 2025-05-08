import React, { useEffect } from "react";
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
import axiosInstance from "~/utils/axiosInstance";
import { useOperatorsData, useOperatorsStore } from "../../../../store/useOperatorStore";

const ReusableUpdateModal: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  children,
  endpoint,
  initialUserData,
  operatorMap,
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
    areaOfOperations,
    isVerifyModalOpen,
    setIsVerifyModalOpen,
    selectedUserId,
    setSelectedUserId,
    openEditLogModal,
    setOpenEditLogModal,
    handleManagerChange,
  } = useUpdateModalState();
  //const { roleId } = useUserRoleStore();
  const { operators, setOperators } = useOperatorsData();

  useEffect(() => {
    if (!initialUserData || !operatorMap) return;

    // Transform user data with fallbacks
    const transformedUser = {
      ...initialUserData,
      lastName: initialUserData.lastName || "N/A",
      suffix: initialUserData.suffix || "N/A",
      LastUpdatedBy: initialUserData.LastUpdatedBy || "N/A",
      LastUpdatedDate: initialUserData.LastUpdatedDate || "N/A",
      Status: initialUserData.Status || "N/A",
      // Add more fallbacks as needed
    };
    setUser(transformedUser);

    // Get the operator data based on OperatorId
    const operatorId = Number(initialUserData.OperatorId);
    const operator = operatorMap[operatorId] ?? null;

    // Update operator state
    setOperators(operator ? [operator] : []);

    // Debugging logs
    console.log("operatorMap:", operatorMap);
    console.log("initialUserData.OperatorId:", initialUserData.OperatorId);
    console.log("Resolved Operator ID (number):", operatorId);
    console.log("Fetched Operator for User:", operator);
  }, [initialUserData, operatorMap]);


  const alwaysDisabledKeys = [
    "firstName",
    "CreatedBy",
    "DateOfRegistration",
    "OperatorName",
    "DateOfOperation",
    "LastUpdatedBy",
    "LastUpdatedDate",
  ];

  const handleOpenEditLogModal = (userId: number) => {
    setSelectedUserId(userId);
    setOpenEditLogModal(true);
  };

  const handleCloseEditLogModal = () => {
    setSelectedUserId(null);
    setOpenEditLogModal(false);
  };

  const handleDisable = () => {
    useUpdateModalState.setState((state) => ({
      isDisabled: !state.isDisabled,
    }));
  };

  const handleSubmit = () => {
    setIsVerifyModalOpen(true); // Opens confirmation modal
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
            xl: "800px",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0 }}>
        <IconButton sx={{ backgroundColor: '#171717', alignSelf: 'flex-end' }} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20, fontWeight: 700 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: -1 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} key={status} sx={{ my: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ flex: 1, maxWidth: 100 }}>
              <FormControl fullWidth sx={selectStyles}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={status
                    || (isLoading ? "Loading..." : "")}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  disabled={isDisabled}
                  size="small"
                  autoFocus
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Button
                onClick={handleDisable}
                sx={{
                  ...buttonUpdateStyles,
                  mt: 1,
                  fontSize: "14px",
                  px: "1.7rem",
                }}
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
                {/* {openEditLogModal && selectedUserId !== null && (
                  <EditLogModalPage
                    open={openEditLogModal}
                    onClose={handleCloseEditLogModal}
                    userId={selectedUserId}
                  />
                )} */}
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
          {/* {isVerifyModalOpen && (
            <ConfirmUserActionModalPage
              open={isVerifyModalOpen}
              onClose={() => setIsVerifyModalOpen(false)}
              onVerified={() => setIsVerifyModalOpen(false)}
              onSubmit={onSubmit}
              selectedUser={user}
              setSelectedUser={setSelectedUser}
              actionType="update"
              user={user}
              setUser={setUser}
              setErrors={setErrors}
            />
          )} */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableUpdateModal;
