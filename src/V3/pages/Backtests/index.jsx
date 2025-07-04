import React from "react";
import BacktestHeader from "./BacktestHeader";
import { Divider, Box, Grid2 } from "@mui/material";
import ViewBacktestResult from "../Strategies/ViewStrategy/ViewModal/ViewBacktestResult";
import BacktestTable from "./BacktestTable";
import useLabTitle from "../../hooks/useLabTitle";

const Backtest = () => {
  useLabTitle("Backtest");
  return (
    <div className="sm:h-[calc(100vh-100px)] overflow-auto">
      <div className=" h-full space-y-4 p-8">
        {/* Added px-4 for side padding */}
        <BacktestHeader className="my-[-30px]" />{" "}
        {/* Applied -30px margin on top and bottom */}
        <Box>
          <BacktestTable />
        </Box>
      </div>
    </div>
  );
};

export default Backtest;
