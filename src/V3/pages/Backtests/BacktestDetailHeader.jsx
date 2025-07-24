import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { CSVLink } from "react-csv";

import HeaderButton from "../../common/Table/HeaderButton";
import Badge from "../../common/Badge";

import RunBacktest from "../Strategies/Modal/RunBacktest";
import CreateDeploy from "../Deploy/DeployModal/CreateDeploy";
import moment from "moment";

const initialBrokerageList = [
  { name: "Zerodha" },
  { name: "Upstox" },
  { name: "Angel One" },
];

const BacktestDetailHeader = ({
  tab = {},
  csvData = [],
  data,
  requestData,
  handleRequestId = () => {},
}) => {
  const combinedArrayWithId = csvData.flat().map((item, index) => ({
    id: index,
    ...item,
  }));

  const csvLink = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBacktest, setIsOpenBacktest] = useState(false);
  const [selectedBrokerage, setSelectedBrokerage] =
    useState(initialBrokerageList);
  const [backTest, setBackTest] = useState({});
  const [selectedStock, setSelectedStock] = useState(backTest.strategyName);

  const triggerDownload = () => {
    if (csvLink.current) {
      csvLink.current.link.click();
    }
  };

  useEffect(() => {
    const fetchInterval = setInterval(() => {
      if (requestData?.status === "PENDING") {
        handleRequestId();
      }
    }, 30000);

    return () => clearInterval(fetchInterval);
  }, []);

  return (
    <>
      {isOpenBacktest && (
        <RunBacktest
          isOpen={isOpenBacktest}
          handleClose={() => setIsOpenBacktest(false)}
          title="Run Backtest"
          strategyName={data?.name}
          defaultVersion={data?.version}
          demoStrategy={data?.demo?.toString()}
        />
      )}
      {isOpen && (
        <CreateDeploy
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          title="Deploy Strategy"
          buttonText="Deploy Strategy"
          setSelectedStock={setSelectedStock}
          selectedStock={selectedStock}
          selectedBrokerage={selectedBrokerage}
          setSelectedBrokerage={setSelectedBrokerage}
          deployStrategy={{
            name: data?.name,
            reqId: data?.requestId,
            version: data?.version,
          }}
          isBacktestDetail
        />
      )}

      <Box className="flex flex-col md:flex-row flex-wrap gap-6 p-4 w-full">
        {/* Strategy Info */}
        <Box className="flex flex-col gap-2 space-y-1 w-full md:w-auto">
          <Box className="flex flex-wrap items-center gap-2">
            <div className="text-xl font-semibold leading-tight text-neutral-950">
              {data?.name}
            </div>
            <Badge variant="version">{data?.version || "v1"}</Badge>
            <Badge
              variant={
                requestData?.status === "PENDING"
                  ? "in progress"
                  : requestData?.status?.toLowerCase()
              }
              isSquare
            >
              {requestData?.status === "PENDING"
                ? "In Progress"
                : requestData?.status
                ? requestData.status.charAt(0).toUpperCase() +
                  requestData.status.slice(1).toLowerCase()
                : ""}
            </Badge>
          </Box>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontSize: "16px",
              color: "#6B7280",
            }}
          >
            {data?.requestId}
          </Typography>
        </Box>

        {/* Capital & Timeframe */}
        <Box className="flex flex-col sm:flex-row gap-4 w-full md:flex-1 md:justify-start">
          <Box className="flex flex-col space-y-2 gap-1">
            <div className="font-semibold text-base text-neutral-950">
              ₹ {data?.initialCapital?.toLocaleString("en-IN")}
            </div>
            <Typography className="text-sm text-gray-500">Capital</Typography>
          </Box>
          <Box className="flex flex-col  space-y-2 gap-1">
            <div className="font-semibold text-base text-neutral-950">
              {`${moment(data?.startDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )} to ${moment(data?.endDate, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              )}`}
            </div>
            <Typography className="text-sm text-gray-500">Timeframe</Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto justify-end md:items-center">
          {data?.summary?.includes("Backtest summary for") ? (
            <>
              <HeaderButton
                variant="primary"
                onClick={() => setIsOpenBacktest(true)}
              >
                Re-Run
              </HeaderButton>
              <HeaderButton variant="contained" onClick={() => setIsOpen(true)}>
                Deploy Strategy
              </HeaderButton>
              {tab === 2 && csvData && (
                <>
                  <HeaderButton
                    variant="contained"
                    onClick={triggerDownload}
                    disabled={!combinedArrayWithId.length}
                  >
                    Download CSV
                  </HeaderButton>
                  <CSVLink
                    data={combinedArrayWithId}
                    filename={`${data?.name}_Trade_data.csv`}
                    separator={csvData.separator}
                    wrapcolumnchar={csvData.wrapColumnChar}
                    className="hidden"
                    ref={csvLink}
                    target="_blank"
                  />
                </>
              )}
            </>
          ) : (
            <HeaderButton variant="contained" onClick={handleRequestId}>
              Refresh
            </HeaderButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BacktestDetailHeader;
