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
import { User } from "~/pages/Protected/users/[role]";
import { fetchUserById } from "~/utils/api/users";
import { fetchOperator } from "~/utils/api/operators";
import EditLogModalPage from "./EditLogModal";
import ConfirmUserActionModalPage from "./ConfirmUserActionModal";
import { userSchema } from "~/utils/validation";
import CloseIcon from "@mui/icons-material/Close";
import { buttonUpdateStyles, selectStyles } from "../../styles/theme";
import { zodToJsonErrors } from "~/utils/zodToJsonErrors";
import Swal from "sweetalert2";
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
  users: User | null;
  onClose: () => void;
  onSubmit: (userData: User) => void;
  getUserStatus: (user: User, sevenDaysAgo: dayjs.Dayjs) => string;
  sevenDaysAgo: dayjs.Dayjs;
  fallback: <T>(value: T | null | undefined, defaultValue: T) => T;
}

const UpdateManager: React.FC<UpdateManagerProps> = React.memo(
  ({ open, onClose, onSubmit, users, getUserStatus, sevenDaysAgo, fallback }) => {
    const [user, setUser] = useState<User>({
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
    const [isLoading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUserDetails = async () => {
      if (!users?.userId) return;
      setLoading(true); // Start loading

      try {
        const [userRes, operatorRes] = await Promise.all([
          fetchUserById(users.userId),
          users.OperatorDetails?.OperatorId
            ? fetchOperator(users.OperatorDetails.OperatorId).then(res => res?.data ?? {})
            : Promise.resolve({}), // fallback if no OperatorId
        ]);

        const user = userRes?.data ?? {};
        const operator = operatorRes ?? {};

        const cities = operator.Cities?.length
          ? operator.Cities.map((c: any) => c.CityName).join(", ")
          : "No cities available";

        const userStatus = getUserStatus(user, sevenDaysAgo);

        setStatus(userStatus);
        setAreaOfOperations(cities);

        const updatedUser = {
          UserId: fallback(user.UserId, null),
          firstName: fallback(user.FirstName, "N/A"),
          lastName: fallback(user.LastName, "N/A"),
          phoneNumber: fallback(user.PhoneNumber, "N/A"),
          email: fallback(user.Email, "N/A"),
          suffix: fallback(user.Suffix, "N/A"),
          CreatedBy: fallback(user.CreatedBy, "N/A"),
          DateOfRegistration: fallback(user.DateOfRegistration, "N/A"),
          Status: userStatus,
          remarks: fallback(user.remarks, ""),
          OperatorName: fallback(operator.OperatorName, "N/A"),
          DateOfOperation: fallback(operator.DateOfOperation, "N/A"),
          OperatorId: fallback(operator.OperatorId, null),
          AreaOfOperations: cities,
          LastUpdatedBy: fallback(user.LastUpdatedBy, "N/A"),
          LastUpdatedDate: fallback(user.LastUpdatedDate, "N/A"),
        };

        setUser(updatedUser);
        console.log("Updated user:", updatedUser);
      } catch (err) {
        console.error("Error fetching manager details:", err);
      } finally {
        setLoading(false); // Finish loading regardless of success/failure
      }
    };

    // Fetching of data using useEffect
    useEffect(() => {
      if (!open || !users?.userId) return;

      fetchUserDetails();
    }, [open, users?.userId, sevenDaysAgo, getUserStatus]);

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
      try {
        userSchema.parse(user);
      } catch (err) {
        const formattedErrors = zodToJsonErrors(err);
        console.log("Zod Validation Errors:", formattedErrors);
        setErrors(formattedErrors);
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
                            isLoading ? "Loading..."
                              : key === "DateOfOperation"
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
                      value={areaOfOperations || (isLoading ? "Loading..." : "")}
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
                <Button
                  onClick={handleUpdateManagerSubmit}
                  sx={{
                    ...buttonUpdateStyles,
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
              )}
            </Stack>
          </DialogContent>
        </Dialog>
      </Suspense>
    );
  }
);

export default UpdateManager;
