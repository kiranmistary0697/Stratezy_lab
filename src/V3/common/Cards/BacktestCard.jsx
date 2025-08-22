/* eslint-disable react/prop-types */
import { Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import Badge from "../../common/Badge";
import useDateTime from "../../hooks/useDateTime";
import ActionButton from "../ActionButton";

const Row = ({ label, value }) => {
  return (
    <div
      className="flex gap-2 items-start"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <span className="font-semibold text-gray-900 whitespace-nowrap">
        {label}
      </span>
      <span className="text-[#666666] break-words">{value ?? "-"}</span>
    </div>
  );
};

const BacktestCard = ({
  row,
  onDeploy,
  onDelete,
  extractSummaryMetrics,
  handleStrategyRowClick,
  onBacktestClick,
}) => {
  const summary = row?.summary || "";
  const status = summary.includes("still running")
    ? "In Progress"
    : summary.includes("Backtest summary for")
    ? "Complete"
    : "Failed";

  const backtestSummary = extractSummaryMetrics(summary);

  // Stop propagation on name click to prevent card click navigation
  const onNameClick = (e) => {
    e.stopPropagation();
    handleStrategyRowClick({ row });
  };

  return (
    <Card
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        {/* Header: Strategy Name and Version */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            fontWeight="600"
            onClick={onNameClick}
            title={row.name}
          >
            {row.name}
          </Typography>
          <Badge variant="version">{row.version || "v1"}</Badge>
        </Box>

        <Box
          className="space-y-4 p-3 sm:p-4 overflow-auto"
          onClick={(e) => {
            e.preventDefault();
            onBacktestClick(row);
          }}
        >
          <Box className="flex flex-col gap-1 text-sm text-gray-900">
            <Row label="Requested ID:" value={row?.requestId} />
            <Row label="Created At:" value={useDateTime(row?.executionTime)} />
            <Row
              label="Status:"
              value={
                <Badge variant={status?.toLowerCase() || "default"}>
                  {status || "-"}
                </Badge>
              }
            />
            <Row
              label="Time Frame:"
              value={`${row.startDate} to ${row.endDate}`}
            />
            <Row label="Initial Capital:" value={row.initialCapital} />
            <Row
              label="Net Profit:"
              value={row.netProfit ? Number(row.netProfit).toFixed(2) : 0}
            />
            <Row
              label="Max Drawdown:"
              value={row?.maxDrawdown ? Number(row.maxDrawdown).toFixed(2) : 0}
            />
            <Row
              label="Max Account Value:"
              value={
                row?.maxAccountValue
                  ? Number(row.maxAccountValue).toFixed(2)
                  : 0
              }
            />
            <Row
              label="Average profit/trade:"
              value={
                row?.avgProfitPerTrade
                  ? Number(row.avgProfitPerTrade).toFixed(2)
                  : 0
              }
            />
            <Row
              label="Expectancy:"
              value={row?.expectancy ? Number(row.expectancy).toFixed(2) : 0}
            />
            <Row
              label="Sharpe Ratio:"
              value={row.sharpeRatio ? Number(row.sharpeRatio).toFixed(2) : "0"}
            />
            <Row
              label="SQN:"
              value={row.sqn ? Number(row.sqn).toFixed(2) : "0"}
            />
            <Row
              label="Avg Annual Profit:"
              value={
                row.avgAnnualProfit
                  ? Number(row.avgAnnualProfit).toFixed(2)
                  : "0"
              }
            />
            <Row
              label="Total Trades:"
              value={backtestSummary["Total number of trades"] || "0"}
            />
          </Box>
        </Box>
      </CardContent>

      {/* Card Actions - 3 dot menu */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box sx={{ display: "flex", gap: 1, marginBottom: 2, marginLeft: 1 }}>
          <ActionButton
            action="Deploy"
            label="Deploy"
            disabled={status === "Failed"}
            iconClass="ri-rocket-line"
            textColor="#3D69D3"
            onClick={(e) => {
              e.preventDefault();
              onDeploy();
            }}
          />
          <ActionButton
            action="Delete"
            label="Delete"
            disabled={false}
            iconClass="ri-rocket-line"
            textColor="red"
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default BacktestCard;
