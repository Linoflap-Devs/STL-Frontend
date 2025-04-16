import React, { useState, useEffect, Suspense } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import { buttonUpdateStyles, selectStyles } from "../../styles/theme";
import { fetchUserById } from "~/utils/api/users";
import EditLogModalPage from "./EditLogModal";
import { userSchema } from "~/utils/validation";
import ConfirmUpdateManagerPage from "./ConfirmUpdateUser";
import Swal from "sweetalert2";
import { fetchOperator } from "~/utils/api/operators";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

const UsersUpateModalSkeleton = dynamic(() =>
  import("~/components/user/UsersSkeleton").then((mod) => ({
    default: mod.UsersSkeletonPage,
  }))
);

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
    phoneNumber: string;
    email: string;
    suffix: string;
    Status: any;
    remarks: string;
    OperatorId: number | null;
  }) => void;
  getUserStatus: (user: User, sevenDaysAgo: dayjs.Dayjs) => string;
  sevenDaysAgo: dayjs.Dayjs;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(
  ({ open, onClose, onSubmit, manager, getUserStatus, sevenDaysAgo }) => {
    const [user, setUser] = useState<{
      UserId: number | null;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      suffix: string;
      Status: any;
      remarks: string;
      OperatorId: number | null;
      LastUpdatedDate: string | null;
    }>({
      UserId: null,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      suffix: "",
      Status: "",
      remarks: "",
      OperatorId: null,
      LastUpdatedDate: null,
    });

    const pageType = window.location.pathname.includes("manager")
      ? "manager"
      : "executive";
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [openEditLogModal, setOpenEditLogModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogType | null>(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isViewMode, setIsViewMode] = useState(false);
    const [areaOfOperations, setAreaOfOperations] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // fetching of data
    useEffect(() => {
      if (!open || !manager?.userId) return;

      const fetchManagerDetails = async () => {
        try {
          const [userRes, operatorRes] = await Promise.all([
            fetchUserById(manager.userId),
            fetchOperator(manager.OperatorDetails?.OperatorId),
          ]);

          const user = userRes?.data ?? {};
          const operator = operatorRes?.data ?? {};

          const cities =
            operator.Cities?.length > 0
              ? operator.Cities.map((c: any) => c.CityName).join(", ")
              : "No cities available";

          const userStatus = getUserStatus(user, sevenDaysAgo);

          setStatus(userStatus);
          setAreaOfOperations(cities);

          const updatedUser = {
            UserId: user.UserId ?? null,
            firstName: user.FirstName ?? "N/A",
            lastName: user.LastName ?? "N/A",
            phoneNumber: user.PhoneNumber ?? "N/A",
            email: user.Email ?? "N/A",
            suffix: user.Suffix ?? "N/A",
            CreatedBy: user.CreatedBy ?? "N/A",
            DateOfRegistration: user.DateOfRegistration ?? "N/A",
            Status: userStatus,
            remarks: user.remarks ?? "N/A",
            OperatorName: operator.OperatorName ?? "N/A",
            DateOfOperation: operator.DateOfOperation ?? "N/A",
            OperatorId: operator.OperatorId ?? null,
            AreaOfOperations: cities,
            LastUpdatedBy: user.LastUpdatedBy ?? "N/A",
            LastUpdatedDate: user.LastUpdatedDate ?? "N/A",
          };

          setUser(updatedUser);
          console.log('updated user: ', updatedUser)
        } catch (err) {
          console.error("Error fetching manager details:", err);
        }
      };

      fetchManagerDetails();
    }, [open, manager?.userId, sevenDaysAgo, getUserStatus]);

    // disable functions
    const handleDisable = () => {
      setIsViewMode((prev) => !prev);
      setIsDisabled((prev) => !prev);
    };

    const alwaysDisabledKeys = [
      "firstName",
      "CreatedBy",
      "DateOfRegistration",
      "OperatorName",
      "DateOfOperation",
      "LastUpdatedBy",
      "LastUpdatedDate",
    ];
    const label = pageType === "manager" ? "Manager" : "Executive";

    const handleManagerChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;

      setUser((prevUser) => {
        if (!prevUser) {
          return {
            UserId: null,
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            suffix: "",
            Status: "",
            remarks: "",
            OperatorId: null,
            LastUpdatedDate: null,
            [name]: value,
          };
        }

        return {
          ...prevUser,
          [name]: value,
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

    // form submitter
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
        cancelButtonText:
          '<span style="color: #212121;">No, let me check</span>',
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
      <Suspense fallback={<UsersUpateModalSkeleton />}>
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
          <DialogTitle
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              pt: 0,
            }}
          >
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
            <Typography
              variant="h5"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {isViewMode ? `Update ${label}` : `View ${label}`}
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
                      defaultValue={status}
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
                  {["firstName", "lastName", "phoneNumber", "email"].map(
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
                                value={user?.lastName || ""}
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
                                value={user.suffix || "N/A"}
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
                              value={user[key as keyof typeof user] || ""}
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
                          user[key as keyof typeof user] ||
                          (isLoading ? "Loading..." : "")
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
                            key === "DateOfOperation"
                              ? user.LastUpdatedDate &&
                                !isNaN(new Date(user.LastUpdatedDate).getTime())
                                ? new Date(user.LastUpdatedDate)
                                    .toISOString()
                                    .split("T")[0]
                                    .replace(/-/g, "/")
                                : user[key as keyof typeof user] || ""
                              : user[key as keyof typeof user] || ""
                          }
                          onChange={handleManagerChange}
                          label={formatKey(key)}
                          disabled={
                            alwaysDisabledKeys.includes(key) || isDisabled
                          }
                          size="small"
                        />
                        {errors[key] && (
                          <FormHelperText error>{errors[key]}</FormHelperText>
                        )}
                      </FormControl>
                    </Stack>
                  ))}
                </Stack>

                {/* History Fields */}
                <Stack spacing={3} sx={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <TextField
                      id="AreaOfOperations"
                      name="areaofoperations"
                      onChange={handleManagerChange}
                      label="Area of Operations"
                      multiline
                      minRows={4}
                      value={areaOfOperations}
                      variant="outlined"
                      disabled
                      size="small"
                    />
                  </FormControl>
                </Stack>
              </Stack>

              {/* Remarks Field */}
              {!isDisabled && (
                <FormControl fullWidth error={Boolean(errors.remarks)}>
                  <TextField
                    id="remarks"
                    name="remarks"
                    label="Remarks"
                    onChange={handleManagerChange}
                    multiline
                    minRows={3}
                    variant="outlined"
                    size="small"
                    sx={{ my: 1 }}
                  />
                </FormControl>
              )}

              {!isDisabled && (
                <Button
                  onClick={handleUpdateManagerSubmit}
                  sx={{
                    ...buttonUpdateStyles,
                    mt: 3,
                    padding: "0.8rem",
                    fontSize: "12px",
                    width: "100%",
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
      </Suspense>
    );
  }
);

export default UpdateManager;
