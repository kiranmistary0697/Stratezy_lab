import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BacktestDetailHeader from "./BacktestDetailHeader";
import { Box, Divider, Grid2 } from "@mui/material";
import BacktestTimeLine from "./BacktestTimeLine";
import { backtestDemo } from "../../../../backtestdata";
import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import { useSelector } from "react-redux";

const BacktestDetail = () => {
  const navigate = useNavigate();

  const { backTestData } = useSelector((state) => ({
    backTestData: state.Stock.backTestData,
  }));

  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategyName = queryParams.get("name");
  const id = queryParams.get("id");
  const [requestData, setRequestData] = useState({});
  const [getRequestId] = useLazyGetQuery();

  const backTestIdData = backTestData?.data?.find(
    ({ requestId }) => requestId === id
  );

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
  return (
    <div className="h-[calc(100vh-100px)] bg-[#f0f0f0] overflow-auto p-4 sm:p-8">
      <div className="bg-white h-full flex flex-col">
        <BacktestDetailHeader
          className="-my-6 sm:my-[-30px]"
          data={backTestIdData}
          id={id}
          requestData={requestData}
          handleRequestId={handleRequestId}
        />

        <Divider orientation="horizontal" sx={{ width: "100%" }} />

        <div className="flex-1 flex justify-center items-start sm:items-center overflow-auto px-2 sm:px-4 py-4">
          <div className="w-full max-w-full sm:max-w-3xl lg:max-w-5xl">
            <BacktestTimeLine backtestProcess={requestData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestDetail;
