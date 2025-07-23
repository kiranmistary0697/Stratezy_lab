import { useEffect, useState } from "react";

import BacktestHeader from "./BacktestHeader";
import BacktestTable from "./BacktestTable";

import { Box } from "@mui/material";
import useLabTitle from "../../hooks/useLabTitle";

import { useDispatch } from "react-redux";
import { useLazyGetQuery } from "../../../slices/api";
import { setBacktestData } from "../../../slices/page/reducer";
import { tagTypes } from "../../tagTypes";

const Backtest = () => {
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const [
    getBackTestData,
    { data: { data: backtestData = [] } = {}, isLoading },
  ] = useLazyGetQuery();

  useEffect(() => {
    if (backtestData?.length) {
      setRows(backtestData);
    }
  }, [backtestData]);

  const fetchAllData = async () => {
    try {
      const response = await getBackTestData({
        endpoint: "command/backtest/findall",
        tags: [tagTypes.BACKTEST],
      }).unwrap();
      setRows(response.data);
      dispatch(setBacktestData(response));
    } catch (error) {
      console.error("Failed to fetch backtest data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useLabTitle("Backtest");
  return (
    <div className="sm:h-[calc(100vh-100px)] overflow-auto">
      <div className=" h-full space-y-4 p-8">
        {/* Added px-4 for side padding */}
        <BacktestHeader
          className="my-[-30px]"
          fetchAllData={fetchAllData}
        />{" "}
        {/* Applied -30px margin on top and bottom */}
        <Box>
          <BacktestTable
            isLoading={isLoading}
            fetchAllData={fetchAllData}
            rows={rows}
          />
        </Box>
      </div>
    </div>
  );
};

export default Backtest;
