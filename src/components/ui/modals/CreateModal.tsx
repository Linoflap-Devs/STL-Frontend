import React, { useState } from 'react';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, IconButton, InputLabel, MenuItem, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReusableModalPageProps } from '~/types/interfaces';
import ConfirmUserActionModalPage from './ConfirmUserActionModal';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { operatorSchema } from '~/schemas/operatorSchema';
import { generateValidPassword, userSchema } from '~/schemas/userSchema';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
}) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState<{ [key: string]: string | number | boolean | string[] }>({});
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  // conditional visibility
  const isProvincial = formData.STLAreaOfOperations === 'ProvincialWide';
  const isCityWide = formData.STLAreaOfOperations === 'CityWide';
  const isExcludedCITY = formData.isExcludedCITY;

  // FOR TEXT FIELDS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | boolean } }
  ) => {
    const { name, value } = e.target;

    if ('type' in e.target && e.target.type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // FOR SELECT FIELDS
  const handleSelectChange = (e: { target: { name: string; value: string | number } }) => {
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
        .filter((province) => selectedValues.includes(Number(province.RegionId)))
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
    setIsVerifyModalOpen(false); // Close the verification modal
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Validate operator schema
      const operatorResult = operatorSchema.safeParse(formData);

      if (!operatorResult.success) {
        const fieldErrors = operatorResult.error.flatten().fieldErrors;
        console.error("Operator validation errors:", fieldErrors);
        setErrors(fieldErrors);
        return;
      }

      // Validate user schema
      const userResult = userSchema.safeParse(formData);

      if (!userResult.success) {
        const fieldErrors = userResult.error.flatten().fieldErrors;
        console.error("User validation errors:", fieldErrors);
        setErrors(fieldErrors);
        return;
      }

      // No errors, proceed with form submission
      setErrors({});
      console.log("Form data is valid:", formData);

      const confirmationResult = await Swal.fire({
        title: "Add Confirmation",
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
        return;
      }

      setIsVerifyModalOpen(true);
    } catch (error) {
      console.error("Error during validation or confirmation:", error);
      setErrors(prev => ({
        ...prev,
        general: ["An unexpected error occurred"],
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: {
            xs: "90%",
            sm: "80%",
            md: "600px",
            lg: "650px",
            xl: "680px",
          },
        }
      }}>
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pb: 0, }}>
        <IconButton sx={{ alignSelf: 'flex-end' }} onClick={onClose}>
          <CloseIcon sx={{
            fontSize: 28, fontWeight: 700, backgroundColor: '#ACA993',
            borderRadius: '50%', padding: '4px', color: '#FFFFFF'
          }} />
        </IconButton>
        <Typography sx={{ fontSize: 26, fontWeight: 'bold', mt: -4 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {
            fields.some((field) => field.name === 'name') &&
            fields.some((field) => field.name === 'contactNumber') && (
              <Stack direction="row" spacing={2}>
                <Stack spacing={2} flex={1}>
                  {fields
                    .filter((field) => field.name === 'name')
                    .map((field, index) => (
                      <div key={index} className="mb-4 w-full">
                        {field.type === 'select' ? (
                          <FormControl fullWidth variant="outlined" size="small" error={Boolean(errors[field.name]?.length)}>
                            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                            <TextField
                              id={field.name}
                              name={field.name}
                              select
                              value={formData[field.name] || '0'}
                              onChange={(e) => handleSelectChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)}
                              label={field.label}
                              variant="outlined"
                              fullWidth
                              error={!!errors[field.name]?.length || formData[field.name] === '0'}
                              helperText={errors[field.name]?.[0] || ''}
                              size="small"
                              SelectProps={{
                                native: true,
                              }}
                            >
                            </TextField>
                            {errors[field.name]?.[0] && (
                              <FormHelperText>{errors[field.name][0]}</FormHelperText>
                            )}
                          </FormControl>
                        ) : (
                          <TextField
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            label={field.label}
                            variant="outlined"
                            fullWidth
                            error={Boolean(errors[field.name]?.length)}
                            helperText={errors[field.name]?.[0] || ''}
                            size="small"
                          />
                        )}
                      </div>
                    ))}
                </Stack>

                {/* Column 2 */}
                <div className="flex flex-col space-y-4 flex-1">
                  {fields
                    .filter((field) => field.name === 'contactNumber')
                    .map((field, index) => (
                      <div key={index} className="w-full">
                        <TextField
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          label={field.label}
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors[field.name]?.length)}
                          helperText={errors[field.name]?.[0] || ''}
                          size="small"
                        />
                      </div>
                    ))}
                </div>
              </Stack>
            )
          }

          {/* Full address - 1 full input*/}
          {fields
            .filter((field) => field.name === 'address')
            .map((field, index) => (
              <div key={index} className="w-full">
                <TextField
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors[field.name]?.length)}
                  helperText={errors[field.name]?.[0] || ''}
                  size="small"
                />
              </div>
            ))}

            {/* start again without full name and contact number */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Column 1 */}
            <div className="flex-1 space-y-4">
              {fields.map((field, index) => {

                if (field.name === 'firstName') {
                  return (
                    <div key={index} className="w-full">
                      <TextField
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        error={!!errors[field.name]?.length}
                        helperText={errors[field.name]?.[0] || ''}
                        size="small"
                      />
                    </div>
                  );
                }

                if (field.name === 'email' && field.gridSpan === 1) { 
                  return (
                    <div key={index} className="w-full">
                      <TextField
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors[field.name]?.length)}
                        helperText={errors[field.name]?.[0] || ''}
                        size="small"
                      />
                    </div>
                  );
                }

                if (field.name === 'lastName' && field.gridSpan === 1) {
                  const suffixField = fields.find(f => f.name === 'suffix' && f.gridSpan === 1);
                  return (
                    <div key={index} className="w-full flex gap-4">
                      {/* Last Name */}
                      <div className="w-1/2">
                        <TextField
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={
                            Array.isArray(formData[field.name])
                              ? (formData[field.name] as string[]).join(', ')
                              : String(formData[field.name] || '')
                          }
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          label={field.label}
                          variant="outlined"
                          fullWidth
                          error={Boolean(errors[field.name]?.length)}
                          helperText={errors[field.name]?.[0] || ''}
                          size="small"
                        />
                      </div>
 
                      {/* Suffix */}
                      {suffixField && (
                        <div className="w-1/2">
                          <TextField
                            id={suffixField.name}
                            name={suffixField.name}
                            select
                            value={formData[suffixField.name] || '0'}
                            onChange={(e) =>
                              handleSelectChange(e as unknown as React.ChangeEvent<HTMLSelectElement>)
                            }
                            label={suffixField.label}
                            variant="outlined"
                            fullWidth
                            error={
                              !!errors[suffixField.name]?.length || formData[suffixField.name] === '0'
                            }
                            helperText={errors[suffixField.name]?.[0] || ''}
                            size="small"
                            SelectProps={{ native: true }}
                          >
                            <option value="0" disabled style={{ color: '#9CA3AF' }}>
                              {suffixField.label}
                            </option>
                            {suffixField.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        </div>
                      )}
                    </div>
                  );
                }

                if (field.name === 'phoneNumber' && field.gridSpan === 1) { 
                  return (
                    <div key={index} className="w-full">
                      <TextField
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors[field.name]?.length)}
                        helperText={errors[field.name]?.[0] || ''}
                        size="small"
                      />
                    </div>
                  );
                }

                if (field.name === 'gameTypes') {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        id={field.name}
                        name={field.name}
                        options={field.options}
                        isMulti
                        value={
                          field.options?.filter((option) =>
                            Array.isArray(formData[field.name]) &&
                            (formData[field.name] as string[]).includes(option.value)
                          ) || []
                        }
                        onChange={(selectedOptions) => handleMultiSelect(field.name, [...selectedOptions])}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={field.placeholder}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'regions' && (isProvincial || isCityWide)) {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        id={field.name}
                        name={field.name}
                        options={field.options}
                        isMulti
                        value={
                          field.options?.filter((option) =>
                            Array.isArray(formData[field.name]) &&
                            (formData[field.name] as string[]).includes(option.value)
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
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'cities' && isCityWide) {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        id={field.name}
                        name={field.name}
                        options={filteredCities}
                        isMulti
                        value={filteredCities.filter((option) =>
                          Array.isArray(formData[field.name]) &&
                          (formData[field.name] as (string | number)[]).includes(option.value)
                        )}
                        onChange={(selectedOptions) => handleMultiSelect(field.name, [...selectedOptions])}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select City(s)"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'STLExcludedCity' && isExcludedCITY && isProvincial) {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        id={field.name}
                        name={field.name}
                        options={field.options}
                        isMulti
                        value={
                          field.options?.filter((option) =>
                            Array.isArray(formData[field.name]) &&
                            (formData[field.name] as string[]).includes(option.value)
                          ) || []
                        }
                        onChange={(selectedOptions) => handleMultiSelect(field.name, [...selectedOptions])}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={field.placeholder}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Column 2 */}
            <div className="flex-1 space-y-4">
              {fields.map((field, index) => {

                if (field.name === "operatorId") {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        inputId={field.name}
                        name={field.name}
                        options={field.options}
                        value={
                          (field.options ?? []).find(
                            (option) => option.value === formData[field.name]
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          const event = {
                            target: {
                              name: field.name,
                              value: selectedOption?.value || "",
                            },
                          };
                          handleSelectChange(event);
                        }}
                        placeholder="Select an area of operation"
                        className="react-select-container"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
                          menu: (provided) => ({
                            ...provided,
                            maxHeight: 400, // Limits dropdown height
                            overflowY: "auto",
                          }),
                          control: (provided, state) => ({
                            ...provided,
                            borderColor:
                              errors[field.name]?.length ||
                              formData[field.name] === ""
                                ? "#EF4444"
                                : "#0038A8",
                            fontSize: "0.875rem",
                            padding: "2px",
                          }),
                        }}
                        classNames={{
                          control: () => "rounded text-sm",
                        }}
                        // Removed isClearable
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-[12px] text-[#CE1126] mt-1">
                          {errors[field.name][0]}
                        </p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'dateOfOperation') {
                  return (
                    <div key={index} className="w-full">
                      <TextField
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={Boolean(errors[field.name]?.length)}
                        helperText={errors[field.name]?.[0] || ''}
                        size="small"
                      />
                    </div>
                  );
                }

                if (field.name === 'email' && field.gridSpan === 2) {
                  return (
                    <div key={index} className="w-full">
                      <TextField
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                        variant="outlined"
                        fullWidth
                        error={Boolean(errors[field.name]?.length)}
                        helperText={errors[field.name]?.[0] || ''}
                        size="small"
                      />
                    </div>
                  );
                }

                if (field.name === 'password' && field.gridSpan === 2) {
                  return (
                    <div key={index} className="w-full flex gap-4 items-end">
                      {/* Password Input */}
                      <div className="w-3/5">
                        <TextField
                          id={field.name}
                          name={field.name}
                          type={showPassword ? 'text' : 'password'}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          label={field.label}
                          variant="outlined"
                          fullWidth
                          size="small"
                          InputProps={{
                            endAdornment: (
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
                            ),
                          }}
                          error={!!errors[field.name]?.length}
                          helperText={errors[field.name]?.[0] || ''}
                        />
                      </div>

                      {/* Generate Button */}
                      <div className="w-2/5">
                        <button
                          type="button"
                          onClick={() => {
                            const generatedPassword = generateValidPassword();
                            handleChange({ target: { name: 'password', value: generatedPassword } });
                          }}
                          className="w-full bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg"
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  );
                }

                if (field.name === 'STLAreaOfOperations') {
                  return (
                    <div key={index} className="w-full">
                      <select
                        id={field.name}
                        name={field.name}
                        value={String(formData[field.name] || '')}
                        onChange={handleSelectChange}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length || formData[field.name] === ''
                          ? 'border-red-500'
                          : 'border-[#0038A8]'
                          }`}
                        aria-label={field.label}
                      >
                        <option value="" disabled style={{ color: '#9CA3AF' }}>
                          Select an area of operation
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors[field.name][0]}
                        </p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'provinces' && (isProvincial || isCityWide)) {
                  return (
                    <div key={index} className="w-full">
                      <Select
                        id={field.name}
                        name={field.name}
                        options={filteredProvinces}
                        isMulti
                        value={filteredProvinces.filter((option) =>
                          Array.isArray(formData[field.name]) &&
                          (formData[field.name] as (string | number)[]).includes(option.value)
                        )}
                        onChange={(selectedOptions) => handleMultiSelect(field.name, [...selectedOptions])}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Select Province(s)"
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                if (field.name === 'isExcludedCITY' && isProvincial) {
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
                              color: '#0038A8',
                              '&.Mui-checked': {
                                color: '#0038A8',
                              },
                            }}
                          />
                        }
                        label={field.label}
                      />
                      {errors[field.name]?.[0] && (
                        <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                      )}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          <div className="mt-4">{children({ handleSubmit })}</div>
        </Stack>
        {isVerifyModalOpen && (
          <ConfirmUserActionModalPage
            formData={formData as { [key: string]: string | number | string[] }}
            setFormData={setFormData}
            errors={errors}
            actionType='create'
            setErrors={setErrors}
            open={isVerifyModalOpen}
            endpoint={endpoint ?? { create: '', update: '' }}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReusableCreateModalPage;



