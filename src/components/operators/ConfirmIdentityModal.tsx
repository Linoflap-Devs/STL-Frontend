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

// Zod schema to validate password
const passwordSchema = z.string().nonempty({ message: 'Password is required' });

interface ModalConfirmIdentityProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const style: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 438,
  height: 518,
  bgcolor: "#212121",
  color: 'white',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  // position: 'relative',
};

function ModalConfirmIdentity({ open, onClose, onConfirm }: ModalConfirmIdentityProps) {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validateForm = () => {
    try {
      passwordSchema.parse(password);
      setPasswordError('');
      return true;
    } catch (error: any) {
      setPasswordError(error.errors[0].message);
      return false;
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      onConfirm(password);
      setPassword('');
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
        {/* Back Arrow Icon */}
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
          For security reasons, please enter your password to confirm the deletion of this item. This action cannot be undone.
        </Typography>

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
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
          disabled={!password}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}

export default ModalConfirmIdentity;
