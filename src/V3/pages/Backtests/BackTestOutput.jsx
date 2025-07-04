import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import NavigationTabs from "../Strategies/ViewStrategy/NavigationTabs";
import BacktestDetailHeader from "./BacktestDetailHeader";
import { Divider, Box, Grid2 } from "@mui/material";
import Output from "./BacktestTabs/Output";
import Visualisation from "./BacktestTabs/Visualisation";
import Tradetable from "./BacktestTabs/Tradetable";

import { useSelector } from "react-redux";
import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import BacktestTimeLine from "./BacktestTimeLine";

const BackTestOutput = () => {
  const { backTestData } = useSelector((state) => ({
    backTestData: state.Stock.backTestData,
  }));

  const [getTradeTable] = useLazyGetQuery();
  const [getRequestId] = useLazyGetQuery();

  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");

  const tradeTableRef = useRef(null); // Ref for TradeTable

  const [tabIndex, setTabIndex] = useState(0);
  const [csvData, setCsvData] = useState(null);
  const [tradeTableData, setTradeTableData] = useState([]);
  const [requestData, setRequestData] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data } = await getTradeTable({
          endpoint: `command/backtest/tradetable?id=${id}`,
          tags: [tagTypes.GET_TRADETABLE],
        }).unwrap();
        setTradeTableData(data);
      } catch (error) {
        console.error("Failed to fetch backtest data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleRequestId = async () => {
    try {
      const { data } = await getRequestId({
        endpoint: `command/backtest/status/${id}`,
        tags: [tagTypes.GET_BACKTESTREQUEST],
      }).unwrap();

      setRequestData(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      handleRequestId();
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

  const summaryData = extractSummaryMetrics(backTestIdData?.summary);

  // Function to update CSV data when switching tabs
  useEffect(() => {
    if (tabIndex === 2 && tradeTableRef.current) {
      setCsvData(tradeTableRef.current.getCSVData());
    }
  }, [tabIndex]);

  return (
    <div className="p-8 h-[calc(100vh-100px)] overflow-auto">
      <div className="bg-white flex flex-col border border-[#E0E1E4] h-full">
        {/* header */}
        <div>
          <BacktestDetailHeader
            tab={tabIndex}
            csvData={csvData}
            data={backTestIdData}
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
        <div className="flex-grow overflow-auto">
          {tabIndex === 0 && (
            <div className="p-8 space-y-4 ">
              <Grid2
                item
                size={{
                  xs: 12,
                  md: 6,
                  lg: 8,
                }}
              >
                <Output summary={summaryData} data={backTestIdData} />
              </Grid2>
            </div>
          )}
          {tabIndex === 1 && (
            <div className="p-8 space-y-4">
              <Grid2
                item
                size={{
                  xs: 12,
                  md: 6,
                  lg: 8,
                }}
              >
                <Visualisation id={id} />
              </Grid2>
            </div>
          )}
          {tabIndex === 2 && (
            <div className="p-7">
              <Tradetable ref={tradeTableRef} rows={tradeTableData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackTestOutput;
