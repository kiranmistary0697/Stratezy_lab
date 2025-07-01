import React from "react";
import useDateTime from "../../../hooks/useDateTime";
import useTimeFormat from "../../../hooks/useTimeFormat";

const Output = ({ summary, data }) => {
  const formattedDateTime = useDateTime(data?.executionTime);

  const timeTaken = summary["Time taken(ms)"];
  const formattedTime = useTimeFormat(timeTaken);

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-y-2 text-sm text-gray-900">
      <span className="font-semibold whitespace-nowrap">Backtest Period</span>
      <span className="text-[#666666]">
        {" "}
        {`${data?.startDate} to ${data?.endDate} `}
      </span>

      <span className="font-semibold whitespace-nowrap">Start Capital</span>
      <span className="text-[#666666]">{summary["Start Capital"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap">Net Profit</span>
      <span className="text-[#666666]">{summary["Net profit"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap">
        Current Account Value
      </span>
      <span className="text-[#666666]">
        {summary["Current Account Value"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">Max Account Value</span>
      <span className="text-[#666666]">
        {summary["Max account val"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">Executed On</span>
      <span className="text-[#666666]">{formattedDateTime}</span>

      <span className="font-semibold whitespace-nowrap">Execution Time</span>
      <span className="text-[#666666]">{formattedTime}</span>

      <span className="font-semibold whitespace-nowrap">Tested Markets</span>
      <span className="text-[#666666]">
        {summary['"exchange"']?.replace(/"/g, "").replace(",", "") || "N/A"}
      </span>

      <span className="font-semibold whitespace-nowrap">
        Invested principal
      </span>
      <span className="text-[#666666]">
        {summary["Invested principal"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap"> Min account val</span>
      <span className="text-[#666666]">
        {summary["Min account val"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">
        Uninvested capital
      </span>
      <span className="text-[#666666]">
        {summary["Uninvested capital"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">Net booked profit</span>
      <span className="text-[#666666]">
        {summary["Net booked profit"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap"> Avg profit/trade</span>
      <span className="text-[#666666]">
        {summary["avg profit/trade"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">Avg annual profit</span>
      <span className="text-[#666666]">
        {summary["avg annual profit"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap"> Avg accuracy</span>
      <span className="text-[#666666]">{summary["avg accuracy"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap"> Expectancy</span>
      <span className="text-[#666666]">{summary["expectancy"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap"> Stddev of R</span>
      <span className="text-[#666666]">{summary["stddev of R"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap"> SQN</span>
      <span className="text-[#666666]">{summary["SQN"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap"> Max Drawdown </span>
      <span className="text-[#666666]">{summary["Max Drawdown"] || "-"}</span>

      <span className="font-semibold whitespace-nowrap">
        Average Duration/trade
      </span>
      <span className="text-[#666666]">
        {summary["Average Duration/trade"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">
        {" "}
        Max number of Open Trades
      </span>
      <span className="text-[#666666]">
        {summary["Max number of Open Trades"] || "-"}
      </span>

      <span className="font-semibold whitespace-nowrap">
        Total number of trades
      </span>
      <span className="text-[#666666]">
        {summary["Total number of trades"] || "-"}
      </span>
    </div>
  );
};

export default Output;
