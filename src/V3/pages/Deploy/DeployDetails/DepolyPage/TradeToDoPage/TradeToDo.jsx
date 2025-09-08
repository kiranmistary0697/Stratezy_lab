import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import TimeDisplay from "./TimeDisplay";
import StatusBadge from "./StatusBadge";
import HeaderButton from "../../../../../common/Table/HeaderButton";
import TradeToDoTable from "./TradeToDoTable";
import { CSVLink } from "react-csv";
import CustomDatePicker from "../../../../../common/CustomDatePicker";
import moment from "moment";
import { useLazyGetQuery, usePostMutation } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

const TradeToDo = ({ data = {} }) => {
  const { name, exchange, brokerage, deployedDate, version } = data;
  const [getMarkData] = useLazyGetQuery();
  const [completeMark] = usePostMutation();
  const [getTradeToDoData] = useLazyGetQuery();

  const [csvData, setCsvData] = useState(null);
  const csvLink = useRef(null);
  const tradeTableRef = useRef(null);
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));

  const [completedDates, setCompletedDates] = useState("");
  const [pendingDates, setPendingDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const triggerDownload = () => {
    if (tradeTableRef.current) {
      const next = tradeTableRef.current.getCSVData();
      setCsvData(next);
    }
    setTimeout(() => {
      csvLink.current?.link?.click();
    }, 0);
  };

  const fetchDeployAndTradeData = async () => {
    setLoading(true);
    try {
      const { data: completedDateStr } = await getMarkData({
        endpoint: `deploy/markcomplete?name=${name}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_MARKCOMPLETE],
      }).unwrap();

      const completedDate = moment(completedDateStr, "YYYY-MM-DD");
      const deployMoment = moment(deployedDate, "YYYY-MM-DD");

      const completedDatesArray = [];
      let temp = deployMoment.clone();
      while (temp.isSameOrBefore(completedDate)) {
        completedDatesArray.push(temp.format("YYYY-MM-DD"));
        temp.add(1, "day");
      }

      const today = moment();
      const pendingDatesArray = [];

      let nextDate = completedDate.clone().add(1, "day");
      while (nextDate.isSameOrBefore(today)) {
        pendingDatesArray.push(nextDate.format("YYYY-MM-DD"));
        nextDate.add(1, "day");
      }

      setCompletedDates(completedDatesArray);
      setPendingDates(pendingDatesArray);

      const { data: tradeData } = await getTradeToDoData({
        endpoint: `deploy/strategy/viewn?name=${name}&days=${pendingDatesArray.length}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_TRADETODO],
      }).unwrap();
      setTradeData(tradeData);
    } catch (error) {
      console.error("Failed in fetchDeployAndTradeData:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeployData = async () => {
    try {
      const { data } = await getTradeToDoData({
        endpoint: `deploy/strategy/viewn?name=${name}&days=${pendingDates?.length}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_TRADETODO],
      }).unwrap();
      setTradeData(data);
    } catch (error) {
      console.error("Failed to fetch deploy data:", error);
    }
  };

  const handleMarkComplete = async () => {
    const todayStr = moment().format("YYYY-MM-DD");

    try {
      const { data } = await completeMark({
        endpoint: `deploy/markcomplete?name=${name}&exchange=${exchange}&brokerage=${brokerage}&date=${todayStr}&version=${version}`,
        tags: [tagTypes.GET_MARKCOMPLETE],
      }).unwrap();

      const completedDate = moment(data, "YYYY-MM-DD");
      const today = moment();

      const completedDatesArray = [completedDate.format("YYYY-MM-DD")];
      const pendingDatesArray = [];

      let nextDate = completedDate.clone().add(1, "day");
      while (nextDate.isSameOrBefore(today)) {
        pendingDatesArray.push(nextDate.format("YYYY-MM-DD"));
        nextDate.add(1, "day");
      }

      setCompletedDates(completedDatesArray);
      setPendingDates(pendingDatesArray);

      await fetchDeployData();
      await fetchDeployAndTradeData();
    } catch (error) {
      console.error("Error marking date as complete:", error);
    }
  };

  useEffect(() => {
    fetchDeployAndTradeData();
  }, [name, exchange, brokerage, deployedDate]);

  useEffect(() => {
    if (pendingDates?.length) {
      fetchDeployData();
    }
  }, [pendingDates?.length]);

  useEffect(() => {
    if (tradeTableRef.current) {
      setCsvData(tradeTableRef.current.getCSVData());
    }
  }, [tradeData]);

  return (
    <Box className="flex flex-col gap-3.5 space-y-2 w-full max-md:gap-3 max-md:p-4 max-sm:gap-2.5 max-sm:p-2.5">
      <Typography
        sx={{
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#0A0A0A",
        }}
      >
        Trades to-dos from
      </Typography>

      <Box className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        {/* Left side - Date + Badge */}
        <div className="flex flex-col sm:flex-row  sm:items-center gap-3 flex-wrap">
          <CustomDatePicker
            value={startDate}
            onChange={(val) => setStartDate(val)}
            isShowPending
            pendingDates={pendingDates}
            completedDates={completedDates}
            isView
          />

          <div className="inline-flex gap-1.5 items-center px-4 py-2.5 rounded-sm border border-zinc-200 !h-[45px] w-auto">
            <TimeDisplay days={pendingDates?.length} />
            {pendingDates?.length > 0 && (
              <div className="flex gap-2 items-center">
                <StatusBadge status="Pending" />
              </div>
            )}
          </div>
        </div>

        {/* Right side - Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full md:w-auto">
          <HeaderButton
            variant="outlined"
            onClick={triggerDownload}
            className="w-full sm:w-auto"
          >
            Download CSV
          </HeaderButton>

          {csvData && (
            <CSVLink
              data={csvData?.data}
              filename={`${name}_Trade_to_do_data.csv`}
              separator={csvData?.separator}
              wrapcolumnchar={csvData?.wrapColumnChar}
              className="hidden"
              ref={csvLink}
              target="_blank"
            />
          )}

          <HeaderButton
            variant={!pendingDates?.length ? "greenContained" : "contained"}
            onClick={handleMarkComplete}
            className="w-full sm:w-auto"
          >
            Mark Complete
          </HeaderButton>
        </div>
      </Box>

      <TradeToDoTable
        ref={tradeTableRef}
        data={data}
        tradeData={tradeData}
        isLoading={loading}
      />
    </Box>
  );
};

export default TradeToDo;
