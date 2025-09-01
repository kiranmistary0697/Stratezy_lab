/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import Badge from "../../common/Badge";
import useDateTime from "../../hooks/useDateTime";
import ActionButton from "../ActionButton";

/* ------------------------ Number formatting helpers ----------------------- */
function parseNumericLike(val) {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val !== "string") return null;
  const s = val.trim();
  let n = Number(s);
  if (Number.isFinite(n)) return n;
  const cleaned = s.replace(/[, ]/g, "").replace(/[^\d.eE+\-]/g, "");
  n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
function isNearlyInteger(n, tol = 1e-9) {
  if (!Number.isFinite(n)) return false;
  const nearest = Math.round(n);
  const scale = Math.max(1, Math.abs(n));
  return Math.abs(n - nearest) <= tol * scale;
}
function formatMaybeNumber(
  val,
  { decimals = 2, integerNoDecimals = true, locale, useGrouping = false } = {}
) {
  const n = parseNumericLike(val);
  if (n == null) return val ?? "-";
  const fractionDigits = integerNoDecimals && isNearlyInteger(n) ? 0 : decimals;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping,
    notation: "standard",
  }).format(n);
}
function formatMaybeCurrency(
  val,
  fmt = {},
  { symbol = "₹", space = false } = {}
) {
  const n = parseNumericLike(val);
  if (n == null) return val ?? "-";
  const sign = n < 0 ? "-" : "";
  const absStr = formatMaybeNumber(Math.abs(n), fmt);
  return `${sign}${symbol}${space ? " " : ""}${absStr}`;
}

/* ---------------------------------- Row ----------------------------------- */
/** Both columns wrap; value stays aligned under its own column. */
const Row = ({
  label,
  value,
  currencySymbol, // e.g., "₹" to show currency; omit for plain numbers
  formatNumbers = true,
  numberFormat = {
    decimals: 2,
    integerNoDecimals: true,
    useGrouping: false,
    locale: undefined,
  },
}) => {
  const displayContent = useMemo(() => {
    // Non-primitive values (e.g., <Badge/>) are rendered as-is
    if (!formatNumbers || (typeof value !== "number" && typeof value !== "string"))
      return value ?? "-";

    return currencySymbol
      ? formatMaybeCurrency(value, numberFormat, { symbol: currencySymbol })
      : formatMaybeNumber(value, numberFormat);
  }, [value, formatNumbers, numberFormat, currencySymbol]);

  const isText =
    typeof displayContent === "string" || typeof displayContent === "number";
  const labelText = label == null ? "" : String(label);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(110px, 42%) 1fr",
          sm: "minmax(140px, 35%) 1fr",
        },
        alignItems: "start",
        columnGap: 1,
        mb: 1,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Label wraps */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            fontWeight: 600,
            color: "#111827",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
          title={labelText}
        >
          {labelText}:
        </Typography>
      </Box>

      {/* Value wraps */}
      <Box sx={{ minWidth: 0 }}>
        {isText ? (
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "14px",
              color: "#666666",
              ml: "2px",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
            title={String(displayContent)}
          >
            {displayContent ?? "-"}
          </Typography>
        ) : (
          <Box sx={{ ml: "2px" }}>{displayContent}</Box>
        )}
      </Box>
    </Box>
  );
};

/* ------------------------------- BacktestCard ------------------------------ */
const BacktestCard = ({
  row,
  onDeploy,
  onDelete,
  extractSummaryMetrics,
  handleStrategyRowClick,
  onBacktestClick,
  // Optional: number format overrides
  numberFormat = {
    decimals: 2,
    integerNoDecimals: true,
    useGrouping: true,   // enable grouping by default; set false if you don't want it
    locale: "en-IN",     // Indian grouping by default; change if needed
  },
}) => {
  const summary = row?.summary || "";
  const status = summary.includes("still running")
    ? "In Progress"
    : summary.includes("Backtest summary for")
    ? "Complete"
    : "Failed";

  const backtestSummary = extractSummaryMetrics(summary);

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
          maxWidth: "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter",
        }}
      >
        <CardContent sx={{ fontFamily: "Inter" }}>
          {/* Header */}
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
              <Row label="Requested ID" value={row?.requestId} numberFormat={numberFormat} />
              <Row
                label="Created At"
                value={useDateTime(row?.executionTime)}
                formatNumbers={false}
              />
              <Row
                label="Status"
                value={<Badge variant={status?.toLowerCase() || "default"}>{status || "-"}</Badge>}
                formatNumbers={false}
              />
              <Row
                label="Time Frame"
                value={`${row.startDate} to ${row.endDate}`}
                formatNumbers={false}
              />

              {/* Currency fields */}
              <Row
                label="Initial Capital"
                value={row.initialCapital ?? 0}
                currencySymbol="₹"
                numberFormat={numberFormat}
              />
              <Row
                label="Net Profit"
                value={row.netProfit ?? 0}
                currencySymbol="₹"
                numberFormat={numberFormat}
              />
              <Row
                label="Max Account Value"
                value={row.maxAccountValue ?? 0}
                currencySymbol="₹"
                numberFormat={numberFormat}
              />

              {/* Other numeric fields (no currency) */}
              <Row label="Max Drawdown" value={row.maxDrawdown ?? 0} numberFormat={numberFormat} />
              <Row label="Average profit/trade" value={row.avgProfitPerTrade ?? 0} numberFormat={numberFormat} />
              <Row label="Expectancy" value={row.expectancy ?? 0} numberFormat={numberFormat} />
              <Row label="Sharpe Ratio" value={row.sharpeRatio ?? 0} numberFormat={numberFormat} />
              <Row label="SQN" value={row.sqn ?? 0} numberFormat={numberFormat} />
              <Row label="Avg Annual Profit" value={row.avgAnnualProfit ?? 0} numberFormat={numberFormat} />
              <Row
                label="Total Trades"
                value={backtestSummary["Total number of trades"] || 0}
                numberFormat={numberFormat}
              />
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2, ml: 1 }}>
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
