/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import Badge from "../../common/Badge";
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
  { decimals = 2, integerNoDecimals = true, locale, useGrouping = true } = {}
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
    useGrouping: true,
    locale: "en-IN",
  },
}) => {
  // Normalize label to have exactly one trailing colon
  const labelText = (() => {
    const s = label == null ? "" : String(label);
    return s.replace(/:\s*$/, "") + ":";
  })();

  const displayContent = useMemo(() => {
    // Non-primitive (e.g., <Badge/>) -> render as-is
    if (!formatNumbers || (typeof value !== "number" && typeof value !== "string"))
      return value ?? "-";

    return currencySymbol
      ? formatMaybeCurrency(value, numberFormat, { symbol: currencySymbol })
      : formatMaybeNumber(value, numberFormat);
  }, [value, formatNumbers, numberFormat, currencySymbol]);

  const isText =
    typeof displayContent === "string" || typeof displayContent === "number";

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
          {labelText}
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

/* --------------------------------- DeployCard ------------------------------ */
const DeployCard = ({
  row = {},
  handleActivate = () => {},
  handleDelete = () => {},
  onCardClick = () => {},
  onNameClick = () => {},
  // Optional number format defaults (Indian grouping)
  numberFormat = {
    decimals: 2,
    integerNoDecimals: true,
    useGrouping: true,
    locale: "en-IN",
  },
}) => {
  const {
    name,
    version = "v1",
    deployedDate,
    dataDate,
    state,
    brokerage,
    initialCapital,
    currentCapital,
    avgAnProfit,
    avgProfitPerTrade,
    maxDrawdown,
    netProfit,
    exchange,
    active,
  } = row;

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
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNameClick();
              }}
              title={name}
              sx={{ cursor: "pointer", fontFamily: "Inter" }}
            >
              {name || "-"}
            </Typography>
            <Badge variant="version">{version}</Badge>
          </Box>

          <Box
            className="space-y-2 p-3 sm:p-4 overflow-auto"
            onClick={(e) => {
              e.preventDefault();
              onCardClick();
            }}
            sx={{ cursor: "pointer", fontFamily: "Inter" }}
          >
            <Row label="Strategy Name" value={name} numberFormat={numberFormat} />
            <Row label="Deployed On" value={deployedDate} formatNumbers={false} />
            <Row label="Date" value={dataDate} formatNumbers={false} />
            <Row
              label="Status"
              value={<Badge variant={state?.toLowerCase() || "default"}>{state || "-"}</Badge>}
              formatNumbers={false}
            />
            <Row label="Brokerage" value={brokerage} formatNumbers={false} />

            {/* Currency fields */}
            <Row
              label="Initial Capital"
              value={initialCapital ?? 0}
              currencySymbol="₹"
              numberFormat={numberFormat}
            />
            <Row
              label="Current Capital"
              value={currentCapital ?? 0}
              currencySymbol="₹"
              numberFormat={numberFormat}
            />
            <Row
              label="Net Profit"
              value={netProfit ?? 0}
              currencySymbol="₹"
              numberFormat={numberFormat}
            />

            {/* Other numeric fields (plain numbers) */}
            <Row label="Avg Annual Profit (%)" value={avgAnProfit ?? 0} numberFormat={numberFormat} />
            <Row
              label="Average Profit Per Trade (%)"
              value={avgProfitPerTrade ?? 0}
              numberFormat={numberFormat}
            />
            <Row label="Max Drawdown (%)" value={maxDrawdown ?? 0} numberFormat={numberFormat} />
            <Row label="Exchange" value={exchange} formatNumbers={false} />
          </Box>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Box sx={{ display: "flex", gap: 1, m: 1 }}>
            <ActionButton
              action="Backtest"
              label={active === "Yes" ? "De-activate" : "Activate"}
              textColor={active === "Yes" ? "#CD3D64" : "#3D69D3"}
              iconClass="ri-play-line"
              onClick={(e) => {
                e.stopPropagation();
                handleActivate();
              }}
            />
            <ActionButton
              action="Delete"
              label="Delete"
              textColor="red"
              iconClass="ri-play-line"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
          </Box>
        </CardActions>
      </Card>
    </div>
  );
};

export default DeployCard;
