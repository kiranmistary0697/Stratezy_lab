import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BacktestDetailHeader from "./BacktestDetailHeader";
import { Divider } from "@mui/material";
import BacktestTimeLine from "./BacktestTimeLine";
import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import { useSelector } from "react-redux";

const BacktestDetail = () => {
  const navigate = useNavigate();

  const { backTestData } = useSelector((state) => ({
    backTestData: state.Stock.backTestData,
  }));

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategyName = queryParams.get("name");
  const id = queryParams.get("id");
  const [requestData, setRequestData] = useState({});
  const [getRequestId] = useLazyGetQuery();

  useEffect(() => {
    if (requestData?.status === "COMPLETED") {
      const t = setTimeout(() => {
        navigate(`/Backtest/backtest-output?id=${id}&name=${strategyName}`);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [requestData, id, strategyName, navigate]);

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
    } catch (_) {}
  };

  useEffect(() => {
    if (id) handleRequestId();
  }, [id]);

  return (
    // Outer wrapper just sets height and padding; DO NOT scroll here
    <div className="h-[calc(100svh-100px)] bg-[#f0f0f0] overflow-hidden p-4 sm:p-8">
      {/* Make the CARD the single scroll container */}
      <div
        className="bg-white h-full rounded-lg flex flex-col overflow-y-auto min-h-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Non-scrolling header area should not collapse height */}
        <div className="shrink-0">
          <BacktestDetailHeader
            // remove negative margins that can clip the scroll area
            className="my-0"
            data={backTestIdData}
            id={id}
            requestData={requestData}
            handleRequestId={handleRequestId}
          />
          <Divider orientation="horizontal" sx={{ width: "100%" }} />
        </div>

        {/* Scroll content grows; avoid nested scrolling here */}
        <div className="flex-1 min-h-0 flex justify-center items-start sm:items-center px-2 sm:px-4 py-4">
          {/* Prevent horizontal overflow from wide children */}
          <div className="w-full min-w-0 max-w-full sm:max-w-3xl lg:max-w-5xl">
            <BacktestTimeLine backtestProcess={requestData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestDetail;
