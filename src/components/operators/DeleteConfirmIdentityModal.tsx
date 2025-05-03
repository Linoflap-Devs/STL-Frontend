import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  SxProps,
  Theme,
} from '@mui/material';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { z } from 'zod';

// Zod schema to validate both fields
const formSchema = z.object({
  password: z.string().nonempty({ message: 'Password is required' }),
  remarks: z.string().nonempty({ message: 'Remarks are required' }),
});

interface ModalConfirmIdentityProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string, remarks: string) => void;
}

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 438,
  height: 580,
  bgcolor: '#212121',
  color: 'white',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

function ModalDeleteteConfirmIdentity({ open, onClose, onConfirm }: ModalConfirmIdentityProps) {
  const [password, setPassword] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; remarks?: string }>({});

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const result = formSchema.safeParse({ password, remarks });
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        password: fieldErrors.password?.[0],
        remarks: fieldErrors.remarks?.[0],
      });
      return false;
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(password, remarks);
      setPassword('');
      setRemarks('');
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-identity-modal-title"
      aria-describedby="confirm-identity-modal-description"
    >
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            bgcolor: '#171717',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            },
            width: 40,
            height: 40,
            borderRadius: '50%',
          }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>

        <Image
          src="/images/STL_256p.png"
          alt="Logo"
          width={150}
          height={150}
          style={{ marginBottom: 8 }}
        />

        <Typography id="confirm-identity-modal-title" variant="h6" component="h2">
          Confirm Your Identity
        </Typography>
        <Typography
          id="confirm-identity-modal-description"
          sx={{ mt: 0.5, textAlign: 'center', fontSize: '12px' }}
        >
          For security reasons, please enter your password and remarks to confirm the deletion of this item. This action cannot be undone.
        </Typography>
        
        <TextField
          fullWidth
          label="Remarks"
          multiline
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          error={!!errors.remarks}
          helperText={errors.remarks}
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalDeleteteConfirmIdentity;
