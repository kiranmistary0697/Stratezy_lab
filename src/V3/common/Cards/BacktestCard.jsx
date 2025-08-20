/* eslint-disable react/prop-types */
import { Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import ActionMenu from "../../common/DropDownButton";
import Badge from "../../common/Badge";
import useDateTime from "../../hooks/useDateTime";

const BacktestCard = ({
  row,
  handleRowClick,
  onDeploy,
  onDelete,
  extractSummaryMetrics,
  handleStrategyRowClick,
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
        cursor: "pointer",
      }}
      onClick={() => handleRowClick(row)}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header: Strategy Name and Version */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
              color: "#3D69D3",
            }}
            onClick={onNameClick}
            title={row.name}
          >
            {row.name}
          </Typography>
          <Badge variant="version">{row.version || "v1"}</Badge>
        </Box>

        <Typography variant="body2" color="textSecondary" mt={1}>
          Requested ID: {row?.requestId}
        </Typography>

        <Typography variant="body2" color="textSecondary" mt={1}>
          Created At: {useDateTime(row?.executionTime)}
        </Typography>

        <Box
          sx={{ mt: 1, display: "inline-flex", alignItems: "center", gap: 1 }}
        >
          <Typography variant="body2" color="textSecondary" mt={1}>
            Status:
          </Typography>
          <Badge variant={status.toLowerCase()} isSquare>
            <Typography
              sx={{
                fontFamily: "Inter",
                letterSpacing: "0%",
                color: status === "Failed" ? "red" : "inherit",
              }}
            >
              {status}
            </Typography>
          </Badge>
        </Box>

        {/* Backtest Key Metrics */}
        <Box
          sx={{
            mt: 1,
            fontFamily: "Inter",
            fontSize: "12px",
            color: "#666666",
          }}
        >
          <Typography noWrap>
            Time Frame: {row.startDate} to {row.endDate}
          </Typography>
          <Typography noWrap>Initial Capital: {row.initialCapital}</Typography>
          <Typography noWrap>
            Net Profit: {row.netProfit ? Number(row.netProfit).toFixed(2) : 0}
          </Typography>
          <Typography noWrap>
            Max Drawdown:{" "}
            {row?.maxDrawdown ? Number(row.maxDrawdown).toFixed(2) : 0}
          </Typography>
          <Typography noWrap>
            Max Account Value:{" "}
            {row?.maxAccountValue ? Number(row.maxAccountValue).toFixed(2) : 0}
          </Typography>
          <Typography noWrap>
            Average profit/trade:{" "}
            {row?.avgProfitPerTrade
              ? Number(row.avgProfitPerTrade).toFixed(2)
              : 0}
          </Typography>
          <Typography noWrap>
            Expectancy:{" "}
            {row?.expectancy ? Number(row.expectancy).toFixed(2) : 0}
          </Typography>
          <Typography noWrap>
            Sharpe Ratio:{" "}
            {row.sharpeRatio ? Number(row.sharpeRatio).toFixed(2) : "0"}
          </Typography>
          <Typography noWrap>
            SQN: {row.sqn ? Number(row.sqn).toFixed(2) : "0"}
          </Typography>
          <Typography noWrap>
            Avg Annual Profit:{" "}
            {row.avgAnnualProfit ? Number(row.avgAnnualProfit).toFixed(2) : "0"}
          </Typography>
          <Typography noWrap>
            Total Trades: {backtestSummary["Total number of trades"] || "0"}
          </Typography>
        </Box>
      </CardContent>

      {/* Card Actions - 3 dot menu */}
      <CardActions sx={{ justifyContent: "flex-end", px: 2, pt: 0, pb: 1 }}>
        <Box
          onClick={(e) => e.stopPropagation()} // Prevent card click navigation on menu click
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ActionMenu
            formik={row}
            id={row.name}
            name={row.name}
            isDeleteButton
            isDuplicateButton
            isDeployStrategy={status === "Complete"}
            handleDelete={onDelete}
            handleEdit={() => {
              // You can provide your edit handler here or pass as prop and call it
            }}
            handleDeploy={onDeploy}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default BacktestCard;
