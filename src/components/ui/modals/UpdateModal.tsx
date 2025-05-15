// this is a reusable update component
// that needed to customize the fields

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  Stack,
  IconButton,
  FormHelperText,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { AxiosError } from "axios";
import { ReusableModalPageProps } from "~/types/interfaces";
import { buttonUpdateStyles, selectStyles } from "~/styles/theme";
import { getRoleName, getUserStatus } from "~/utils/dashboarddata";
import axiosInstance from "~/utils/axiosInstance";
import { useUpdateModalState } from "../../../../store/useUpdateModalStore";
import { useOperatorsData } from "../../../../store/useOperatorStore";
import EditModalDataPage from "./EditLogModal";
import Swal from "sweetalert2";
import {
  generateValidPassword,
  updateSchema,
  userSchema,
} from "~/schemas/userSchema";
import useUserRoleStore from "../../../../store/useUserStore";
import Select from "react-select";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ReusableUpdateModal: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  endpoint,
  initialUserData,
  operatorMap,
  children,
  provinces,
  regions,
  cities,
  gameTypes,
}) => {
  const {
    user,
    setUser,
    errors,
    setErrors,
    status,
    setStatus,
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
  const [isDisabled, setIsDisabled] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const { roleId } = useUserRoleStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    [key: string]: string | number | boolean | string[];
  }>({});

  console.log('PROVINCES OPE', provinces)
  console.log("HELLLOOOOOO GAME TYPE:", gameTypes);
  const gameTypeOptions =
    gameTypes?.map((type) => ({
      value: type.GameCategoryId,
      label: type.GameCategory,
    })) || [];

  const provincesOptions =
    provinces?.map((type) => ({
      value: type.ProvinceId,
      label: type.ProvinceName,
    })) || [];

  const handleDisable = () => {
    setIsDisabled(false);
    setShowEditButton(false); // Hide the button
  };

  const handleFocus = () => {
    setIsTouched(true); // Mark as touched so we stop showing "*****"
  };

  useEffect(() => {
    if (!initialUserData) return;

    const sevenDaysAgo = dayjs().subtract(7, "day");

    const transformedUser = {
      ...initialUserData,
      operatorId: initialUserData.OperatorId ?? null,
      userId: initialUserData.UserId || "null",
      phoneNumber: initialUserData.PhoneNumber || "",
      contactNumber: initialUserData.ContactNo || "",
      email: initialUserData.Email || "",
      LastUpdatedBy: initialUserData.LastUpdatedBy || "",
      LastUpdatedDate: initialUserData.LastUpdatedDate || "",
    };

    setUser(transformedUser);
    setOriginalUserData(transformedUser);

    console.log("Original User Datasss:", transformedUser);

    const userStatus = getUserStatus(initialUserData, sevenDaysAgo);
    setStatus(userStatus);
  }, [initialUserData]);

  useEffect(() => {
    if (!initialUserData || !operatorMap) return;

    const operatorId = Number(initialUserData.OperatorId);
    const operator = operatorMap[operatorId] ?? null;
    setOperators(operator ? [operator] : []);
  }, [initialUserData, operatorMap]);

  console.log("ENDPOINTTT", endpoint);

  // FOR MULTI SELECT FIELDS
  const handleMultiSelect = (name: string, selectedOptions: any[]) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log(`Selected Values for ${name}:`, selectedValues);

    if (name === "STLRegion") {
      // Filter provinces based on selected region IDs
      const filteredProvinces = (provinces ?? [])
        .filter((province) =>
          selectedValues.includes(Number(province.RegionId))
        )
        .map((province) => ({
          value: province.ProvinceId,
          label: province.ProvinceName,
        }));

      console.log("Filtered Provinces:", filteredProvinces);

      // Reset province and city selections when region changes
      setUser((prev: any) => ({
        ...prev,
        STLRegion: selectedValues,
        STLProvince: [],
        STLCity: [],
      }));

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);
    } else if (name === "STLProvince") {
      // Filter cities based on selected province IDs
      const filteredCities = (cities ?? [])
        .filter((city) => selectedValues.includes(city.ProvinceId)) // Match with ProvinceId
        .map((city) => ({
          value: city.CityId,
          label: city.CityName.trim(), // Trim any extra spaces from CityName
        }));

      console.log("Filtered Cities:", filteredCities);
      // Reset city selection when province changes
      setUser((prev: any) => ({
        ...prev,
        STLProvince: selectedValues,
        STLCity: [],
      }));

      setFilteredCities(filteredCities);
    } else if (name === "STLCity") {
      // Simply update selected city values
      console.log("Selected Cities:", selectedValues);

      setUser((prev: any) => ({
        ...prev,
        STLCity: selectedValues,
      }));
    } else {
      // For other fields, just update as usual
      setUser((prev: any) => ({
        ...prev,
        [name]: selectedValues,
      }));
    }
  };

  const roleName = getRoleName(roleId ?? 0);
  console.log("Role Name:", roleName);

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

  const formatKey = (key: string) => {
    return key.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!endpoint) throw new Error("Endpoint is missing.");
      if (typeof endpoint === "object" && !endpoint.update) {
        throw new Error("Invalid endpoint: 'update' endpoint is required.");
      }

      const endpointUrl =
        typeof endpoint === "string" ? endpoint : endpoint.update;

      if (!originalUserData) throw new Error("Original user data is missing.");

      const updatedFields: Record<string, any> = {};

      // Check if we are updating user data or operator data
      const isUserData = !!user.UserId; // If user.UserId exists, it's user data
      const isOperatorData = !!user.OperatorId; // If user.OperatorId exists, it's operator data

      // Conditional requirement based on user data or operator data
      if (isUserData) {
        // userId is required if we're updating user data
        if (!user.UserId) {
          throw new Error("userId is required for user data.");
        }
        updatedFields.userId = user.UserId; // Add userId to updated fields
      } else if (isOperatorData) {
        // operatorId is required if we're updating operator data
        if (!user.OperatorId) {
          throw new Error("operatorId is required for operator data.");
        }
        updatedFields.operatorId = user.OperatorId; // Add operatorId to updated fields
      }

      // Add other fields (user or operator related) if they have changed
      Object.entries(user).forEach(([key, value]) => {
        const originalValue = originalUserData[key];
        if (
          key !== "UserId" &&
          key !== "OperatorId" &&
          value !== originalValue
        ) {
          const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
          updatedFields[normalizedKey] = value;
        }
      });

      console.log("Updated Fields:", updatedFields);

      // Add confirmation prompt before making the API call
      const confirmationResult = await Swal.fire({
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

      if (!confirmationResult.isConfirmed) {
        // User canceled, exit function
        return;
      }

      const response = await axiosInstance.patch(endpointUrl, updatedFields, {
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      const err = error as AxiosError;

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          (err.response?.data as { message?: string })?.message ||
          err.message ||
          "An unexpected error occurred.",
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
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          py: 0,
        }}
      >
        <IconButton sx={{ alignSelf: "flex-end" }} onClick={onClose}>
          <CloseIcon
            sx={{
              fontSize: 28,
              fontWeight: 700,
              backgroundColor: "#ACA993",
              borderRadius: "50%",
              padding: "4px",
              color: "#FFFFFF",
            }}
          />
        </IconButton>
        <Typography sx={{ fontSize: 26, fontWeight: "bold", mt: -1 }}>
          {isDisabled ? "View" : isViewMode ? "Update" : ""} {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} key={status} sx={{ mb: 1, mt: 3 }}>
          {/* Personal Information Fields */}
          <Stack direction="row" spacing={3}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              {roleName === "Operator" &&
                ["OperatorName"].map((key) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors[key])}
                    size="small"
                    key={key}
                  >
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      label={formatKey(key)}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={user[key as keyof typeof user] || "No data"}
                      onChange={handleManagerChange}
                      disabled={alwaysDisabledKeys.includes(key) || isDisabled}
                    />
                    {errors[key] && (
                      <FormHelperText>{errors[key]}</FormHelperText>
                    )}
                  </FormControl>
                ))}
            </Stack>

            <Stack spacing={3} sx={{ flex: 1 }}>
              {roleName === "Operator" &&
                ["contactNumber"].map((key) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors[key])}
                    size="small"
                    key={key}
                  >
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
                ))}
            </Stack>
          </Stack>

          {roleName === "Operator" &&
            ["OperatorAddress"].map((key) => (
              <FormControl
                fullWidth
                error={Boolean(errors[key])}
                size="small"
                key={key}
              >
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
                {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
              </FormControl>
            ))}

          <Stack direction="row" spacing={3} sx={{ mt: "1.5rem !important" }}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              {(roleName === "Manager" || roleName === "Executive") &&
                ["FirstName", "LastName", "PhoneNumber"].map((key) => (
                  <Stack key={key} spacing={0}>
                    {key === "LastName" ? (
                      <Stack direction="row" spacing={2}>
                        <FormControl fullWidth error={!!errors.lastName}>
                          <InputLabel
                            sx={{ fontSize: "14px" }}
                            htmlFor="LastName"
                          >
                            Last Name
                          </InputLabel>
                          <OutlinedInput
                            id="LastName"
                            name="LastName"
                            placeholder="Enter Last Name"
                            value={
                              user?.LastName ||
                              initialUserData?.LastName ||
                              (isLoading ? "Loading..." : "No data")
                            }
                            onChange={handleManagerChange}
                            label="Last Name"
                            disabled
                            size="small"
                          />
                          {errors.lastName && (
                            <FormHelperText>{errors.lastName}</FormHelperText>
                          )}
                        </FormControl>

                        <FormControl fullWidth error={!!errors.suffix}>
                          <InputLabel htmlFor="suffix">Suffix</InputLabel>
                          <OutlinedInput
                            id="suffix"
                            name="suffix"
                            placeholder="Enter Suffix"
                            value={
                              user?.Suffix ||
                              (isLoading ? "Loading..." : "No data")
                            }
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
                      <FormControl
                        fullWidth
                        error={Boolean(errors[key])}
                        size="small"
                      >
                        <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                        <OutlinedInput
                          id={key}
                          name={key}
                          label={formatKey(key)}
                          placeholder={`Enter ${formatKey(key)}`}
                          value={
                            user[key as keyof typeof user] ||
                            initialUserData?.[key] ||
                            "No data"
                          }
                          onChange={handleManagerChange}
                          disabled={
                            alwaysDisabledKeys.includes(key) || isDisabled
                          }
                        />
                        {errors[key] && (
                          <FormHelperText>{errors[key]}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  </Stack>
                ))}

              {roleName === "Manager" ||
                (roleName === "Executive" && (
                  <Box sx={{ flex: 1 }}>
                    <FormControl
                      fullWidth
                      sx={selectStyles}
                      error={!status && !isDisabled}
                    >
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        id="status"
                        value={{ label: status, value: status }}
                        onChange={(selectedOption) =>
                          setStatus(selectedOption?.value || "")
                        }
                        options={[
                          { label: "Active", value: "Active" },
                          { label: "Inactive", value: "Inactive" },
                        ]}
                        isDisabled={isDisabled}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        autoFocus
                      />
                    </FormControl>
                  </Box>
                ))}

              {roleName === "Operator" &&
                ["email"].map((key) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors[key])}
                    size="small"
                    key={key}
                  >
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
                ))}

              {roleName === "Operator" && (
                <>
                  <Select
                    id="gameTypes"
                    name="gameTypes"
                    value={gameTypeOptions.filter((option) =>
                      (Array.isArray(user.gameTypes)
                        ? user.gameTypes
                        : []
                      ).includes(String(option.value))
                    )}
                    isMulti={false} // Set isMulti to false to allow single selection
                    options={gameTypeOptions}
                    onChange={(selectedOption) =>
                      handleMultiSelect(
                        "gameTypes",
                        selectedOption ? [selectedOption] : []
                      )
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  {errors["gameTypes"] && (
                    <FormHelperText>{errors["gameTypes"]}</FormHelperText>
                  )}
                </>
              )}

                {roleName === "Operator" &&
                ["provinces"].map((key) => (
                <>
                  <Select
                    id="provinces"
                    name="provinces"
                    value={provincesOptions.filter((option: any) =>
                      (Array.isArray(user.provinces)
                        ? user.provinces
                        : []
                      ).includes(String(option.value))
                    )}
                    isMulti={false}
                    options={provincesOptions}
                    onChange={(selectedOption) =>
                      handleMultiSelect(
                        "provinces",
                        selectedOption ? [selectedOption] : []
                      )
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  {errors["provinces"] && (
                    <FormHelperText>{errors["provinces"]}</FormHelperText>
                  )}
                </>
                ))}
            </Stack>

            <Stack spacing={3} sx={{ flex: 1 }}>
              {(roleName === "Manager" || roleName === "Executive") && (
                <>
                  {/* OperatorName and Email Fields */}
                  {["OperatorName", "Email"].map((key) => (
                    <FormControl
                      key={key}
                      fullWidth
                      error={!!errors[key]}
                      size="small"
                      className="mb-4"
                    >
                      <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                      <OutlinedInput
                        id={key}
                        name={key}
                        label={formatKey(key)}
                        placeholder={`Enter ${formatKey(key)}`}
                        value={
                          isLoading
                            ? ""
                            : (operators?.[0]?.[
                                key as keyof (typeof operators)[0]
                              ] ??
                              user?.[key as keyof typeof user] ??
                              initialUserData?.[key] ??
                              "")
                        }
                        onChange={handleManagerChange}
                        disabled={
                          alwaysDisabledKeys.includes(key) ||
                          isDisabled ||
                          isLoading
                        }
                      />
                      {errors[key] && (
                        <FormHelperText>{errors[key]}</FormHelperText>
                      )}
                    </FormControl>
                  ))}

                  {/* Password Field with Generate Button */}
                  <div className="w-full flex gap-4 items-end mb-4">
                    {/* Password Input */}
                    <div className="w-3/5">
                      <FormControl
                        fullWidth
                        error={!!errors["Password"]}
                        size="small"
                      >
                        <InputLabel htmlFor="Password">
                          {formatKey("Password")}
                        </InputLabel>
                        <OutlinedInput
                          id="Password"
                          name="Password"
                          type={showPassword ? "text" : "password"}
                          value={
                            !isTouched && !showPassword && user["Password"]
                              ? "*****"
                              : user["Password"]
                          }
                          onFocus={handleFocus}
                          label={formatKey("Password")}
                          placeholder="********"
                          onChange={handleChange}
                          disabled={isLoading}
                          endAdornment={
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          }
                        />
                        {errors["Password"] && (
                          <FormHelperText>{errors["Password"]}</FormHelperText>
                        )}
                      </FormControl>
                    </div>

                    {/* Generate Password Button */}
                    <div className="w-2/5">
                      <button
                        type="button"
                        onClick={() => {
                          const generatedPassword = generateValidPassword();
                          setUser((prevUser: any) => ({
                            ...prevUser,
                            Password: generatedPassword,
                          }));
                        }}
                        className="w-full bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </>
              )}

              {roleName === "Operator" &&
                ["DateOfOperation"].map((key) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors[key])}
                    size="small"
                    key={key}
                  >
                    <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                    <OutlinedInput
                      id={key}
                      name={key}
                      label={formatKey(key)}
                      placeholder={`Enter ${formatKey(key)}`}
                      value={
                        isLoading
                          ? ""
                          : key === "DateOfOperation" ||
                              key === "DateOfOperation"
                            ? (() => {
                                const dateValue =
                                  user?.[key as keyof typeof user];
                                return dateValue &&
                                  !isNaN(Date.parse(dateValue as string))
                                  ? new Date(dateValue as string)
                                      .toISOString()
                                      .split("T")[0]
                                  : "";
                              })()
                            : (operators?.[0]?.[
                                key as keyof (typeof operators)[0]
                              ] ??
                              user?.[key as keyof typeof user] ??
                              "")
                      }
                      onChange={handleManagerChange}
                      disabled={alwaysDisabledKeys.includes(key) || isDisabled}
                    />
                    {errors[key] && (
                      <FormHelperText>{errors[key]}</FormHelperText>
                    )}
                  </FormControl>
                ))}

              {roleName === "Operator" && (
                <div className="w-full">
                  <select
                    id="STLAreaOfOperations"
                    name="STLAreaOfOperations"
                    value={
                      formData?.STLAreaOfOperations ||
                      user?.STLAreaOfOperations ||
                      initialUserData?.STLAreaOfOperations ||
                      ""
                    }
                    onChange={(e) =>
                      handleManagerChange({
                        target: {
                          name: "STLAreaOfOperations",
                          value: e.target.value,
                        },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    className={`w-full border rounded px-3 py-2 text-sm ${
                      errors?.STLAreaOfOperations?.length ||
                      formData?.STLAreaOfOperations === ""
                        ? "border-red-500"
                        : "border-[#0038A8]"
                    }`}
                    aria-label="STLAreaOfOperations"
                    disabled={isDisabled}
                  >
                    <option value="" disabled style={{ color: "#9CA3AF" }}>
                      Select an area of operation
                    </option>
                    <option value="Active">Provincial Wide</option>
                    <option value="Inactive">City Wide</option>
                  </select>

                  {errors?.STLAreaOfOperations?.[0] && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.STLAreaOfOperations[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Active Status for Operator */}
              {roleName === "Operator" && (
                <div className="mb-4">
                  <label className="block mb-1 font-small">Status</label>
                  <Select
                    value={{ label: status, value: status }}
                    onChange={(option) => setStatus(option?.value || "")}
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "Inactive", value: "Inactive" },
                    ]}
                    isDisabled={isDisabled}
                    classNamePrefix="react-select"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 999999 }),
                      menu: (provided) => ({
                        ...provided,
                        maxHeight: 400,
                        overflowY: "auto",
                      }),
                    }}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </div>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ mt: "2.5rem !important" }}>
            <Stack spacing={3} sx={{ flex: 1 }}>
              {["CreatedBy", "CreatedAt"].map((key) => {
                const value = isLoading
                  ? ""
                  : key === "CreatedAt"
                    ? (() => {
                        const date =
                          operators?.[0]?.DateOfOperation ||
                          initialUserData?.DateOfOperation;
                        return date && !isNaN(new Date(date).getTime())
                          ? new Date(date).toISOString().split("T")[0]
                          : "";
                      })()
                    : (user?.[key as keyof typeof user] ??
                      initialUserData?.[key] ??
                      "");

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
                      disabled={
                        alwaysDisabledKeys.includes(key) ||
                        isDisabled ||
                        isLoading
                      }
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
              {["LastUpdatedBy", "LastUpdatedDate"].map((key) => (
                <FormControl
                  key={key}
                  fullWidth
                  error={!!errors[key]}
                  size="small"
                >
                  <InputLabel htmlFor={key}>{formatKey(key)}</InputLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    label={formatKey(key)}
                    placeholder={`Enter ${formatKey(key)}`}
                    value={
                      isLoading
                        ? ""
                        : key === "LastUpdatedDate"
                          ? (() => {
                              const dateValue =
                                user?.[key as keyof typeof user];
                              return dateValue &&
                                !isNaN(Date.parse(dateValue as string))
                                ? new Date(dateValue as string)
                                    .toISOString()
                                    .split("T")[0]
                                : "";
                            })()
                          : (operators?.[0]?.[
                              key as keyof (typeof operators)[0]
                            ] ??
                            user?.[key as keyof typeof user] ??
                            initialUserData?.[key] ??
                            "")
                    }
                    onChange={handleManagerChange}
                    disabled={
                      alwaysDisabledKeys.includes(key) ||
                      isDisabled ||
                      isLoading
                    }
                  />
                  {errors[key] && (
                    <FormHelperText>{errors[key]}</FormHelperText>
                  )}
                </FormControl>
              ))}
            </Stack>
          </Stack>

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
                fontSize: 13,
                cursor: "pointer",
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
                multiline
                minRows={1}
              />
              {errors.remarks && (
                <FormHelperText>{errors.remarks}</FormHelperText>
              )}
            </FormControl>
          )}

          {/* Show only when `showEditButton` is true */}
          {showEditButton && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                onClick={isDisabled ? handleDisable : handleSubmit}
                sx={{
                  ...buttonUpdateStyles,
                  mt: 1,
                  fontSize: "14px",
                  px: "1.7rem",
                }}
                variant="contained"
              >
                {isDisabled ? "Update" : "Save"}
              </Button>
            </Box>
          )}

          {/* Show form children only when in edit mode */}
          {!isDisabled && (
            <div className="mt-4">{children({ handleSubmit })}</div>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableUpdateModal;
