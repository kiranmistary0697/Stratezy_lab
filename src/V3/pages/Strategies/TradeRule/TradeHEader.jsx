import React from "react";
import { InfoIcon } from "./icon";
import { Typography, Box } from "@mui/material";

const TradeHEader = ({ title, description }) => {
  return (
    <Box className="flex flex-col max-md:max-w-full space-y-5 ">
      <Box className=" w-full max-md:max-w-full">
        <Box className="flex gap-2.5  items-center self-start">
          <div className="text-xl font-semibold  leading-tight text-neutral-950">
            {title}
          </div>
        </Box>
        <div className="text-sm mt-2.5 font-normal text-stone-500 max-md:max-w-full">
          {description}
        </div>
      </Box>
    </Box>
  );
};

export default TradeHEader;
