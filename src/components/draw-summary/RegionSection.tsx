import React, { useRef } from 'react';
import Typography from '@mui/material/Typography';
import DrawCardComponent from '~/components/draw-summary/DrawCardComp';
import { Box } from '@mui/material';

interface RegionSectionProps {
  regionName: string;
}

const RegionSection: React.FC<RegionSectionProps> = ({ regionName }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 345 + 16;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ mb: 4, position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
      <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2, mt: 3}}>{regionName}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>

        {/* Left Scroll Button */}
        <Box
          onClick={() => handleScroll('left')}
          sx={{
            position: 'absolute',
            left: 0,
            height: '100%',
            width: '58px',
            backgroundColor: '#000000BF',
            cursor: 'pointer',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#000000E0',
            },
          }}
        />
        
        {/* Card Carousel */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            overflow: 'hidden',
            gap: 2,
            scrollBehavior: 'smooth',
            width: 'calc((345px + 16px) * 4)', // Show exactly 4 cards
            maxWidth: '100%',
          }}
        >
          {Array.from({ length: 12 }).slice(0, 4).map((_, index) => (
            <DrawCardComponent key={index} />
          ))}
        </Box>
        
        {/* Right Scroll Button  */}
        <Box
          onClick={() => handleScroll('right')}
          sx={{
            position: 'absolute',
            right: 0,
            height: '100%',
            width: '58px',
            backgroundColor: '#000000BF',
            cursor: 'pointer',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#000000E0',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default RegionSection;
