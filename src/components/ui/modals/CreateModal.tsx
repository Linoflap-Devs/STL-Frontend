import React, { useState } from "react";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ReusableModalPageProps } from "~/types/interfaces";
import Swal from "sweetalert2";
import Select from "react-select";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { generateValidPassword } from "~/utils/passwordgenerate";
import Input from "../inputs/TextInputs";
import CustomSelect from "../inputs/SelectInputs";
import ConfirmUserActionModalPage from "~/components/shared/ConfirmUserActionModal";
import router from "next/router";
import ExitIconButton from "../icons/ExitButton";

const ReusableCreateModalPage: React.FC<ReusableModalPageProps> = ({
  isOpen,
  onClose,
  endpoint,
  fields,
  title,
  operatorMap,
  provinces,
  cities,
  children,
  schema,
}) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<{
    [key: string]: string | number | boolean | string[];
  }>({});
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // conditional visibility
  const isProvincial = formData.STLAreaOfOperations === "ProvincialWide";
  const isCityWide = formData.STLAreaOfOperations === "CityWide";
  const isExcludedCITY = formData.isExcludedCITY;

  const gridFieldNames = [
    "cities",
    "isExcludedCity",
  ];
  const hasGridFields = fields.some((field) => gridFieldNames.includes(field.name));

  // console.log('CITIESS',cities)
  // const filteredCity = (cities ?? []).map((city) => ({
  //   value: city.CityId,
  //   label: city.CityName.trim(), // optional trim
  // }));

  // FOR TEXT FIELDS
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | boolean } }
  ) => {
    const { name, value } = e.target;

    if ("type" in e.target && e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // FOR SELECT FIELDS
  const handleSelectChange = (e: {
    target: { name: string; value: string | number };
  }) => {
    const { name, value } = e.target;

    const valueAsNumber = isNaN(Number(value)) ? value : Number(value);

    if (name === "operatorId") {
      const selectedOperator = Object.values(operatorMap ?? {}).find(
        (operator) => operator.OperatorId === valueAsNumber
      );

      if (selectedOperator) {
        setFormData({
          ...formData,
          [name]: valueAsNumber,
          operatorName: selectedOperator.OperatorName,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: valueAsNumber, // Store other field values as string or number
      });
    }
  };

  // FOR MULTI SELECT FIELDS
  const handleMultiSelect = (name: string, selectedOptions: any[]) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log(`Selected Values for ${name}:`, selectedValues);

    if (name === "regions") {
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
      setFormData((prev) => ({
        ...prev,
        regions: selectedValues,
        provinces: [],
        cities: [],
      }));

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);
    } else if (name === "provinces") {
      // Filter cities based on selected province IDs
      const filteredCities = (cities ?? [])
        .filter((city) => selectedValues.includes(city.ProvinceId)) // Match with ProvinceId
        .map((city) => ({
          value: city.CityId,
          label: city.CityName.trim(), // Trim any extra spaces from CityName
        }));

      console.log("Filtered Cities:", filteredCities);
      // Reset city selection when province changes
      setFormData((prev) => ({
        ...prev,
        provinces: selectedValues,
        cities: [],
      }));

      setFilteredCities(filteredCities);
    } else if (name === "cities") {
      // Simply update selected city values
      console.log("Selected Cities:", selectedValues);

      setFormData((prev) => ({
        ...prev,
        cities: selectedValues,
      }));
    } else {
      // For other fields, just update as usual
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    }
  };

  const handleClose = () => {
    setIsVerifyModalOpen(false);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Use the passed schema prop
      if (!schema) {
        setErrors((prev) => ({
          ...prev,
          general: ["Validation schema is not defined."],
        }));
        return;
      }
      const result = schema.safeParse(formData);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        console.error("Validation errors:", fieldErrors);
        // Filter to only string keys and defined string[] values
        const filteredFieldErrors: Record<string, string[]> =
          Object.fromEntries(
            Object.entries(fieldErrors)
              .filter(
                ([key, value]) =>
                  typeof key === "string" &&
                  Array.isArray(value) &&
                  value !== undefined
              )
              .map(([key, value]) => [key, value ?? []])
          );
        setErrors(filteredFieldErrors);
        return;
      }

      // Proceed if validation passes
      setErrors({});
      console.log("Form data is valid:", formData);

      const confirmationResult = await Swal.fire({
        title: "Add Confirmation",
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
        return;
      }

      setIsVerifyModalOpen(true);
    } catch (error) {
      console.error("Error during validation or confirmation:", error);
      setErrors((prev) => ({
        ...prev,
        general: ["An unexpected error occurred"],
      }));
    }
  };

  if (!isOpen) return null;

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
          flexDirection: "column",
          pb: 0,
        }}
      >
        <div className="flex justify-end p-0 m-0">
          <ExitIconButton
            bgColor="#0038A8"
            hoverColor="#004ccf"
            iconColor="#fff"
            size={26}
            onClick={onClose}
            to={undefined} // prevents router.push('/')
            paddingLeft="0px"
          />
        </div>
        <div className="flex justify-between items-center mb-3 -mt-3">
          <Typography sx={{ fontSize: 26, fontWeight: "bold" }}>
            {title}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {fields.some((field) => field.name === "name") &&
            fields.some((field) => field.name === "contactNumber") && (
              <Stack direction="row" spacing={2}>
                <Stack spacing={2} flex={1}>
                  {fields
                    .filter((field: any) => field.name === "name")
                    .map((field: any, index: number) => (
                      <div key={index} className="w-full">
                        <Input
                          id={field.name}
                          name={field.name}
                          error={!!errors[field.name]?.[0]}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(", ")
                              : String(formData[field.name] || "")
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        {/* Error message area with fixed height */}
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p className="absolute text-[11px] text-red-600 top-0 left-0">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </Stack>

                {/* Column 2 */}
                <div className="flex flex-col space-y-4 flex-1">
                  {fields
                    .filter((field: any) => field.name === "contactNumber")
                    .map((field: any, index: number) => (
                      <div key={index} className="w-full">
                        <Input
                          id={field.name}
                          name={field.name}
                          error={!!errors.contactNumber?.[0]}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(", ")
                              : String(formData[field.name] || "")
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p
                              className="absolute text-[11px] text-red-600 top-0 left-0"
                              style={{ pointerEvents: "none" }}
                            >
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </Stack>
            )}

          {/* Full address - 1 full input*/}
          {fields
            .filter((field) => field.name === "address")
            .map((field, index) => (
              <div key={index} className="w-full !mt-3">
                <Input
                  id={field.name}
                  name={field.name}
                  error={!!errors.address?.[0]}
                  value={
                    Array.isArray(formData[field.name])
                      ? (formData[field.name] as string[]).join(", ")
                      : String(formData[field.name] || "")
                  }
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
                <div className="h-3 relative">
                  {errors[field.name]?.[0] && (
                    <p
                      className="text-[11px] text-red-600 absolute left-0 top-0"
                      style={{ pointerEvents: "none" }}
                    >
                      {errors[field.name][0]}
                    </p>
                  )}
                </div>
              </div>
            ))}

          {/* start again without full name and contact number */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Column 1 */}
            <div className="flex-1 space-y-4">
              {fields.map((field, index) => {
                if (field.name === "firstName") {
                  return (
                    <div key={index} className="w-full">
                      <Input
                        id={field.name}
                        name={field.name}
                        error={!!errors.firstName?.[0]}
                        value={
                          Array.isArray(formData[field.name])
                            ? (formData[field.name] as string[]).join(", ")
                            : String(formData[field.name] || "")
                        }
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                      <div className="h-3 relative">
                        {errors[field.name]?.[0] && (
                          <p
                            className="text-[11px] text-red-600 absolute left-0 top-0"
                            style={{ pointerEvents: "none" }}
                          >
                            {errors[field.name][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                if (field.name === "lastName" && field.gridSpan === 1) {
                  const suffixField = fields.find(
                    (f) => f.name === "suffix" && f.gridSpan === 1
                  );

                  return (
                    <div
                      key={`${field.name}-${index}`}
                      className="w-full flex gap-4"
                    >
                      {/* Last Name */}
                      <div className="w-full">
                        <Input
                          id={field.name}
                          name={field.name}
                          error={!!errors.lastName?.[0]}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(", ")
                              : String(formData[field.name] || "")
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        <div className="h-3 relative">
                          {errors[field.name]?.[0] && (
                            <p
                              className="text-[11px] text-red-600 absolute left-0 top-0"
                              style={{ pointerEvents: "none" }}
                            >
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Suffix */}
                      {suffixField && (
                        <div className="w-full">
                          <CustomSelect
                            name={suffixField.name}
                            value={
                              (suffixField.options ?? []).find(
                                (option) =>
                                  option.value === formData[suffixField.name]
                              ) || null
                            }
                            options={suffixField.options ?? []}
                            onChange={handleSelectChange}
                            placeholder="Suffix"
                            error={!!errors[suffixField.name]?.length}
                          />
                          <div className="h-3 relative">
                            {errors[suffixField.name]?.[0] && (
                              <p
                                className="text-[11px] text-red-600 absolute left-0 top-0"
                                style={{ pointerEvents: "none" }}
                              >
                                {errors[suffixField.name][0]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (field.name === "phoneNumber" && field.gridSpan === 1) {
                  return (
                    <div key={index} className="w-full">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        error={!!errors.phoneNumber?.[0]}
                        value={
                          Array.isArray(formData[field.name])
                            ? (formData[field.name] as string[]).join(", ")
                            : String(formData[field.name] || "")
                        }
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                      <div className="h-3 relative">
                        {errors[field.name]?.[0] && (
                          <p
                            className="text-[11px] text-red-600 absolute left-0 top-0"
                            style={{ pointerEvents: "none" }}
                          >
                            {errors[field.name][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Column 2 */}
            <div className="flex-1 space-y-4 mb-0">
              {fields.map((field, index) => {
                if (field.name === "operatorId") {
                  return (
                    <div key={index} className="w-full">
                      <CustomSelect
                        name={field.name}
                        value={
                          (field.options ?? []).find(
                            (option) => option.value === formData[field.name]
                          ) || null
                        }
                        options={field.options ?? []}
                        onChange={handleSelectChange}
                        placeholder="Select Assigned Company"
                        error={!!errors.operatorId?.length}
                      />
                      <div className="relative h-3">
                        {errors[field.name]?.[0] && (
                          <p className="absolute text-[11px] text-[#CE1126] top-0 left-0">
                            {errors[field.name][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                if (field.name === "email" && field.gridSpan === 2) {
                  return (
                    <div key={index} className="w-full">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        error={!!errors.email?.[0]}
                        value={
                          Array.isArray(formData[field.name])
                            ? (formData[field.name] as string[]).join(", ")
                            : String(formData[field.name] || "")
                        }
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                      <div className="h-3 relative">
                        {errors[field.name]?.[0] && (
                          <p
                            className="text-[11px] text-red-600 absolute left-0 top-0"
                            style={{ pointerEvents: "none" }}
                          >
                            {errors[field.name][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                if (field.name === "password" && field.gridSpan === 2) {
                  return (
                    <div key={field.name} className="w-full">
                      <div className="flex flex-row items-end gap-2">
                        {/* Password Input with Eye Icon */}
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              error={!!errors.password?.[0]}
                              value={
                                Array.isArray(formData[field.name])
                                  ? (formData[field.name] as string[]).join(
                                      ", "
                                    )
                                  : String(formData[field.name] || "")
                              }
                              onChange={handleChange}
                              placeholder={field.placeholder}
                            />
                            {/* Eye Icon inside input */}
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="!absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </div>
                        </div>

                        {/* Generate Button */}
                        <div className="w-[110px] mb-0 flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              const generatedPassword = generateValidPassword();
                              handleChange({
                                target: {
                                  name: "password",
                                  value: generatedPassword,
                                },
                              });
                            }}
                            className="w-full bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg"
                          >
                            Generate
                          </button>
                        </div>
                      </div>

                      {/* Error message below whole row, full width */}
                      <div className="h-3 relative">
                        {errors[field.name]?.[0] && (
                          <p
                            className="text-[11px] text-red-600 absolute left-0 top-0"
                            style={{ pointerEvents: "none" }}
                          >
                            {errors[field.name][0]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {hasGridFields && (
            <>
              {/* Start again for operators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => {
                  if (field.name === "email" && field.gridSpan === 1) {
                    return (
                      <div key={index} className="w-full">
                        <Input
                          id={field.name}
                          name={field.name}
                          error={!!errors.email?.[0]}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(", ")
                              : String(formData[field.name] || "")
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        <div className="h-3 relative">
                          {errors[field.name]?.[0] && (
                            <p
                              className="text-[11px] text-red-600 absolute left-0 top-0"
                              style={{ pointerEvents: "none" }}
                            >
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (field.name === "dateOfOperation") {
                    return (
                      <div key={index} className="w-full ">
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          error={!!errors.dateOfOperation?.[0]}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(", ")
                              : String(formData[field.name] || "")
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                        />
                        <div className="h-3 relative">
                          {errors[field.name]?.[0] && (
                            <p
                              className="text-[11px] text-red-600 absolute left-0 top-0"
                              style={{ pointerEvents: "none" }}
                            >
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (field.name === "gameTypes") {
                    return (
                      <div key={index} className="w-full">
                        <Select
                          id={field.name}
                          name={field.name}
                          options={field.options}
                          isMulti
                          value={
                            field.options?.filter(
                              (option) =>
                                Array.isArray(formData[field.name]) &&
                                (formData[field.name] as string[]).includes(
                                  option.value
                                )
                            ) || []
                          }
                          onChange={(selectedOptions) =>
                            handleMultiSelect(field.name, [...selectedOptions])
                          }
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder={field.placeholder}
                          menuPortalTarget={
                            typeof window !== "undefined" ? document.body : null
                          }
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p className="absolute text-[12px] text-[#CE1126] top-0 left-0">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (field.name === "STLAreaOfOperations") {
                    return (
                      <div key={index} className="w-full">
                        <CustomSelect
                          name={field.name}
                          value={
                            (field.options ?? []).find(
                              (option) => option.value === formData[field.name]
                            ) || null
                          }
                          options={field.options ?? []}
                          onChange={handleSelectChange}
                          placeholder="Select Area of Operations"
                          error={!!errors[field.name]?.[0]}
                        />
                        {/* Reserve space for the error message */}
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p className="absolute text-[12px] text-[#CE1126] top-0 left-0">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (
                    field.name === "regions" &&
                    (isProvincial || isCityWide)
                  ) {
                    return (
                      <div key={index} className="w-full">
                        <Select
                          id={field.name}
                          name={field.name}
                          options={field.options}
                          isMulti
                          value={
                            field.options?.filter(
                              (option) =>
                                Array.isArray(formData[field.name]) &&
                                (formData[field.name] as string[]).includes(
                                  option.value
                                )
                            ) || []
                          }
                          onChange={(selectedOptions) =>
                            handleMultiSelect(field.name, [...selectedOptions])
                          }
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Region(s)"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p className="absolute text-[11px] text-[#CE1126] top-0 left-0">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (
                    field.name === "provinces" &&
                    (isProvincial || isCityWide)
                  ) {
                    const isDisabled =
                      !formData.regions ||
                      (Array.isArray(formData.regions) &&
                        formData.regions.length === 0);
                    return (
                      <div key={index} className="w-full">
                        <Select
                          inputId={field.name}
                          name={field.name}
                          options={filteredProvinces}
                          isMulti
                          value={filteredProvinces.filter(
                            (option) =>
                              Array.isArray(formData[field.name]) &&
                              (
                                formData[field.name] as (string | number)[]
                              ).includes(option.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleMultiSelect(field.name, [...selectedOptions])
                          }
                          placeholder={field.placeholder}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          menuPortalTarget={
                            typeof window !== "undefined" ? document.body : null
                          }
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 1000000,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              maxHeight: 400,
                              overflowY: "auto",
                            }),
                            control: (provided, state) => ({
                              ...provided,
                              borderColor: errors[field.name]?.length
                                ? "#CE1126"
                                : "#0038A8",
                              fontSize: "0.875rem",
                              padding: "2px",
                              "&:hover": {
                                borderColor: errors[field.name]?.length
                                  ? "#EF4444"
                                  : "#0038A8",
                              },
                            }),
                          }}
                          classNames={{
                            control: () => "rounded text-sm",
                          }}
                        />
                        {isDisabled && (
                          <p className="text-xs text-gray-500 mt-1">
                            Please select regions first.
                          </p>
                        )}
                        {/* Reserve space for the error message */}
                        <div className="relative h-3">
                          {errors[field.name]?.[0] && (
                            <p className="absolute text-[12px] text-[#CE1126] top-0 left-0">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Row 1 */}
                <div>
                  {fields
                    .filter((field) => field.name === "cities" && isCityWide)
                    .map((field, index) => {
                      const isDisabled =
                        !formData.provinces ||
                        (Array.isArray(formData.provinces) &&
                          formData.provinces.length === 0);

                      return (
                        <div key={index} className="w-full mb-0">
                          <Select
                            id={field.name}
                            name={field.name}
                            options={filteredCities}
                            isMulti
                            value={filteredCities.filter(
                              (option) =>
                                Array.isArray(formData[field.name]) &&
                                (
                                  formData[field.name] as (string | number)[]
                                ).includes(option.value)
                            )}
                            onChange={(selectedOptions) =>
                              handleMultiSelect(field.name, [
                                ...selectedOptions,
                              ])
                            }
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select City(s)"
                            menuPortalTarget={document.body}
                            isDisabled={isDisabled}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                          {isDisabled && (
                            <p className="text-xs text-gray-500 mt-1">
                              Please select provinces first.
                            </p>
                          )}
                          <div className="relative h-3">
                            {errors[field.name]?.[0] && (
                              <p className="absolute text-[11px] text-[#CE1126] top-0 left-0">
                                {errors[field.name][0]}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {fields
                    .filter(
                      (field) =>
                        field.name === "cities" &&
                        isExcludedCITY &&
                        isProvincial
                    )
                    .map((field, index) => {
                      const isDisabled =
                        !formData.provinces ||
                        (Array.isArray(formData.provinces) &&
                          formData.provinces.length === 0);

                      return (
                        <div key={index} className="w-full mb-0">
                          <Select
                            id={field.name}
                            name={field.name}
                            options={filteredCities}
                            isMulti
                            value={filteredCities.filter(
                              (option) =>
                                Array.isArray(formData[field.name]) &&
                                (
                                  formData[field.name] as (string | number)[]
                                ).includes(option.value)
                            )}
                            onChange={(selectedOptions) =>
                              handleMultiSelect(field.name, [
                                ...selectedOptions,
                              ])
                            }
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="Select City(s)"
                            menuPortalTarget={document.body}
                            isDisabled={isDisabled}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                          {isDisabled && (
                            <p className="text-xs text-gray-500 mt-1">
                              Please select provinces first.
                            </p>
                          )}
                          <div className="relative h-3">
                            {errors[field.name]?.[0] && (
                              <p className="absolute text-[11px] text-[#CE1126] top-0 left-0">
                                {errors[field.name][0]}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="w-full ml-4">
                  {fields
                    .filter(
                      (field) => field.name === "isExcludedCITY" && isProvincial
                    )
                    .map((field, index) => {
                      const isDisabled =
                        !formData.provinces ||
                        (Array.isArray(formData.provinces) &&
                          formData.provinces.length === 0);

                      return (
                        <div key={index} className="w-full">
                          <FormControlLabel
                            control={
                              <Checkbox
                                id={field.name}
                                name={field.name}
                                checked={Boolean(formData[field.name])}
                                onChange={(e) =>
                                  handleChange({
                                    target: {
                                      name: field.name,
                                      value: e.target.checked,
                                    },
                                  })
                                }
                                sx={{
                                  color: "#0038A8",
                                  "&.Mui-checked": {
                                    color: "#0038A8",
                                  },
                                }}
                              />
                            }
                            label={field.label}
                          />
                          {errors[field.name]?.[0] && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}

          <div>{children({ handleSubmit })}</div>
        </Stack>
        {isVerifyModalOpen && (
          <ConfirmUserActionModalPage
            formData={formData as { [key: string]: string | number | string[] }}
            setFormData={setFormData}
            errors={errors}
            actionType="create"
            setErrors={setErrors}
            open={isVerifyModalOpen}
            endpoint={endpoint ?? { create: "", update: "" }}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReusableCreateModalPage;