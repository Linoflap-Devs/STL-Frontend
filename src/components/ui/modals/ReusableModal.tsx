import React from 'react';
import axios from 'axios';
import { Field, ReusableModalPageProps } from '../../../types/interfaces';
import { useFormStore } from '../../../../store/useFormStore';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, 
  Button, FormControl, InputLabel, OutlinedInput, FormHelperText, Stack, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';

const ReusableModalPage: React.FC<ReusableModalPageProps> = ({ title, endpoint, isOpen, onClose, fields, onSuccess }) => {
  const {
    formData,
    setFormData,
    loading,
    setLoading,
    error,
    setError,
  } = useFormStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await axios.post(endpoint, formData);
      setFormData({});
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth PaperProps={{
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
      <DialogTitle sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        py: 0,
      }}>
        <IconButton
          sx={{ backgroundColor: "#171717", alignSelf: "flex-end" }}
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 20, fontWeight: 700 }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: -1 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          {fields.map((field) => (
            <Stack key={field.name} spacing={1}>
              <FormControl fullWidth error={!!error}>
                <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                <OutlinedInput
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  label={field.label}
                />
                {error && (
                  <FormHelperText>{error}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 3 }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              mt: 3,
              width: "100%",
              backgroundColor: "#67ABEB",
              textTransform: "none",
              fontSize: "12px",
              padding: "0.6rem",
              borderRadius: "8px",
              color: "#181A1B",
            }}
            variant="contained"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ReusableModalPage;