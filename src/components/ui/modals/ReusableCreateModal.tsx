import React from 'react';
import {
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
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

const ReusableModalPage: React.FC<ReusableModalPageProps> = ({
  title,
  isOpen,
  onClose,
  fields,
  children,
  endpoint,
}) => {
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
    //setIsLoading(true);
    try {
      const payload = {
        ...formData,
        ...(roleId && { userTypeId: roleId }),
      };
      const response = await axiosInstance.post(endpoint, payload, {
        withCredentials: true,
      });
      //console.log("Response:", response.data);
    } catch (error) {
      const err = error as AxiosError;
    } finally {
      //setIsLoading(false);
    }
  };

  const half = Math.ceil(fields.length / 2);
  const col1Fields = fields.slice(0, half);
  const col2Fields = fields.slice(half);

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
          xl: "800px",
        },
      }
    }}>
      <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0 }}>
        <IconButton sx={{ backgroundColor: '#171717', alignSelf: 'flex-end' }} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20, fontWeight: 700 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: -1 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {/* Column 1 */}
          <Stack flex={1} spacing={2}>
            {col1Fields.map((field) => {
              if (field.name === 'FirstName') {
                return (
                  <FormControl fullWidth variant="outlined" error={!!error} key={field.name}>
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
                    {error && <FormHelperText>{error}</FormHelperText>}
                  </FormControl>
                );
              }

              if (field.name === 'LastName' || field.name === 'Suffix') {
                return (
                  <Stack direction="row" spacing={2} key={field.name} sx={{ width: '100%' }}>
                    {field.name === 'LastName' && (
                      <FormControl fullWidth variant="outlined" error={!!error} sx={{ flex: 1 }}>
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
                        {error && <FormHelperText>{error}</FormHelperText>}
                      </FormControl>
                    )}

                    {field.name === 'Suffix' && (
                      <FormControl fullWidth variant="outlined" error={!!error} sx={{ flex: 1 }}>
                        <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
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
                        {error && <FormHelperText>{error}</FormHelperText>}
                      </FormControl>
                    )}
                  </Stack>
                );
              }

              return (
                <FormControl key={field.name} fullWidth variant="outlined" error={!!error}>
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
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
              );
            })}
          </Stack>

          {/* Column 2 */}
          <Stack flex={1} spacing={2}>
            {col2Fields.map((field) => (
              <FormControl
                key={field.name}
                fullWidth
                variant="outlined"
                error={!!error}
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
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>
            ))}
          </Stack>
        </Stack>
        <div className="mt-4">
          {children({ handleSubmit })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableModalPage;