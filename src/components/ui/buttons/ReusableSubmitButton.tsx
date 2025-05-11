import React from 'react';
import { Button } from '@mui/material';

export interface ReusableButtonProps {
  handleSubmit: () => void;
  loading: boolean;
  label: string;
  style?: React.CSSProperties;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  handleSubmit,
  loading,
  label,
}) => {
  return (
    <Button
      onClick={handleSubmit}
      disabled={loading}
      sx={{
        mt: 1,
        width: '100%',
        backgroundColor: '#F6BA12',  // Default color
        textTransform: 'none',
        fontSize: '12px',
        padding: '0.6rem',
        borderRadius: '8px',
        color: '#181A1B',
        '&:hover': {
          backgroundColor: '#FFD100', // Hover color
        },
      }}
      variant="contained"
    >
      {loading ? 'Submitting...' : label}
    </Button>
  );
};

export default ReusableButton;
