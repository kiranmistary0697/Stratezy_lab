import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavigationTabs from "../Strategies/ViewStrategy/NavigationTabs";
import BacktestDetailHeader from "./BacktestDetailHeader";
import { Divider, Grid } from "@mui/material";
import Output from "./BacktestTabs/Output";
import Visualisation from "./BacktestTabs/Visualisation";
import Tradetable from "./BacktestTabs/Tradetable";

import { useSelector } from "react-redux";
import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

const BackTestOutput = () => {
  const backTestData = useSelector((state) => state.Stock.backTestData);

  const [getTradeTable] = useLazyGetQuery();
  const [getRequestId] = useLazyGetQuery();

  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");

  const [tabIndex, setTabIndex] = useState(0);
  const [tradeTableData, setTradeTableData] = useState([]);
  const [requestData, setRequestData] = useState({});
  const [tradeTableSymbol, setTradeTableSymbol] = useState([]);

  const fetchAllData = async () => {
    try {
      const { data } = await getTradeTable({
        endpoint: `command/backtest/tradetable?id=${id}`,
        tags: [tagTypes.GET_TRADETABLE],
      }).unwrap();
      setTradeTableData(data);
      const symbolData = data?.map(({ symbol }) => symbol);
      setTradeTableSymbol(symbolData);
    } catch (error) {
      console.error("Failed to fetch backtest data:", error);
    }
  };

  const handleRequestId = async () => {
    try {
      const { data } = await getRequestId({
        endpoint: `command/backtest/status/${id}`,
        tags: [tagTypes.GET_BACKTESTREQUEST],
      }).unwrap();

      setRequestData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      handleRequestId();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAllData();
    }
  }, [id]);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const backTestIdData = backTestData?.data?.find(
    ({ requestId }) => requestId === id
  );

  const extractSummaryMetrics = (rawString = "") => {
    const summary = {};
    rawString.split("\n").forEach((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        const cleanedValue = value?.trim();

        if (
          cleanedValue && // not undefined or empty
          cleanedValue.toLowerCase() !== "null" &&
          cleanedValue.toLowerCase() !== "null %" &&
          cleanedValue.toLowerCase() !== "null days"
        ) {
          summary[key.trim()] = cleanedValue;
        }
      }
    });
    return summary;
  };

  const summaryData = extractSummaryMetrics(requestData?.summary);

  return (
    <div
      className="
        px-2 sm:px-4 md:px-8
        py-2 sm:py-4 md:py-8
        h-[calc(100vh-60px)]
        min-h-0 min-w-0
        overflow-auto
        "
      style={{ boxSizing: "border-box" }}
    >
      <div className="bg-white flex flex-col border border-[#E0E1E4] h-full min-h-0 min-w-0">
        {/* header */}
        <div>
          <BacktestDetailHeader
            tab={tabIndex}
            csvData={tradeTableData}
            data={requestData}
            requestData={requestData}
            handleRequestId={handleRequestId}
            id={id}
          />
          <NavigationTabs
            tabs={["Output", "Visualisation", "Trade Table"]}
            value={tabIndex}
            onChange={handleTabChange}
          />
          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
        </div>

        {/* components */}
        <div className="flex-grow overflow-auto min-h-0 min-w-0">
          {tabIndex === 0 && (
            <div className="px-1 py-2 sm:p-4 md:p-8 space-y-4">
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 8,
                }}
                style={{ width: "100%" }}
              >
                <Output summary={summaryData} data={requestData} />
              </Grid>
            </div>
          )}
          {tabIndex === 1 && (
            <div className="px-1 py-2 sm:p-4 md:p-8 space-y-4">
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                  lg: 8,
                }}
                style={{ width: "100%" }}
              >
                <Visualisation id={id} tradeTableSymbol={tradeTableSymbol} />
              </Grid>
            </div>
          )}
          {tabIndex === 2 && (
            <div className="px-0 py-2 sm:p-4 md:p-7">
              <Tradetable rows={tradeTableData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackTestOutput;
