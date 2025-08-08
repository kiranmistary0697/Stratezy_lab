import { useEffect, useRef, useState } from "react";

import BacktestHeader from "./BacktestHeader";
import BacktestTable from "./BacktestTable";

import { Box } from "@mui/material";
import useLabTitle from "../../hooks/useLabTitle";

import { useDispatch } from "react-redux";
import { useDeleteMutation, useLazyGetQuery } from "../../../slices/api";
import { setBacktestData } from "../../../slices/page/reducer";
import { tagTypes } from "../../tagTypes";
import { CSVLink } from "react-csv";

const Backtest = () => {
  const [rows, setRows] = useState([]);
  const [seletedRows, setSeletedRows] = useState([]);
  const [isMultideleteOpen, setIsMultideleteOpen] = useState(false);
  const [isRowSelectionEnabled, setIsRowSelectionEnabled] = useState(false);

  const csvLink = useRef(null);
  const dispatch = useDispatch();
  const [deleteMultipleData] = useDeleteMutation();

  const [
    getBackTestData,
    { data: { data: backtestData = [] } = {}, isLoading },
  ] = useLazyGetQuery();

  useEffect(() => {
    if (backtestData?.length) {
      const sorted = [...backtestData].sort(
        (a, b) => new Date(b.executionTime) - new Date(a.executionTime)
      );
      setRows(sorted);
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

  const confirmMultiDelete = async () => {
    try {
      await deleteMultipleData({
        endpoint: "command/backtest/deletelist",
        payload: seletedRows,
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();
      setSeletedRows([]);
      setIsMultideleteOpen(false);
      setIsRowSelectionEnabled(false);
      fetchAllData();
    } catch (error) {
      console.error("Delete failed:", error);
      setIsMultideleteOpen(false);
      setIsRowSelectionEnabled(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const csvHeaders = [
    { label: "requestId ID", key: "requestId" },
    { label: "name", key: "name" },
    { label: "version", key: "version" },
    { label: "executionTime", key: "executionTime" },
    { label: "startDate", key: "startDate" },
    { label: "endDate", key: "endDate" },
    { label: "initialCapital", key: "initialCapital" },
    { label: "currentCapital", key: "currentCapital" },
    { label: "netProfit", key: "netProfit" },
    { label: "avgAnnualProfitt", key: "avgAnnualProfit" },
    { label: "avgProfitPerTrade", key: "avgProfitPerTrade" },
    { label: "maxAccountValue", key: "maxAccountValue" },
    { label: "maxDrawdown", key: "maxDrawdown" },
    { label: "expectancy", key: "expectancy" },
    { label: "sharpeRatio", key: "sharpeRatio" },
    { label: "sqn", key: "sqn" },
    { label: "completed", key: "completed" },
    { label: "description", key: "description" },
  ];

  // Data to export in CSV (use your rows state)
  const csvReport = {
    data: rows || [],
    headers: csvHeaders,
    filename: "Backtest_data.csv",
    separator: ",",
    wrapolumnhar: '"',
  };

  // Ref to hidden CSVLink

  const handleCSVDownload = () => {
    if (csvLink.current) {
      csvLink.current.link.click();
    }
  };

  useLabTitle("Backtest");
  return (
    <div className="sm:h-[calc(100vh-100px)] overflow-auto">
      <CSVLink
        {...csvReport}
        className="hidden"
        ref={csvLink}
        target="_blank"
      />

      <div className=" h-full space-y-4 p-8">
        {/* Added px-4 for side padding */}
        <BacktestHeader
          className="my-[-30px]"
          fetchAllData={fetchAllData}
          handleCSVDownload={handleCSVDownload}
          seletedRows={seletedRows}
          handleBacktestDelete={() => setIsMultideleteOpen(true)}
        />
        {/* Applied -30px margin on top and bottom */}
        <Box>
          <BacktestTable
            isLoading={isLoading}
            fetchAllData={fetchAllData}
            rows={rows}
            seletedRows={seletedRows}
            setSeletedRows={setSeletedRows}
            confirmMultiDelete={confirmMultiDelete}
            isMultideleteOpen={isMultideleteOpen}
            isRowSelectionEnabled={isRowSelectionEnabled}
            setIsRowSelectionEnabled={setIsRowSelectionEnabled}
            setIsMultideleteOpen={setIsMultideleteOpen}
          />
        </Box>
      </div>
    </div>
  );
};

export default Backtest;
