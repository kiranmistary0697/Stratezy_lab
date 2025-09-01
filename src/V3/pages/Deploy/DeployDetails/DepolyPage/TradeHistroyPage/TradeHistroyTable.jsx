/* eslint-disable react/display-name */
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Pagination,
  Popover,
  Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { tagTypes } from "../../../../../tagTypes";
import { useLazyGetQuery } from "../../../../../../slices/api";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CommonCard from "../../../../../common/Cards/CommonCard";

/* ---------- text style for table cells ---------- */
const tableTextSx = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0%",
  color: "#666666",
  display: "flex",
  alignItems: "center",
  height: "100%",
};

/* ---------- filter modal style (unchanged) ---------- */
const useStyles = makeStyles({
  filterModal: {
    "& .MuiDataGrid-filterPanel": { display: "none" },
    "& .MuiDataGrid-filterPanelColumn": { display: "none" },
    "& .MuiDataGrid-filterPanelOperator": { display: "none" },
  },
});

/* ===================== number/currency helpers ===================== */
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
  { decimals = 2, integerNoDecimals = true, useGrouping = true, locale = "en-IN" } = {}
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
  fmt = { decimals: 2, integerNoDecimals: true, useGrouping: true, locale: "en-IN" },
  { symbol = "₹", space = false } = {}
) {
  const n = parseNumericLike(val);
  if (n == null) return val ?? "-";
  const sign = n < 0 ? "-" : "";
  const absStr = formatMaybeNumber(Math.abs(n), fmt);
  return `${sign}${symbol}${space ? " " : ""}${absStr}`;
}

/* ===================== component ===================== */
const TradeHistroyTable = forwardRef((props, ref) => {
  const { data, query, setCsvData } = props;
  const { reqId } = data;
  const classes = useStyles();
  const [getTradeHistroy] = useLazyGetQuery();

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const stored = localStorage.getItem("hiddenColumnsTradeHistoryTable");
      const parsed = stored
        ? JSON.parse(stored)
        : ["risk1R", "duration", "annualPrf", "closeReason", "maxPrf"];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return ["risk1R", "duration", "annualPrf", "closeReason", "maxPrf"];
    }
  });

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("tradeHistoryTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch {
      return {};
    }
  });

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePopoverOpen = (event, type) => {
    event.stopPropagation();
    setPopoverAnchor(event.currentTarget);
    setActiveFilter(type);
  };
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setActiveFilter(null);
  };

  const handleColumnToggle = (field) => {
    setHiddenColumns((prev) => {
      const updatedColumns = prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field];
      localStorage.setItem("hiddenColumnsTradeHistoryTable", JSON.stringify(updatedColumns));
      return updatedColumns;
    });
  };

  useEffect(() => {
    const fetchDeployData = async () => {
      setLoading(true);
      try {
        const { data } = await getTradeHistroy({
          endpoint: `command/backtest/tradetable?id=${reqId}`,
          tags: [tagTypes.GET_TRADETABLE],
        }).unwrap();
        setTradeData(data);
      } catch (error) {
        console.error("Failed to fetch deploy data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ref.current) setCsvData(ref.current.getCSVData());
  }, [tradeData, query, ref, setCsvData]);

  const normalizedQuery = String(query ?? "").toLowerCase();
  const searchableFields = [
    "symbol",
    "buyPrice",
    "buyTime",
    "number",
    "netProfit",
    "investment",
    "duration",
    "closeReason",
  ];

  const rowsWithId = (tradeData?.flat() || [])
    .sort((a, b) => a.symbol?.localeCompare(b.symbol || "") ?? 0)
    .map((item, index) => ({ id: index + 1, ...item }))
    .filter((row) =>
      searchableFields.some(
        (key) =>
          row[key] !== undefined &&
          String(row[key]).toLowerCase().includes(normalizedQuery)
      )
    );

  /* ===================== Popover (column chooser) ===================== */
  const popoverContent = () => {
    if (!activeFilter) return null;
    switch (activeFilter) {
      case "column":
        return (
          <FormGroup sx={{ padding: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "120%",
                letterSpacing: "0%",
                color: "#0A0A0A",
              }}
            >
              Select Column
            </Typography>
            {columns
              .filter(({ field }) => !["moreaction"].includes(field))
              .map((col) => (
                <FormControlLabel
                  key={col.field}
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlinedIcon />}
                      checkedIcon={<CheckBoxIcon />}
                      checked={!hiddenColumns.includes(col.field)}
                      onChange={() => handleColumnToggle(col.field)}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "120%",
                        letterSpacing: "0%",
                        color: "#0A0A0A",
                      }}
                    >
                      {col.headerName}
                    </Typography>
                  }
                />
              ))}
          </FormGroup>
        );
      default:
        return null;
    }
  };

  /* ===================== Columns ===================== */
  const numFmt = { decimals: 2, integerNoDecimals: true, useGrouping: true, locale: "en-IN" };

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: columnWidths.symbol || 150,
      renderCell: (params) => <Typography sx={{ ...tableTextSx }}>{params.row.symbol}</Typography>,
    },
    {
      field: "buyTime",
      headerName: "Buy Time",
      width: columnWidths.buyTime || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row?.buyTime ? moment(params.row?.buyTime).format("Do MMM YYYY") : "-"}
        </Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      width: columnWidths.buyPrice || 150,
      valueGetter: (_, row) => (row.buyPrice ? parseFloat(row.buyPrice) : 0),
      renderCell: (params) => {
        const v = params?.row?.buyPrice;
        const n = parseNumericLike(v);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeCurrency(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      width: columnWidths.sellTime || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row.sellTime ?? "-"}
        </Typography>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      width: columnWidths.sellPrice || 150,
      valueGetter: (_, row) => (row.sellPrice ? parseFloat(row.sellPrice) : 0),
      renderCell: (params) => {
        const v = params?.row?.sellPrice;
        const n = parseNumericLike(v);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeCurrency(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "number",
      headerName: "Number",
      width: columnWidths.number || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row.number ?? "-"}
        </Typography>
      ),
    },
    {
      field: "principal",
      headerName: "Principal",
      width: columnWidths.principal || 150,
      valueGetter: (_, row) => (row.principal ? parseFloat(row.principal) : 0),
      renderCell: (params) => {
        const v = params?.row?.principal;
        const n = parseNumericLike(v);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeCurrency(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "investment",
      headerName: "Investment",
      width: columnWidths.investment || 150,
      valueGetter: (_, row) => (row.investment ? parseFloat(row.investment) : 0),
      renderCell: (params) => {
        const v = params?.row?.investment;
        const n = parseNumericLike(v);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeCurrency(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      width: columnWidths.netProfit || 150,
      valueGetter: (_, row) => (row.netProfit ? parseFloat(row.netProfit) : 0),
      renderCell: (params) => {
        const v = params?.row?.netProfit;
        const n = parseNumericLike(v);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeCurrency(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      width: columnWidths.risk1R || 150,
      valueGetter: (_, row) => (row.risk1R ? parseFloat(row.risk1R) : 0),
      renderCell: (params) => {
        const n = parseNumericLike(params?.row?.risk1R);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeNumber(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: columnWidths.duration || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row.duration ?? "-"}
        </Typography>
      ),
    },
    {
      field: "annualPrf",
      headerName: "Annual Profit",
      width: columnWidths.annualPrf || 150,
      valueGetter: (_, row) => (row.annualPrf ? parseFloat(row.annualPrf) : 0),
      renderCell: (params) => {
        const n = parseNumericLike(params?.row?.annualPrf);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeNumber(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "profit",
      headerName: "Profit %",
      width: columnWidths.profit || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row.profit ?? "-"}
        </Typography>
      ),
    },
    {
      field: "maxPrf",
      headerName: "Max Profit",
      width: columnWidths.maxPrf || 150,
      renderCell: (params) => {
        const n = parseNumericLike(params?.row?.maxPrf);
        return (
          <Typography sx={{ ...tableTextSx }}>
            {n == null ? "-" : formatMaybeNumber(n, numFmt)}
          </Typography>
        );
      },
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      width: columnWidths.closeReason || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params.row.closeReason ?? "-"}
        </Typography>
      ),
    },
    {
      field: "moreaction",
      headerName: "",
      minWidth: 50,
      maxWidth: 60,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <IconButton size="small" onClick={(e) => handlePopoverOpen(e, "column")}>
          <SettingsIcon fontSize="small" color={hiddenColumns.length ? "primary" : undefined} />
        </IconButton>
      ),
    },
  ];

  const visibleColumns = columns.filter(
    (col) => Array.isArray(hiddenColumns) && !hiddenColumns.includes(col.field)
  );

  useImperativeHandle(ref, () => ({
    getCSVData: () => ({
      columns,
      datas: rowsWithId,
      filename: "TradeHistroy_data",
      separator: ",",
      wrapColumnChar: '"',
    }),
  }));

  const pageCount = Math.ceil(rowsWithId.length / cardsPerPage);
  const paginatedRows = rowsWithId.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  const handleColumnResize = (params) => {
    const newWidths = { ...columnWidths, [params.colDef.field]: params.width };
    setColumnWidths(newWidths);
    localStorage.setItem("tradeHistoryTableColumnWidths", JSON.stringify(newWidths));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===================== Mobile mapping (CommonCard) ===================== */
  const mapRowToDisplay = (row) => ({
    Symbol: row.symbol,
    "Buy Time": row.buyTime ? moment(row.buyTime).format("Do MMM YYYY") : "-",
    "Buy Price": formatMaybeCurrency(row.buyPrice, numFmt),
    "Sell Time": row.sellTime ?? "-",
    "Sell Price": formatMaybeCurrency(row.sellPrice, numFmt),
    Number: row.number ?? "-",
    Principal: formatMaybeCurrency(row.principal, numFmt),
    Investment: formatMaybeCurrency(row.investment, numFmt),
    "Net Profit": formatMaybeCurrency(row.netProfit, numFmt),
    Risk1R: formatMaybeNumber(row.risk1R, numFmt),
    Duration: row.duration ?? "-",
    "Annual Profit %": formatMaybeNumber(row.annualPrf, numFmt),
    "Profit %": row.profit ?? "-",
    //"Max Profit": formatMaybeNumber(row.maxPrf, numFmt),
    "Close Reason": row.closeReason ?? "-",
  });

  return (
    <>
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{ sx: { maxHeight: 300, overflowY: "auto", overflowX: "hidden" } }}
      >
        {popoverContent()}
      </Popover>

      {isMobile ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {rowsWithId.length ? (
            paginatedRows.map((row, i) => <CommonCard key={i} rows={mapRowToDisplay(row)} />)
          ) : (
            <div className="text-center pt-2">No data to show</div>
          )}

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </Box>
      ) : (
        <Box
          className={`${classes.filterModal} flex`}
          sx={{
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "white",
            width: "100%",
            height: "500px",
            overflow: "auto",
          }}
        >
          <DataGrid
            disableColumnSelector
            rows={rowsWithId}
            columns={visibleColumns}
            filterModel={filterModel}
            onColumnResize={handleColumnResize}
            onFilterModelChange={setFilterModel}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            loading={loading}
            slotProps={{
              loadingOverlay: {
                variant: "circular-progress",
                noRowsVariant: "circular-progress",
              },
            }}
            pageSizeOptions={[10]}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#666666",
              },
            }}
          />
        </Box>
      )}
    </>
  );
});

export default TradeHistroyTable;
