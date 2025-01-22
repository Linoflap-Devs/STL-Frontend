import * as React from 'react';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  height: 64,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  marginLeft: open ? 0 : 0,
  width: open ? `calc(100% - 240px)` : '100%',
}));

const Header = ({ open, handleDrawerOpen }: { open: boolean; handleDrawerOpen: () => void }) => (
  <AppBar position="fixed" open={open}>
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={[
          {
            marginRight: 5,
          },
          open && { display: 'none' },
        ]}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        Header
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
