// dashboard (homepage)

import React from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <CssBaseline />
      <Box component="main">
        <Typography sx={{ marginBottom: 2 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet.
        </Typography>
        <Typography sx={{ marginBottom: 2 }}>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
          eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
          neque volutpat ac tincidunt.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;

