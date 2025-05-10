// ReusableButton.tsx
import React from 'react';
import { Button } from '@mui/material';

export interface ReusableButtonProps {
handleSubmit: () => void;       // The function to call on button click
  loading: boolean;          // Loading state to disable button and change text
  label: string;             // Button text
  style?: React.CSSProperties;  // Optional custom style for the button
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  handleSubmit,
  loading,
  label,
  style,
}) => {
  return (
    <Button
      onClick={handleSubmit}
      disabled={loading}
      sx={{
        mt: 1,
        width: '100%',
        backgroundColor: '#F6BA12',
        textTransform: 'none',
        fontSize: '12px',
        padding: '0.6rem',
        borderRadius: '8px',
        color: '#181A1B',
        ...style,
      }}
      variant="contained"
    >
      {loading ? 'Submitting...' : label}
    </Button>
  );
};

export default ReusableButton;
