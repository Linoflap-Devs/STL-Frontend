import React from 'react';
import { Box } from '@mui/material';

interface BackgroundSectionProps {
  imageSrc: string;
  logoSrc: string;
  altLogo?: string;
}

const LoginBackgroundSection: React.FC<BackgroundSectionProps> = ({
  imageSrc,
  logoSrc,
  altLogo = 'Logo',
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '#2D2D2D',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundImage: `url('${imageSrc}')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            component="img"
            src={logoSrc}
            alt={altLogo}
            sx={{
              maxWidth: {
                xs: '60%',
                sm: '60%',
                md: '60%',
                lg: '50%',
                xl: '40%',
              },
            }}
            loading="lazy" // Lazy load images for better performance
          />
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(LoginBackgroundSection); // Memoize to prevent unnecessary re-renders
