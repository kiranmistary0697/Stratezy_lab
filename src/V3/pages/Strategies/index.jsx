import React from "react";
import { Box, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import useLabTitle from "../../hooks/useLabTitle";
import Grid from "@mui/material/Grid";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import TableRow from "../../common/Table/TableRow";
import { useNavigate } from "react-router-dom";

import HeaderButton from "../../common/Table/HeaderButton";
import { STRATEGY_TOOLTIP_TITLE } from "../../../constants/CommonText";

const Strategies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  useLabTitle("Strategies");

  const handleCreateStrategy = () => {
    navigate("/Strategies/create-strategies"); // Change this to your desired route
    localStorage.removeItem("stockFilters");
    localStorage.removeItem("marketEntryExit.entry");
    localStorage.removeItem("marketEntryExit.exit");
    localStorage.removeItem("tradeRules.buyRule");
    localStorage.removeItem("stockEntry");
    localStorage.removeItem("stockExit");
    localStorage.removeItem("tradeSequence");
    localStorage.removeItem("portfolioSizing-saved");
  };

  return (
    <div className="p-8 space-y-4">
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        direction="row"
        wrap="wrap"
      >
        <Grid
          item
          xs={12}
          sm={12}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          {/* Title with Tooltip */}
          <Box display="flex" alignItems="center" gap={1}>
            <div className="font-semibold text-xl">Strategy</div>
            <Tooltip
              title={STRATEGY_TOOLTIP_TITLE}
              componentsProps={{
                tooltip: {
                  sx: {
                    width: "400px",
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                  },
                },
              }}
              placement={isMobile ? "top" : "right-end"}
            >
              <InfoOutlinedIcon
                sx={{
                  color: "#666666",
                  width: "17px",
                  height: "17px",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </Box>

          {/* Button */}
          <HeaderButton variant="contained" onClick={handleCreateStrategy}>
            Create Strategy
          </HeaderButton>
        </Grid>
      </Grid>

      <TableRow />
    </div>
  );
};

export default Strategies;
