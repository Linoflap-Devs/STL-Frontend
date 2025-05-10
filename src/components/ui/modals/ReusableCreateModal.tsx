import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AxiosError } from 'axios';
import { ReusableModalPageProps } from '~/types/interfaces';
import axiosInstance from '~/utils/axiosInstance';
import { userSchema } from '~/utils/validation';
import { useOperatorsData } from '../../../../store/useOperatorStore';
import { useFormStore } from '../../../../store/useFormStore';
import useUserRoleStore from '../../../../store/useUserStore';

const ReusableCreateModalPage: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  children,
  endpoint,
}) => {

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const {
    formData,
    setFormData,
    error,
  } = useFormStore();
  const { operatorMap, setOperatorMap } = useOperatorsData();
  const { roleId } = useUserRoleStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name === "operatorId") {
      const selectedOperator = Object.values(operatorMap).find(
        (operator) => operator.OperatorId === parseInt(value, 10)
      );
      if (selectedOperator) {
        setFormData({
          ...formData,
          [name]: value,
          operatorName: selectedOperator.OperatorName,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!endpoint || (typeof endpoint === 'object' && !endpoint.create)) {
        throw new Error("Invalid endpoint: 'create' endpoint is required.");
      }

      const endpointUrl = typeof endpoint === 'string' ? endpoint : endpoint.create;

      // Validate formData using Zod
      const result = userSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        console.error("Validation errors:", fieldErrors);

        // Set errors to show in UI
        setErrors(fieldErrors);

        return;
      }

      // Clear previous errors if validation passes
      setErrors({});

      const payload = {
        ...formData,
        ...(roleId && { userTypeId: roleId }),
      };

      const response = await axiosInstance.post(endpointUrl, payload, {
        withCredentials: true,
      });

      console.log("User created:", response.data);
      // Handle success (e.g., close modal, show success message)

    } catch (error) {
      const err = error as AxiosError;

      console.error("Error creating user:", err.message);

      if (err.response) {
        console.error("Response error:", err.response.data);
      }

      // Optionally set a general error
      setErrors(prev => ({
        ...prev,
        general: [err.message || "An unexpected error occurred"],
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
            xl: "750px",
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
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* 1 row with 2 columns for operators */}
          {
            fields.some((field) => field.name === 'name') &&
            fields.some((field) => field.name === 'contactNumber') && (
              <Stack direction="row" spacing={2}>
                {/* Column 1 */}
                <Stack spacing={2} flex={1}>
                  {fields
                    .filter((field) => field.name === 'name')
                    .map((field, index) => (
                      <FormControl
                        fullWidth
                        key={index}
                        error={Boolean(errors[field.name]?.length)}
                      >
                        <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                        {field.type === 'select' ? (
                          <Select
                            labelId={`${field.name}-label`}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleSelectChange}
                            label={field.label}
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <OutlinedInput
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            label={field.label}
                          />
                        )}
                        {errors[field.name]?.[0] && (
                          <FormHelperText>{errors[field.name][0]}</FormHelperText>
                        )}
                      </FormControl>
                    ))}
                </Stack>

                {/* Column 2 */}
                <Stack spacing={2} flex={1}>
                  {fields
                    .filter((field) => field.name === 'contactNumber')
                    .map((field, index) => (
                      <FormControl
                        fullWidth
                        key={index}
                        error={Boolean(errors[field.name]?.length)}
                      >
                        <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                        <OutlinedInput
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          label={field.label}
                        />
                        {errors[field.name]?.[0] && (
                          <FormHelperText>{errors[field.name][0]}</FormHelperText>
                        )}
                      </FormControl>
                    ))}
                </Stack>
              </Stack>
            )
          }

          {/* Full address */}
          {fields
            .filter((field) => field.name === 'address')
            .map((field, index) => (
              <FormControl
                fullWidth
                key={index}
                error={Boolean(errors[field.name]?.length)}
              >
                <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                <OutlinedInput
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  label={field.label}
                />
                {errors[field.name]?.[0] && (
                  <FormHelperText>{errors[field.name][0]}</FormHelperText>
                )}
              </FormControl>
            ))}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Column 1 */}
            <Stack spacing={2} flex={1} >
              {/* Render firstName field separately */}
              {fields
                .filter((field) => field.name === 'firstName')
                .map((field, index) => (
                  <FormControl
                    fullWidth
                    key={index}
                    error={Boolean(errors[field.name]?.length)}
                  >
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    {field.type === 'select' ? (
                      <Select
                        labelId={`${field.name}-label`}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleSelectChange}
                        label={field.label}
                      >
                        {field.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <OutlinedInput
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                      />
                    )}
                    {errors[field.name]?.[0] && (
                      <FormHelperText>{errors[field.name][0]}</FormHelperText>
                    )}
                  </FormControl>
                ))}

              {/* lastName and suffix side-by-side */}
              {fields.some((field) => field.name === 'lastName' || field.name === 'suffix') && (
                <Stack direction="row" spacing={2}>
                  {fields
                    .filter(
                      (field) => field.name === 'lastName' || field.name === 'suffix'
                    )
                    .map((field, index) => (
                      <FormControl
                        fullWidth
                        key={index}
                        sx={{ flex: field.name === 'lastName' ? 2 : 1 }}
                        error={Boolean(errors[field.name]?.length)}
                      >
                        <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                        {field.type === 'select' ? (
                          <Select
                            labelId={`${field.name}-label`}
                            id={field.name}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleSelectChange}
                            label={field.label}
                          >
                            {field.options?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <OutlinedInput
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            label={field.label}
                          />
                        )}
                        {errors[field.name]?.[0] && (
                          <FormHelperText>{errors[field.name][0]}</FormHelperText>
                        )}
                      </FormControl>
                    ))}
                </Stack>
              )}

              {/* Other fields that are not explicitly displayed, excluding some fields*/}
              {fields
                .filter(
                  (field) =>
                    field.gridSpan !== 2 &&
                    field.name !== 'firstName' &&
                    field.name !== 'lastName' &&
                    field.name !== 'suffix' &&
                    field.name !== 'name' &&
                    field.name !== 'address' &&
                    field.name !== 'contactNumber'
                )
                .map((field, index) => (
                  <FormControl
                    fullWidth
                    key={index}
                    error={Boolean(errors[field.name]?.length)}
                  >
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    {field.type === 'select' ? (
                      <Select
                        labelId={`${field.name}-label`}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleSelectChange}
                        label={field.label}
                      >
                        {field.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <OutlinedInput
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                      />
                    )}
                    {errors[field.name]?.[0] && (
                      <FormHelperText>{errors[field.name][0]}</FormHelperText>
                    )}
                  </FormControl>
                ))}
            </Stack>

            {/* Column 2 */}
            <Stack spacing={2} flex={1}>
              {/* Fields that span 2 columns (gridSpan === 2) */}
              {fields
                .filter(
                  (field) =>
                    field.gridSpan === 2 &&
                    field.name !== 'name' &&
                    field.name !== 'address' &&
                    field.name !== 'contactNumber'
                )
                .map((field, index) => (
                  <FormControl
                    fullWidth
                    key={index}
                    error={Boolean(errors[field.name]?.length)}
                  >
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    {field.type === 'select' ? (
                      <Select
                        labelId={`${field.name}-label`}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleSelectChange}
                        label={field.label}
                      >
                        {field.options?.map((option, idx) => (
                          <MenuItem key={idx} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <OutlinedInput
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        label={field.label}
                      />
                    )}
                    {errors[field.name]?.[0] && (
                      <FormHelperText>{errors[field.name][0]}</FormHelperText>
                    )}
                  </FormControl>
                ))}
            </Stack>
          </Stack>

          <div className="mt-4">{children({ handleSubmit })}</div>
        </Stack>
      </DialogContent>

    </Dialog>
  );
};

export default ReusableCreateModalPage;