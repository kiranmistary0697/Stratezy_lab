import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Coinimg from "../assets/coins.svg";
import NavigationTab from "./NavigationTabs";
import LanguageDropdown from "../components/Select/LanguageDropdown";
import routes from "../V2/constants/Routes";
import Logo from "../V2/assets/Logo.svg";
import { useAuth } from "../V2/contexts/AuthContext";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const NavigationHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Close Drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      className="flex flex-col justify-center px-6 py-4 w-full text-sm font-medium bg-white md:px-8"
      sx={{
        boxShadow: "2px 1px 4px 0px #01010117",
      }}
    >
      {/* <nav className="flex flex-wrap justify-between items-center w-full"> */}
      <nav className="w-full justify-between items-center lg:flex lg:flex-nowrap">
        {/* Left Section */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Hamburger Menu Icon for Mobile */}
          <div className="lg:hidden flex items-center justify-between w-full gap-4">
            <IconButton
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open Menu"
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* Right Section */}
            <div className="flex items-center gap-4 sm:gap-5 md:gap-7">
              {/* Language Dropdown */}
              <LanguageDropdown />

              {/* Icons */}
              <HelpOutlineOutlinedIcon fontSize="small" />
              <NotificationsNoneOutlinedIcon className="object-contain w-6 sm:w-7 md:w-[30px]" />
              <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 text-white bg-blue-700 rounded-full">
                S
              </div>
            </div>
          </div>

          {/* Logo */}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-4 md:gap-3 items-center">
            <Link to={routes.homepage}>
              <img
                src={Logo}
                alt="logo"
                className="w-20 lg:w-[5.75rem] h-auto"
              />
            </Link>

            <NavigationTab to="/Strategies">Strategies</NavigationTab>
            <NavigationTab to="/Backtest">Backtests</NavigationTab>
            <NavigationTab to="/Deploy">Deploy</NavigationTab>
            <div className="w-px h-5 bg-zinc-200"></div>
            <NavigationTab to="/Globalfunctions">Library</NavigationTab>
            <NavigationTab to="/Devstudio" gradient>
              Dev Studio
            </NavigationTab>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 mt-3 sm:gap-5 md:gap-7 ">
          <Tooltip
            title={
              <div className="flex flex-col gap-2 text-sm ">
                <div className="font-[600] text-xs text-[#535862]">
                  Current Plan
                </div>
                <div className="text-sm text-gray-600">41/50 credits</div>
                <div className="text-sm text-gray-600">1/1 Deployment</div>
                <div className="text-sm text-blue-700 cursor-pointer">
                  Subscribe to Pro Plan
                </div>
              </div>
            }
            placement="bottom"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid #e4e4e7",
                  boxShadow: "0px 4px 13px rgba(0, 0, 0, 0.16)",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  maxWidth: "210px",
                },
              },
            }}
          >
            <Box className="flex gap-2 items-center cursor-pointer">
              <img src={Coinimg} alt="Coin" className="h-5 w-5" />
              <Typography sx={{ fontSize: "14px", color: "#0A0A0A" }}>
                41
              </Typography>
            </Box>
          </Tooltip>
          <Button
            className="text-sm font-medium px-4 py-2"
            sx={{
              borderRadius: "3px",
              padding: "10px",
              height: "30px",
              width: "88px",
              background: "linear-gradient(90deg, #0037FF 0%, #FF1DC6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              border: "1px solid",
              borderImageSource:
                "linear-gradient(90deg, #0037FF 0%, #FF1DC6 100%)",
              borderImageSlice: 1,
            }}
          >
            Subscribe
          </Button>

          <div className="w-px h-5 bg-zinc-200"></div>
          {/* Language Dropdown */}
          <LanguageDropdown />
          {/* Icons */}
          <HelpOutlineOutlinedIcon fontSize="small" />
          <NotificationsNoneOutlinedIcon className="object-contain w-6 sm:w-7 md:w-[30px]" />
          <div
            style={{ cursor: "pointer" }}
            onClick={handleClick}
            className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 text-white bg-blue-700 rounded-full"
          >
            S
          </div>
          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate("/subscription")}>
              Subscription
            </MenuItem>
            <MenuItem onClick={() => navigate("/plans")}>Plans</MenuItem>
            <Divider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </div>
      </nav>

      {/* Mobile Persistent Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        className="lg:hidden"
      >
        <div className="w-64 p-4 flex flex-col gap-3">
          <Link to={routes.homepage}>
            <img src={Logo} alt="logo" className="w-20 lg:w-[5.75rem] h-auto" />
          </Link>

          <NavigationTab to="/Strategies" onClick={() => setMobileOpen(false)}>
            Strategies
          </NavigationTab>
          <NavigationTab to="/Backtest" onClick={() => setMobileOpen(false)}>
            Backtests
          </NavigationTab>
          <NavigationTab to="/Deploy" onClick={() => setMobileOpen(false)}>
            Deploy
          </NavigationTab>
          <NavigationTab
            to="/Globalfunctions"
            onClick={() => setMobileOpen(false)}
          >
            Library
          </NavigationTab>
          <NavigationTab
            to="/Devstudio"
            gradient
            onClick={() => setMobileOpen(false)}
          >
            Dev Studio
          </NavigationTab>
        </div>
      </Drawer>
    </Box>
  );
};

export default NavigationHeader;
