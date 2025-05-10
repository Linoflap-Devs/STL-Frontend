import React from 'react';
import {
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReusableModalPageProps } from '~/types/interfaces';
import { useFormStore } from '../../../../store/useFormStore';
import axiosInstance from '~/utils/axiosInstance';
import { AxiosError } from 'axios';
import { useOperatorsData } from '../../../../store/useOperatorStore';
import useUserRoleStore from '../../../../store/useUserStore';

const ReusableCreateModalPage: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  children,
  endpoint,
  layout = 2, // Default to 2 columns layout
}) => {
  // Convert layout to a number if it's a string
  const numericLayout = typeof layout === 'number' ? layout : layout === 'single' ? 1 : layout === 'double' ? 2 : 2;

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
      if (!endpoint || typeof endpoint === 'object' && !endpoint.create) {
        throw new Error("Invalid endpoint: 'create' endpoint is required.");
      }

      const endpointUrl = typeof endpoint === 'string' ? endpoint : endpoint.create;

      const payload = {
        ...formData,
        ...(roleId && { userTypeId: roleId }),
      };

      const response = await axiosInstance.post(endpointUrl, payload, {
        withCredentials: true,
      });

      // Handle success (e.g., close modal, show success message)
    } catch (error) {
      const err = error as AxiosError;
      // Handle error (e.g., show error message)
    }
  };

  // Break the fields array into columns based on numericLayout (number of columns)
  const columnCount = numericLayout;
  const fieldsPerColumn = Math.ceil(fields.length / columnCount);

  const columns: Array<Array<typeof fields[0]>> = Array.from(
    { length: columnCount },
    (_, index) => fields.slice(index * fieldsPerColumn, (index + 1) * fieldsPerColumn)
  );

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
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <IconButton sx={{ alignSelf: 'flex-end' }} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 28, fontWeight: 700, backgroundColor: '#ACA993', borderRadius: '50%', padding: '4px', color: '#FFFFFF' }} />
        </IconButton>
        <Typography sx={{ fontSize: 26, fontWeight: 'bold', mt: -2 }}>
          {title}
        </Typography>
      </DialogTitle>

      
      <DialogContent>
        <Stack spacing={2} sx={{pt:1}}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {/* Column 1 */}
            <Stack spacing={2} flex={1}>
              {/* Given Name */}
              {fields
                .filter((field) => field.name === 'firstName')
                .map((field, index) => (
                  <FormControl fullWidth key={index}>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <OutlinedInput
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      label={field.label}
                    />
                  </FormControl>
                ))}

              {/* Last Name and Suffix side by side */}
              <Stack direction="row" spacing={2}>
                {fields
                  .filter((field) => field.name === 'lastName' || field.name === 'suffix')
                  .map((field, index) => (
                    <FormControl
                      fullWidth
                      key={index}
                      sx={{
                        flex: field.name === 'lastName' ? 2 : 1, // Give more space to 'lastName'
                      }}
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
                    </FormControl>
                  ))}
              </Stack>

              {/* Phone Number */}
              {fields
                .filter((field) => field.name === 'phoneNumber')
                .map((field, index) => (
                  <FormControl fullWidth key={index}>
                    <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
                    <OutlinedInput
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      label={field.label}
                    />
                  </FormControl>
                ))}
            </Stack>

            {/* Column 2 */}
            <Stack spacing={2} flex={1}>
              {fields
                .filter((field) => field.gridSpan === 2)
                .map((field, index) => (
                  <FormControl fullWidth key={index}>
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
                  </FormControl>
                ))}
            </Stack>
          </Stack>

        <div className="mt-4">
          {children({ handleSubmit })}
        </div>
        </Stack>
      </DialogContent>

    </Dialog>
  );
};

export default ReusableCreateModalPage;