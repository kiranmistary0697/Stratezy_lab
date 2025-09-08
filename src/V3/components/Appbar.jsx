import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Logo from "../Logo.png";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Select } from "@mui/material";

import { useNavigate } from "react-router-dom";

const countries = [
  { code: "IN", name: "India", flag: "https://flagcdn.com/w40/in.png" },
  { code: "US", name: "USA", flag: "https://flagcdn.com/w40/us.png" },
  { code: "GB", name: "UK", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "CA", name: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
];

const pages = [
  "Dashboard",
  "Strategies",
  "Backtests",
  "Deploy",
  "Global Functions",
  "Dev Studio",
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Appbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [selectedCountry, setSelectedCountry] = React.useState("IN");

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page) => {
    switch (page) {
      case "Dashboard":
        navigate("/dashboard");
        break;
      case "Backtests":
        navigate("/Backtests");
        break;
      default:
        break;
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ marginBottom: "10px", backgroundColor: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "67.06px", height: "19px" }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigate(page)}>
                  <Box
                    sx={{ textAlign: "center", padding: "10px", gap: "10px" }}
                  >
                    {page}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              sx={{
                fontSize: "14px",
                color: "#000",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "5px 10px",
                },
              }}
              displayEmpty
            >
              {countries.map((country) => (
                <MenuItem
                  key={country.code}
                  value={country.code}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <img
                    src={country.flag}
                    alt={country.code}
                    width="20"
                    height="12"
                  />
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Help Icon */}
          <IconButton sx={{ color: "#0A0A0A" }}>
            <HelpOutlineIcon />
          </IconButton>

          {/* Notification Icon */}
          <IconButton sx={{ color: "#0A0A0A" }}>
            <NotificationsNoneOutlinedIcon />
          </IconButton>

          <Box sx={{ flexGrow: 0 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "16.8px",
                letterSpacing: "0px",
              }}
            >
              <Tooltip title="Open settings">
                <Avatar sx={{ bgcolor: "#1E52CE" }}>S</Avatar>
              </Tooltip>
            </Typography>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Appbar;
