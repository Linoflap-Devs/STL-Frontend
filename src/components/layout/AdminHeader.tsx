import React, { FC } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import { UserSectionData } from "../../data/AdminSectionData";

interface AdminHeaderProps {
  children?: React.ReactNode;
  pages: string[];
}

const AdminHeader: FC<AdminHeaderProps> = ({ children, pages, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      className="shadow-none px-4 sm:px-6 md:px-10 lg:px-20 mb-4 sm:mb-5 md:mb-5"
      sx={{
        backgroundColor: "#2D2D2D",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ textAlign: "center", marginY: 2.2 }}>
              <img
                src={UserSectionData.image}
                alt="Logo"
                style={{ maxWidth: "60px", width: "100%" }}
              />
            </Box>

            <Box sx={{ marginLeft: 1.5 }}>
              <Typography
                sx={{
                  marginBottom: 0,
                  color: "white",
                  fontWeight: "700",
                  lineHeight: "24.2px",
                  fontSize: 16,
                }}
              >
                {UserSectionData.titleHeader}
              </Typography>

              <Typography
                sx={{
                  color: "white",
                  fontWeight: "200",
                  lineHeight: "15px",
                  fontSize: 12.5,
                }}
              >
                {UserSectionData.userRole}
              </Typography>
            </Box>
          </Box>

          {/* Right Side (Pages) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {UserSectionData.pages.map((page) => (
              <Box
                key={page}
                component="a"
                href={
                  page === "Manager" ? "/managers" : `/${page.toLowerCase()}`
                }
                sx={{
                  display: "block",
                  textAlign: "center",
                  textTransform: "capitalize",
                  color: "white",
                  paddingX: page === "Manager" ? 3 : "none",
                  paddingY: page === "Manager" ? 0.7 : "none",
                  borderRadius: page === "Manager" ? "6px" : "none",
                  backgroundColor:
                    page === "Manager" ? "#A550A5" : "transparent",
                  width: "auto",
                  fontSize: 13.8,
                  fontWeight: 300,
                  marginX: 2,
                  textDecoration: "none",
                }}
              >
                {page}
              </Box>
            ))}
          </Box>

          {/* Mobile Menu */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none", md: "none", lg: "none" },
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {UserSectionData.pages.map((page) => (
                <MenuItem key={page} onClick={handleMenuClose}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AdminHeader;
