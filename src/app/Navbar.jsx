import React, { createContext, useContext, useState } from "react";
import {
  Button,
  Tooltip,
  IconButton,
  Drawer,
  Modal,
  Box,
  Typography,
  Menu,
  MenuItem,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import Logo from "../V2/assets/Logo.svg";
import { useAuth } from "../V2/contexts/AuthContext";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import routes from "../V2/constants/Routes";
import { useMarket } from "./MarketContext";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const { selectedMarket, setSelectedMarket } = useMarket();
  const navigate = useNavigate();
  const { logout, authToken, getAccessToken } = useAuth();

  // Market dropdown state
  const [marketMenuOpen, setMarketMenuOpen] = useState(false);
  const marketRef = React.useRef(null);

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Market dropdown handlers
  const handleMarketToggle = () => {
    setMarketMenuOpen((prevOpen) => !prevOpen);
  };

  const handleMarketClose = (event) => {
    if (marketRef.current && marketRef.current.contains(event.target)) {
      return;
    }
    setMarketMenuOpen(false);
  };

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
    setMarketMenuOpen(false);
    // You can add any navigation or state change logic here based on the selected market
  };

  const handleFetchCredits = async () => {
    try {
      const latestToken = getAccessToken();
      const response = await axios.get(
        "https://stratezylabs.ai/stock-analysis-function/credit",
        {
          headers: { Authorization: `Bearer ${latestToken}` },
        }
      );
      setCredits(
        response.data.availableCredit +
          ", ExpiryDate - " +
          response.data.expiryDate
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCredits("Unable to fetch credits");
      setModalOpen(true);
    } finally {
    }
  };

  const handleSubscribe = async () => {
    try {
      const latestToken = getAccessToken();
      console.log("This will be enabled later");
      // Dont remove commented code.

      const response = await axios.post(
        "https://stratezylabs.ai/stockclient/create-session",
        { priceId: "price_1Qs2UHHUHzoZhIZknfmwnizB" },
        {
          headers: {
            Authorization: `Bearer ${latestToken}`,
          },
        }
      );

      if (response.data && response.data.url) {
        console.log("Redirecting user to:", response.data.url);
        window.location = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCredits(null);
  };

  return (
    <nav className="h-navHeightMobile lg:h-navHeight bg-primary-white lg:shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between w-full h-full max-w-maxContent mx-auto px-5 lg:px-32">
        {/* Logo Section */}
        <div className="flex items-center gap-x-4">
          <Link to="/">
            <img src={Logo} alt="logo" className="w-16 lg:w-24 h-auto" />
          </Link>
          <div className="hidden lg:flex items-center gap-x-8">
            <Link
              to="/products"
              className="hover:text-primary-blue-hover transition duration-200 text-base"
            >
              Products
            </Link>
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-x-4">
          <Tooltip title="Home">
            <Button
              onClick={() => navigate("/")}
              color="secondary"
              className="px-4 py-2 text-sm flex items-center gap-x-2"
              variant="outlined"
            >
              Home <HomeIcon />
            </Button>
          </Tooltip>

          {/* Market Dropdown Button - Using Popper for better visibility control */}
          <div>
            <Button
              ref={marketRef}
              aria-controls={marketMenuOpen ? "market-menu" : undefined}
              aria-haspopup="true"
              onClick={handleMarketToggle}
              color="secondary"
              className="px-4 py-2 text-sm flex items-center gap-x-2"
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
            >
              Market: {selectedMarket}
            </Button>
            <Popper
              open={marketMenuOpen}
              anchorEl={marketRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              style={{ zIndex: 1301 }} // Ensure it's above other elements
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper elevation={3}>
                    <ClickAwayListener onClickAway={handleMarketClose}>
                      <MenuList autoFocusItem={marketMenuOpen} id="market-menu">
                        <MenuItem
                          onClick={() => handleMarketSelect("India")}
                          selected={selectedMarket === "India"}
                        >
                          India
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleMarketSelect("US")}
                          selected={selectedMarket === "US"}
                        >
                          US
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>

          <Button
            onClick={handleFetchCredits}
            className="px-4 py-2 text-sm flex items-center gap-x-2"
            variant="outlined"
            color="secondary"
          >
            Credits <AttachMoneyIcon />
          </Button>

          <Button
            className=" px-4 py-2 text-sm flex items-center gap-x-2"
            variant="outlined"
            color="secondary"
            // onClick={() => navigate(routes.plan)}
            onClick={handleSubscribe}
          >
            Subscribe <SubscriptionsIcon />
          </Button>

          <Button
            onClick={logout}
            className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 flex items-center gap-x-2"
          >
            Logout <LogoutIcon />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <IconButton onClick={handleToggleDrawer} color="primary">
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer}>
        <div className="w-64 p-6 flex flex-col gap-y-6 bg-white h-full">
          {/* Header */}
          <div className="text-center text-xl font-semibold border-b pb-4">
            Menu
          </div>

          {/* Products Link */}
          <Link
            to="/products"
            onClick={handleToggleDrawer}
            className="text-lg font-medium hover:text-primary-blue transition"
          >
            Products
          </Link>

          {/* Home Button */}
          <div className="flex justify-center">
            <Link to="/" onClick={handleToggleDrawer} className="w-full">
              <Button
                className="w-full flex items-center justify-center gap-x-2"
                variant="outlined"
                color="primary"
              >
                Home <HomeIcon />
              </Button>
            </Link>
          </div>

          {/* Market Selection in Mobile Menu */}
          <div className="flex flex-col gap-y-2">
            <Typography variant="subtitle1" className="font-medium">
              Market
            </Typography>
            <div className="flex flex-col space-y-2">
              <Button
                className={`w-full justify-start pl-4 ${
                  selectedMarket === "India" ? "bg-blue-100" : ""
                }`}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSelectedMarket("India");
                  // Add any navigation or state change logic here
                }}
              >
                India
              </Button>
              <Button
                className={`w-full justify-start pl-4 ${
                  selectedMarket === "US" ? "bg-blue-100" : ""
                }`}
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setSelectedMarket("US");
                  // Add any navigation or state change logic here
                }}
              >
                US
              </Button>
            </div>
          </div>

          {/* Available Credits Button */}
          <Button
            className="w-full flex items-center justify-center gap-x-2"
            variant="outlined"
            color="secondary"
            onClick={handleFetchCredits}
          >
            Available Credits
          </Button>

          {/* Subscribe Button */}
          <Button
            className="w-full flex items-center justify-center gap-x-2"
            variant="outlined"
            color="secondary"
            // onClick={() => navigate(routes.plan)}
            onClick={handleSubscribe}
          >
            Subscribe <SubscriptionsIcon />
          </Button>

          {/* Logout Button */}
          <Button
            onClick={() => {
              logout();
              handleToggleDrawer();
            }}
            className="w-full text-white bg-red-500 hover:bg-red-600 py-2 flex items-center justify-center gap-x-2"
          >
            Logout <LogoutIcon />
          </Button>
        </div>
      </Drawer>

      {/* Modal for Credits */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-32"
          sx={{ outline: "none" }}
        >
          <Typography variant="h6" className="mb-4 text-center">
            Available Credits
          </Typography>
          <Typography variant="body1" className="text-center">
            {credits !== null ? credits : "Loading..."}
          </Typography>
          <Button
            onClick={handleCloseModal}
            className="mt-6 w-full bg-blue-500 text-white hover:bg-green-600"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;
