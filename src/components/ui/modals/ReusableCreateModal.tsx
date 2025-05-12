// reusable create form
import React, { useEffect, useState } from 'react';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReusableModalPageProps } from '~/types/interfaces';
import { generateValidPassword, userSchema } from '~/utils/validation';
import ConfirmUserActionModalPage from './ConfirmUserActionModal';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import Select from 'react-select';

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
  const [errors, setErrors] = useState<Record<string, string[]>>({}); const [formData, setFormData] = useState<{ [key: string]: string | number | boolean | string[] }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState(""); // ProvincialWide or CityWide

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

  const handleMultiSelect = (name: string, selectedOptions: any[]) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    console.log(`Selected Values for ${name}:`, selectedValues);

    if (name === "STLRegion") {
      // Filter provinces based on selected region IDs
      const filteredProvinces = provinces
        .filter((province) => selectedValues.includes(Number(province.RegionId)))
        .map((province) => ({
          value: province.ProvinceId,
          label: province.ProvinceName,
        }));

      console.log("Filtered Provinces:", filteredProvinces);

      // Reset province and city selections when region changes
      setFormData((prev) => ({
        ...prev,
        STLRegion: selectedValues,
        STLProvince: [],
        STLCity: [],
      }));

      setFilteredProvinces(filteredProvinces);
      setFilteredCities([]);

    } else if (name === "STLProvince") {
      // Filter cities based on selected province IDs
      const filteredCities = cities
        .filter((city) => selectedValues.includes(city.ProvinceId)) // Match with ProvinceId
        .map((city) => ({
          value: city.CityId,
          label: city.CityName.trim(), // Trim any extra spaces from CityName
        }));

      console.log("Filtered Cities:", filteredCities);

      // Reset city selection when province changes
      setFormData((prev) => ({
        ...prev,
        STLProvince: selectedValues,
        STLCity: [],
      }));

      setFilteredCities(filteredCities);

    } else if (name === "STLCity") {
      // Simply update selected city values
      console.log("Selected Cities:", selectedValues);

      setFormData((prev) => ({
        ...prev,
        STLCity: selectedValues,
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
    onClose(); // Close the outer modal as well
  };

  const handleAreaOfOperationsChange = (selectedOption: { value: React.SetStateAction<string>; }) => {
    setSelectedArea(selectedOption.value);
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Validate the form data using Zod
      const result = userSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        console.error("Validation errors:", fieldErrors);
        setErrors(fieldErrors);
        return;
      }

      setErrors({}); // Clear errors if validation passed

      // Step 2: Show a confirmation Swal asking if the user has entered the correct details
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
        return; // If the user cancels, do nothing
      }

      // Step 3: If user confirms, open the ConfirmUserActionModalPage (this could be done by setting a state in parent)
      // We pass necessary props like user and action type to the modal for final submission
      setIsVerifyModalOpen(true); // Open the modal to allow final submit

      // Step 4: In the modal, once the user submits, handle the actual submission logic
      // You would handle the final submit in `ConfirmUserActionModalPage`

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
            xl: "690px",
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
          {/* 1 row with 2 columns for operators since need*/}
          {
            fields.some((field) => field.name === 'name') &&
            fields.some((field) => field.name === 'contactNumber') && (
              <Stack direction="row" spacing={2}>
                {/* Column 1 */}
                <Stack spacing={2} flex={1}>
                  {fields
                    .filter((field) => field.name === 'name')
                    .map((field, index) => (
                      <div key={index} className="mb-4 w-full">
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleSelectChange}
                            className={`w-full border rounded px-3 py-2 text-xs ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                              }`}
                            aria-label={field.label} // for accessibility
                          >
                            <option value={0}>{field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option.value} value={Number(option.value)}> {/* Ensure option.value is a number */}
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                              }`}
                            aria-label={field.label} // for accessibility
                          />
                        )}

                        {errors[field.name]?.[0] && (
                          <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
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
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                            }`}
                          aria-label={field.label} // for accessibility
                        />
                        {errors[field.name]?.[0] && (
                          <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                        )}
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
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                    }`}
                  aria-label={field.label} // for accessibility
                />
                {errors[field.name]?.[0] && (
                  <p className="text-sm text-red-600 mt-1">{errors[field.name][0]}</p>
                )}
              </div>
            ))}

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* start Column 1 again */}
            <div className="flex-1 space-y-4">
              {/* firstName field */}
              {fields
                .filter((field) => field.name === 'firstName')
                .map((field, index) => (
                  <div key={index} className="w-full">
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-[#CE1126]' : 'border-[#0038A8]'
                        }`}
                      aria-label={field.label}
                    />
                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-[#CE1126] mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}

              {/* lastName and suffix since they have to be magkatabi */}
              {fields.some((field) => field.name === 'lastName' || field.name === 'suffix') && (
                <div className="flex space-x-4">
                  {fields
                    .filter((field) => field.name === 'lastName' || field.name === 'suffix')
                    .map((field, index) => (
                      <div key={index} className={field.name === 'lastName' ? 'flex-[4]' : 'flex-[2]'}>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleSelectChange}
                            className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                              }`}
                            aria-label={field.label}
                          >
                            <option value={0}>{field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option.value} value={Number(option.value)}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                              }`}
                            aria-label={field.label}
                          />
                        )}
                        {errors[field.name]?.[0] && (
                          <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* all other fields EXCLUDED others already explicitly displayed */}
              {fields
                .filter(
                  (field) =>
                    field.gridSpan !== 2 &&
                    !['firstName', 'lastName', 'suffix', 'name', 'address', 'contactNumber',].includes(field.name)
                )
                .map((field, index) => (
                  <div key={index} className="w-full">

                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleSelectChange}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                          }`}
                        aria-label={field.label}
                      >
                        <option value={0}>{field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={Number(option.value)}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                    ) : field.name == 'GamesProvided' ? (
                      <div className="w-full">
                        {/* // column 1 multi select */}
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
                          placeholder={field.placeholder}
                          menuPortalTarget={document.body}  // Renders menu outside the modal
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      </div>

                    ) : field.name === 'STLRegion' ? (
                      <div className="w-full">
                        {/* Region select */}
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
                      </div>
                    ) : field.name === 'STLCity' ? (
                      <div className="w-full">
                        {/* Province select */}
                        <Select
                          id={field.name}
                          name={field.name}
                          options={filteredCities}
                          isMulti
                          value={filteredCities.filter((option) =>
                            Array.isArray(formData[field.name]) &&
                            (formData[field.name] as (string | number)[]).includes(option.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleMultiSelect(field.name, [...selectedOptions])
                          }
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select City(s)"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
                          }`}
                        aria-label={field.label}
                      />
                    )}
                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}
            </div>

            {/* Column 2 for all */}
            <div className="flex-1 space-y-4">
              {fields
                .filter(
                  (field) =>
                    field.gridSpan === 2 &&
                    !['name', 'address', 'contactNumber', 'password'].includes(field.name)
                )
                .map((field, index) => (
                  <div key={index} className="w-full">
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleSelectChange}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length || formData[field.name] === '0'
                          ? 'border-red-500'
                          : 'border-[#0038A8]'
                          }`}
                        aria-label={field.label}
                      >
                        <option value="0" disabled style={{ color: '#9CA3AF' }}>
                          {field.label}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.name === 'STLProvince' ? (
                      <div className="w-full">
                        {/* Province select */}
                        <Select
                          id={field.name}
                          name={field.name}
                          options={filteredProvinces}  // Use the filtered provinces based on selected regions
                          isMulti
                          value={
                            filteredProvinces.filter((option) =>
                              Array.isArray(formData[field.name]) &&
                              (formData[field.name] as (string | number)[]).includes(option.value)
                            )
                          }
                          onChange={(selectedOptions) =>
                            handleMultiSelect(field.name, [...selectedOptions])
                          }
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Province(s)"
                          menuPortalTarget={document.body}  // Renders menu outside the modal
                          styles={{
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999, // Ensure the dropdown is above the modal
                            }),
                          }}
                        />
                      </div>

                    ) : field.type === 'checkbox' ? (
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
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length
                          ? 'border-red-500'
                          : 'border-[#0038A8]'
                          }`}
                        aria-label={field.label}
                      />
                    )}

                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}

              {/* Password Section */}
              {fields.some((field) => field.name === 'password') && (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    {fields
                      .filter((field) => field.name === 'password')
                      .map((field, index) => (
                        <div key={index} className="w-full relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? 'text' : 'password'}
                            value={Array.isArray(formData[field.name]) ? (formData[field.name] as string[]).join(', ') : String(formData[field.name] || '')}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className={`w-full border rounded px-3 py-2 text-sm pr-10 ${errors[field.name]?.length
                              ? 'border-red-500'
                              : 'border-[#0038A8]'
                              }`}
                            aria-label={field.label}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </button>
                          {errors[field.name]?.[0] && (
                            <p className="text-xs text-red-600 mt-1 absolute left-0 w-full">
                              {errors[field.name][0]}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const generatedPassword = generateValidPassword();
                      handleChange({
                        target: { name: 'password', value: generatedPassword },
                      });
                    }}
                    className="bg-[#F6BA12] hover:bg-[#D1940F] text-[#181A1B] text-sm px-4 py-2 rounded-lg"
                  >
                    Generate
                  </button>
                </div>
              )}
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



