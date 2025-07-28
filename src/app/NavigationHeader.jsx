import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

import { useLazyGetQuery, usePostMutation } from "../slices/api";
import { useAuth } from "../V2/contexts/AuthContext";

import { SUBSCRIPTION_ID } from "../constants/Enum";
import routes from "../V2/constants/Routes";
import NavigationTab from "./NavigationTabs";
import LanguageDropdown from "../components/Select/LanguageDropdown";

import Coinimg from "../assets/coins.svg";
import Logo from "../V2/assets/Logo.svg";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { tagTypes } from "../V3/tagTypes";
import moment from "moment";

const NavigationHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planDetails, setPlanDetails] = useState({
    availableCredit: 0,
    maxCredit: 0,
    numDeployments: 0,
    expiryDate: "",
    state: "",
    subscriptionPricingId: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [newSubscription] = usePostMutation();
  const [getCredits] = useLazyGetQuery();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const fetchDeploymentCredit = async () => {
    try {
      const { data } = await getCredits({
        endpoint: "stock-analysis-function/credit",
        // tags: [tagTypes.GET_DEPLOY],
      }).unwrap();

      setPlanDetails(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchDeploymentCredit();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSubscribe = async () => {
    try {
      const { data } = await newSubscription({
        endpoint: "/stockclient/create-session",
        payload: { priceId: planDetails.subscriptionPricingId },
      }).unwrap();

      if (data && data.url) {
        window.location = data.url;
      }
    } catch (error) {
      console.error("error while subscribe", error);
    }
  };

  const renderCreditsTooltip = () => (
    <Tooltip
      title={
        <div className="flex flex-col gap-2 text-sm">
          <div className="font-[600] text-xs text-[#535862]">Current Plan</div>
          <div className="text-sm text-gray-600">
            {planDetails.availableCredit}/{planDetails.maxCredit} Credits
          </div>
          <div className="text-sm text-gray-600">
            {planDetails.numDeployments}/2 Deployment
          </div>
          {planDetails.expiryDate ? (
            <div className="text-sm text-gray-600">
              {moment(planDetails.expiryDate).format("DD/MM/YYYY")} Expiry
            </div>
          ) : (
            <div className="text-sm text-gray-600">Not Subscribed</div>
          )}
          <div
            className="text-sm text-blue-700 cursor-pointer"
            onClick={handleSubscribe}
          >
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
          {planDetails.availableCredit}
        </Typography>
      </Box>
    </Tooltip>
  );

  return (
    <Box
      className="flex flex-col justify-center px-6 py-4 w-full text-sm font-medium bg-white md:px-8"
      sx={{ boxShadow: "2px 1px 4px 0px #01010117" }}
    >
      <nav className="w-full justify-between items-center lg:flex lg:flex-nowrap">
        {/* Left Section */}
        <div className="flex items-center gap-5 w-full md:w-auto">
          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center justify-between w-full gap-4">
            <IconButton
              sx={{ "&:focus": { outline: "none" } }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open Menu"
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {/* Right (Mobile) */}
            <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
              {isTabletOrMobile && renderCreditsTooltip()}
              <LanguageDropdown />
              <HelpOutlineOutlinedIcon fontSize="small" />
              <NotificationsNoneOutlinedIcon className="w-6 sm:w-7 md:w-[30px]" />
              <div
                onClick={handleClick}
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-blue-700 text-white cursor-pointer"
              >
                S
              </div>
            </div>
          </div>

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

        {/* Right Section (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 sm:gap-4 md:gap-2 lg:gap-5 mt-4 lg:mt-0 justify-end lg:justify-normal">
          {renderCreditsTooltip()}
          {/* Subscribe Button */}
          <Button
            onClick={handleSubscribe}
            sx={{
              borderRadius: "10px",
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
              textTransform: "none",
            }}
          >
            Subscribe
          </Button>

          <div className="w-px h-5 bg-zinc-200 hidden lg:block"></div>

          <LanguageDropdown />
          <HelpOutlineOutlinedIcon fontSize="small" />
          <NotificationsNoneOutlinedIcon className="w-6 sm:w-7 md:w-[30px]" />
          <div
            onClick={handleClick}
            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-blue-700 text-white cursor-pointer"
          >
            S
          </div>

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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        className="lg:hidden"
      >
        <div className="w-64 p-4 flex flex-col gap-3">
          <Link to={routes.homepage}>
            <img src={Logo} alt="logo" className="w-20 h-auto" />
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
          <Button
            onClick={handleSubscribe}
            sx={{
              borderRadius: "10px",
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
              textTransform: "none",
            }}
          >
            Subscribe
          </Button>
        </div>
      </Drawer>
    </Box>
  );
};

export default NavigationHeader;
