import React from "react";
import { Box, Typography } from "@mui/material";
import CapitalHeader from "./CapitalHeader";
import CapitalTable from "./CapitalTable";

const CapitalPage = ({ data = {} }) => {
  return (
    <Box className="flex flex-col gap-3.5 space-y-6  w-full  max-md:gap-3 max-md:p-4 max-md:max-w-[991px] max-sm:gap-2.5 max-sm:p-2.5 max-sm:max-w-screen-sm">
      <CapitalHeader data={data} />
      <Box className="subheader space-y-8">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "120%",
            letterSpacing: "0px",
            color: "#0A0A0A",
          }}
        >
          Capital History
        </Typography>
        <CapitalTable data={data} />
      </Box>
    </Box>
  );
};

export default CapitalPage;
