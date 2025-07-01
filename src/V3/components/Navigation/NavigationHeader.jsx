import { useState } from "react";

import NavigationTab from "../../common/NavigationTab";
import LanguageDropdown from "../Select/LanguageDropdown";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import Coinimg from "../../../src/coins.svg";

const NavigationHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      className="flex flex-col justify-center px-6 py-4 w-full text-sm font-medium bg-white md:px-8"
      sx={{
        boxShadow: "2px 1px 4px 0px #01010117",
      }}
    >
      {/* <nav className="flex flex-wrap justify-between items-center w-full"> */}
      <nav className="w-full justify-between items-center lg:flex lg:flex-wrap">
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
              onClick={handleDrawerToggle}
              aria-label="Open Menu"
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* Right Section */}
            <div className="flex items-center gap-4 sm:gap-5 md:gap-7">
              {/* Language Dropdown */}
              <LanguageDropdown />

              {/* Icons */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/34d8e71f80a919b404d290473e747fb82bfce80bd90f36c4eddc0a02be2fe42c?placeholderIfAbsent=true"
                alt="Notification"
                className="object-contain w-6 sm:w-7 md:w-[30px]"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/612cffdae0f4c98d449915915ef6936f1403be47f47c8a97e6f2bd4ce6476e00?placeholderIfAbsent=true"
                alt="Settings"
                className="object-contain w-5 sm:w-6"
              />
              <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 text-white bg-blue-700 rounded-full">
                S
              </div>
            </div>
          </div>

          {/* Logo */}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-4 items-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4fd993ef7801415ff4f6f04604936b257a79b53e9fa0a1f5504e10a5e1bbae35?placeholderIfAbsent=true"
              alt="Company Logo"
              className="object-contain w-16 md:w-[67px]"
            />

            <NavigationTab to="/Strategies">Strategies</NavigationTab>
            <NavigationTab to="/Backtest">Backtests</NavigationTab>
            <NavigationTab to="/Deploy">Deploy</NavigationTab>
            <div className="w-px h-5 bg-zinc-200"></div>
            <NavigationTab to="/Globalfunctions">
              Global Functions
            </NavigationTab>
            <NavigationTab to="/Devstudio" gradient>
              Dev Studio
            </NavigationTab>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 sm:gap-5 md:gap-7">
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
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 2],
                  },
                },
              ],
            }}
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
            className="!rounded-[5px] text-sm font-medium px-4 py-2"
            style={{
              background: "linear-gradient(90deg, #0037FF 0%, #FF1DC6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              border: "1px solid ",
              borderImageSource:
                "linear-gradient(90deg, #0037FF 0%, #FF1DC6 100%)",
              borderImageSlice: 1,
              // borderRadius: "!5px", // Added rounded border
            }}
          >
            Subscribe
          </Button>
          <div className="w-px h-5 bg-zinc-200"></div>
          {/* Language Dropdown */}
          <LanguageDropdown />
          {/* Icons */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/34d8e71f80a919b404d290473e747fb82bfce80bd90f36c4eddc0a02be2fe42c?placeholderIfAbsent=true"
            alt="Notification"
            className="object-contain w-6 sm:w-7 md:w-[30px]"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/612cffdae0f4c98d449915915ef6936f1403be47f47c8a97e6f2bd4ce6476e00?placeholderIfAbsent=true"
            alt="Settings"
            className="object-contain w-5 sm:w-6"
          />
          <div
            style={{ cursor: "pointer" }}
            onClick={handleClick}
            className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 text-white bg-blue-700 rounded-full"
          >
            S
          </div>
          {/* Dropdown Menu */}
          <Menu
            className="border !border-none text-[#666666] !w-[179px]"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem
              onClick={() => handleItemClick("Profile")}
              sx={{
                "&:active, &:focus, &:hover": { color: "#1E52CE" },
              }}
            >
              Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => handleItemClick("Subscription")}
              sx={{
                "&:active, &:focus, &:hover": { color: "#1E52CE" },
              }}
            >
              Subscription
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(`/plans`);
              }}
              sx={{
                "&:active, &:focus, &:hover": { color: "#1E52CE" },
              }}
            >
              Plans
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate(`/plans`);
              }}
              sx={{
                "&:active, &:focus, &:hover": { color: "#1E52CE" },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
          ;
        </div>
      </nav>

      {/* Mobile Persistent Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
        className="lg:hidden"
      >
        <div className="w-64 p-4 flex flex-col gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4fd993ef7801415ff4f6f04604936b257a79b53e9fa0a1f5504e10a5e1bbae35?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain w-16 lg:w-[67px]"
          />
          <NavigationTab to="/Dashboard" onClick={handleDrawerToggle}>
            Dashboard
          </NavigationTab>
          <NavigationTab to="/Strategies" onClick={handleDrawerToggle}>
            Strategies
          </NavigationTab>
          <NavigationTab to="/Backtest" onClick={handleDrawerToggle}>
            Backtests
          </NavigationTab>
          <NavigationTab to="/Deploy" onClick={handleDrawerToggle}>
            Deploy
          </NavigationTab>
          <NavigationTab to="/Globalfunctions" onClick={handleDrawerToggle}>
            Global Functions
          </NavigationTab>
          <NavigationTab to="/Devstudio" gradient onClick={handleDrawerToggle}>
            Dev Studio
          </NavigationTab>
        </div>
      </Drawer>
    </Box>
  );
};

export default NavigationHeader;
