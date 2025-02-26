import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box } from '@mui/material';

const DrawCardComponent = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        {/* Placeholder Box instead of Image */}
        <Box
          sx={{
            height: 140,
            backgroundColor: '#D9D9D9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No Image Available
          </Typography>
        </Box>

        {/* Card Content Section */}
        <CardContent
        sx={{
          backgroundColor: '#282828'
        }}
          >
          {/* Container for Draw Details */}
          <Box
            sx={{
              backgroundColor: '#282828',
              width: '285px',
              height: '113px',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            {/* Location Title */}
            <Typography
              sx={{
                fontFamily: 'Roboto',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '18.75px',
                color: '#FFFFFF',
                marginBottom: '10px',
              }}
            >
              Ilocos Norte
            </Typography>

            {/* Row of Draw Times and Numbers */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Draw Entry (Repeats 3 times) */}
              {[1, 2, 3].map((_, index) => (
                <Box key={index} sx={{ padding: '5px' }}>
                  {/* Draw Time */}
                  <Typography
                    sx={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}
                  >
                    10:30 AM
                  </Typography>

                  {/* Number Boxes */}
                  <Box sx={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                    {[39, 22].map((num, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '5px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {num}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DrawCardComponent;
