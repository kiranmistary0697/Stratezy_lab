/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ActionButton from "../ActionButton";

/* ------------------------ Number formatting helpers ----------------------- */

function parseNumericLike(val) {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val !== "string") return null;
  const s = val.trim();
  // Only accept "plain" numeric strings; otherwise treat as preformatted text
  if (!looksPlainNumericString(s)) return null;

  let n = Number(s);
  if (Number.isFinite(n)) return n;

  // As a fallback, strip spaces/commas only (not symbols) and try again
  const cleaned = s.replace(/[,\s]/g, "");
  n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Simple detector for plain numeric (with optional grouping/decimal/exponent). */
function looksPlainNumericString(s) {
  // Allows: 1,234.56  |  -1234.56e-3  |  +42  |  3. | .5 (last one excluded intentionally)
  // We’ll be conservative: require at least one digit before optional decimal.
  const re =
    /^[\s]*[+-]?(?:\d{1,3}(?:[,\s]\d{3})*|\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?[\s]*$/;
  return re.test(s);
}

/** Treat values like 1.0000000001 as integers within a small relative tolerance */
function isNearlyInteger(n, tol = 1e-9) {
  if (!Number.isFinite(n)) return false;
  const nearest = Math.round(n);
  const scale = Math.max(1, Math.abs(n));
  return Math.abs(n - nearest) <= tol * scale;
}

/**
 * Format numeric-like values.
 * - If the coerced number is (nearly) an integer and `integerNoDecimals` is true → 0 decimals
 * - Otherwise → `decimals` (default 2)
 * - Avoids scientific notation via Intl.NumberFormat `notation: "standard"`
 */
function formatMaybeNumber(
  val,
  { decimals = 2, integerNoDecimals = true, locale, useGrouping = false } = {}
) {
  const n = parseNumericLike(val);
  if (n == null) return val ?? "-";

  const fractionDigits =
    integerNoDecimals && isNearlyInteger(n) ? 0 : decimals;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    useGrouping,
    notation: "standard",
  }).format(n);
}

/* Only format when it's a number or a plain numeric string; otherwise keep the original string (preserves ₹, %, etc.) */
function formatDisplayValue(value, numberFormat) {
  if (value == null) return "-";
  if (typeof value === "number") return formatMaybeNumber(value, numberFormat);
  if (typeof value === "string") {
    return looksPlainNumericString(value)
      ? formatMaybeNumber(value, numberFormat)
      : value; // preformatted / has symbols → preserve
  }
  return value; // React nodes, etc.
}

/* ------------------------ Overflow detection hook ------------------------- */

function useIsOverflow(ref, deps = []) {
  const [overflow, setOverflow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const o =
        el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
      setOverflow(o);
    };

    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return overflow;
}

/* ---------------------------------- Row ----------------------------------- */
/**
 * overflowMode:
 *  - "auto" (default): desktop tooltip + mobile tap-to-expand
 *  - "ellipsis": single-line with ellipsis only
 *  - "wrap": always wrap fully
 *  - "clamp": clamp to N lines (controlled by clampLines)
 *  - "expand": tap-to-expand/collapse on all devices
 */
const Row = ({
  label,
  value,
  overflowMode = "auto",
  clampLines = 1, // used when mode = "clamp"
  formatNumbers = true,
  numberFormat = {
    decimals: 2,
    integerNoDecimals: true,
    useGrouping: false,
    locale: undefined,
  },
}) => {
  const isDesktop = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [expanded, setExpanded] = useState(false);
  const valueRef = useRef(null);

  const displayValue = useMemo(() => {
    return formatNumbers ? formatDisplayValue(value, numberFormat) : value ?? "-";
  }, [value, formatNumbers, numberFormat]);

  const showTooltipOnDesktop =
    (overflowMode === "auto" ||
      overflowMode === "ellipsis" ||
      overflowMode === "clamp") &&
    isDesktop &&
    !expanded &&
    (typeof displayValue === "string" || typeof displayValue === "number");

  const isClampMode = overflowMode === "clamp" && !expanded;
  const isWrapMode = overflowMode === "wrap" || expanded;

  const valueSx = useMemo(() => {
    const base = {
      fontFamily: "Inter",
      fontSize: "14px",
      color: "#666666",
      ml: "2px",
      minWidth: 0, // critical for ellipsis in grid/flex
    };

    if (isWrapMode) {
      return {
        ...base,
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        hyphens: "auto",
      };
    }
    if (isClampMode) {
      return {
        ...base,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: clampLines,
        WebkitBoxOrient: "vertical",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      };
    }
    // Default: single-line ellipsis
    return {
      ...base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
  }, [isWrapMode, isClampMode, clampLines]);

  const overflowing = useIsOverflow(valueRef, [
    displayValue,
    expanded,
    clampLines,
    overflowMode,
  ]);

  const showExpandControl =
    (overflowMode === "auto" && !isDesktop && overflowing) ||
    (overflowMode === "expand" && overflowing);

  const ValueTypography = (
    <Typography
      ref={valueRef}
      sx={valueSx}
      title={displayValue == null ? "-" : String(displayValue)}
    >
      {displayValue ?? "-"}
    </Typography>
  );

  // Normalize label text (stringify once), and make it WRAP (no ellipsis)
  const labelText = label == null ? "" : String(label).replace(/:\s*$/, "") + ":";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(84px, 42%) 1fr",
          sm: "minmax(120px, 35%) 1fr",
        },
        alignItems: "start",
        columnGap: 1,
        mb: 1,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Label (wraps) */}
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

      {/* Value + optional affordance */}
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        {showTooltipOnDesktop && overflowing ? (
          <Tooltip
            title={displayValue == null ? "-" : String(displayValue)}
            enterTouchDelay={50}
            leaveTouchDelay={2000}
          >
            {ValueTypography}
          </Tooltip>
        ) : (
          ValueTypography
        )}

        {showExpandControl && (
          <IconButton
            size="small"
            sx={{ ml: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((x) => !x);
            }}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

/* --------------------------------- Card ----------------------------------- */

const CommonCard = ({
  rows = {}, // { label: value, ... } or [{label, value}, ...]
  showDelete = false,
  onDelete = () => {},
  onRowClick = () => {},
  overflowMode = "auto", // "auto" | "ellipsis" | "wrap" | "clamp" | "expand"
  clampLines = 1, // used when overflowMode="clamp"
  formatNumbers = true,
  numberFormat = {
    decimals: 2,
    integerNoDecimals: true, // integers show no decimals
    useGrouping: false,
    locale: undefined,
  },
}) => {
  const entries = Array.isArray(rows)
    ? rows
    : Object.entries(rows).map(([label, value]) => ({ label, value }));

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
        }}
      >
        <CardContent>
          <Box
            className="space-y-2 p-2"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick();
            }}
          >
            {entries.map(({ label, value }, idx) => (
              <Row
                key={`${label}-${idx}`}
                label={label}
                value={value}
                overflowMode={overflowMode}
                clampLines={clampLines}
                formatNumbers={formatNumbers}
                numberFormat={numberFormat}
              />
            ))}
          </Box>
        </CardContent>

        {showDelete && (
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
          >
            <Box sx={{ display: "flex", gap: 1, mb: 2, ml: 1 }}>
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
        )}
      </Card>
    </div>
  );
};

export default CommonCard;
