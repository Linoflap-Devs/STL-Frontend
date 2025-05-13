import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReusableModalPageProps } from '~/types/interfaces';
import { generateValidPassword, userSchema } from '~/schemas/userSchema';
import { useFormStore } from '../../../store/useFormStore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import ConfirmUserActionModalPage from '../ui/modals/ConfirmUserActionModal';

const UserCreateModalPage: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  children,
  endpoint,
  operatorMap,
}) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { formData, setFormData, } = useFormStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        [name]: valueAsNumber,
      });
    }
  };

  const handleClose = () => {
    setIsVerifyModalOpen(false); // Close the verification modal
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // zod validation
      const result = userSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        console.error("Validation errors:", fieldErrors);
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      
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
        return;;
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
            xl: "730px",
          },
          pt: 1,
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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Column 1 */}
            <div className="flex-1 space-y-4">
              {/* Render firstName field separately */}
              {fields
                .filter((field) => field.name === 'firstName')
                .map((field, index) => (
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
                    {/* Display error message if exists */}
                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-[#CE1126] mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}

              {/* lastName and suffix side-by-side */}
              {fields.some((field) => field.name === 'lastName' || field.name === 'suffix') && (
                <div className="flex space-x-4">
                  {fields
                    .filter((field) => field.name === 'lastName' || field.name === 'suffix')
                    .map((field, index) => (
                      <div
                        key={index}
                        className={field.name === 'lastName' ? 'flex-[4]' : 'flex-[2]'}
                      >
                        {field.type === 'select' ? (
                          <TextField
                            id={field.name}
                            name={field.name}
                            select
                            value={formData[field.name] || '0'} // Ensure it's a string for consistency
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
                            <option value="0" disabled style={{ color: '#9CA3AF' }}>
                              {field.label}
                            </option>
                            {field.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        ) : (
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
                        )}
                        {errors[field.name]?.[0] && (
                          <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Other fields that are not explicitly displayed */}
              {fields
                .filter(
                  (field) =>
                    field.gridSpan !== 2 &&
                    !['firstName', 'lastName', 'suffix', 'name', 'address', 'contactNumber'].includes(field.name)
                )
                .map((field, index) => (
                  <div key={index} className="w-full">
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || 0} // Default to 0 if undefined
                        onChange={handleSelectChange}
                        className={`w-full border rounded px-3 py-2 text-sm ${errors[field.name]?.length ? 'border-red-500' : 'border-[#0038A8]'
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
                    )}
                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}
            </div>

            {/* Column 2 */}
            <div className="flex-1 space-y-4">
              {/* Fields that span 2 columns */}
              {fields
                .filter(
                  (field) =>
                    field.gridSpan === 2 &&
                    !['name', 'address', 'contactNumber', 'password'].includes(field.name)
                )
                .map((field, index) => (
                  <div key={index} className="w-full">
                    {field.type === 'select' ? (
                      // If the select value is expected to be a number
                      <TextField
                        id={field.name}
                        name={field.name}
                        select
                        value={formData[field.name] || '0'} // Ensure it's a string for consistency
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
                        <option value="0" disabled style={{ color: '#9CA3AF' }}>
                          {field.label}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>

                    ) : (
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
                    )}
                    {errors[field.name]?.[0] && (
                      <p className="text-xs text-red-600 mt-1">{errors[field.name][0]}</p>
                    )}
                  </div>
                ))}

              {/* Password with Generate Password button */}
              {fields.some((field) => field.name === 'password') && (
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    {fields
                      .filter((field) => field.name === 'password')
                      .map((field, index) => (
                        <div key={index} className="w-full relative">
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
                                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              ),
                            }}
                            error={!!errors[field.name]?.length}
                            helperText={errors[field.name]?.[0] || ''}
                          />
                        </div>
                      ))}
                  </div>

                  {/* Generate Password Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const generatedPassword = generateValidPassword();
                      handleChange({ target: { name: 'password', value: generatedPassword } });
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
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            actionType='create'
            setErrors={setErrors}
            open={isVerifyModalOpen}
            endpoint={endpoint ?? { create: '', update: '' }}
            onClose={handleClose} // for the verification modal
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateModalPage;