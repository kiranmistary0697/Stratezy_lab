/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import Badge from "../../common/Badge";
import useDateTime from "../../hooks/useDateTime";
import ActionButton from "../ActionButton";

const Row = ({ label, value }) => (
  <Grid
    container
    alignItems="flex-start"
    sx={{ fontFamily: "Inter, sans-serif", mb: 1 }}
  >
    <Grid
      sx={{
        width: "140px",
        display: "flex",
        alignItems: "start",
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          flex: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textAlign: "left", // Right-align labels for better colon alignment
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          marginLeft: "4px", // Small space before colon
        }}
      >
        :
      </Typography>
    </Grid>

    <Grid
      sx={{
        width: "150px",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: "#666666",
          marginLeft: "8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Grid>
  </Grid>
);

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
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
      <Card
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter",
        }}
      >
        <CardContent sx={{ fontFamily: "Inter" }}>
          {/* Header: Strategy Name and Version */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: "Inter" }}
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
              <Row
                label="Created At:"
                value={useDateTime(row?.executionTime)}
              />
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
                value={
                  row?.maxDrawdown ? Number(row.maxDrawdown).toFixed(2) : 0
                }
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
                value={
                  row.sharpeRatio ? Number(row.sharpeRatio).toFixed(2) : "0"
                }
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
    </div>
  );
};

export default BacktestCard;
