/* eslint-disable react/prop-types */
import { useState, useMemo, useCallback, useEffect } from "react";
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
import {
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import moment from "moment";
import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

import ActionButton from "../../../../../common/ActionButton";
import ActionMenu from "../../../../../common/DropDownButton";
import AddCapital from "./AddCapital";
import DeleteModal from "../../../../../common/DeleteModal";
import Badge from "../../../../../common/Badge";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CommonCard from "../../../../../common/Cards/CommonCard";

/* ---------- table cell text ---------- */
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

/* ---------- filter modal style ---------- */
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
const CapitalTable = ({
  data = {},
  rows = [],
  loading,
  fetchAllData,
  fetchDeployData,
}) => {
  const classes = useStyles();
  const [deleteCapital] = useLazyGetQuery();
  const [addCapital] = useLazyGetQuery();

  const { name, exchange, brokerage, version } = data;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openCapital, setOpenCapital] = useState(false);
  const [capitalData, setCapitalData] = useState(null);
  const [amount, setAmount] = useState("");

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(
    moment(capitalData?.date || new Date()).format("DD/MM/YYYY")
  );
  const [saving, setSaving] = useState(false);

  const [rowToDelete, setRowToDelete] = useState(null);

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const stored = localStorage.getItem("hiddenColumnsCapitalTable");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("capitalTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch {
      return {};
    }
  });

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

  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;
    try {
      const params = new URLSearchParams({ name, exchange, version, brokerage }).toString();
      const { data } = await deleteCapital({
        endpoint: `/deploy/strategy/clearcapital?${params}`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      toast.success(data?.message);
      await fetchAllData();
      await fetchDeployData();
    } catch (error) {
      console.error("Failed to delete capital:", error);
    } finally {
      setIsDeleteOpen(false);
      setRowToDelete(null);
    }
  };

  const handleDeleteClick = (row) => {
    setRowToDelete(row);
    setIsDeleteOpen(true);
  };

  const handleColumnToggle = (field) => {
    setHiddenColumns((prev) => {
      const updatedColumns = prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field];
      localStorage.setItem("hiddenColumnsCapitalTable", JSON.stringify(updatedColumns));
      return updatedColumns;
    });
  };

  const handleSaveCapital = async () => {
    if (!amount) return;
    setSaving(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${moment(
          startDate,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD")}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      setAmount("");
      await fetchAllData();
      await fetchDeployData();
      setOpenCapital(false);
    } catch (error) {
      console.error("Add capital error:", error);
    } finally {
      setSaving(false);
    }
  };

  /* ===================== columns ===================== */
  const numFmt = { decimals: 2, integerNoDecimals: true, useGrouping: true, locale: "en-IN" };

  const columns = useMemo(
    () => [
      {
        field: "Date",
        headerName: "Date",
        width: columnWidths.Date || 150,
        valueGetter: (params) => moment(params.row?.Date).format("DD MMM YYYY"),
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>
            {moment(params.row?.Date).format("DD MMM YYYY")}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: columnWidths.status || 150,
        renderCell: (params) => (
          <Badge variant={params.row.status?.toLowerCase()}>
            {params.row?.status}
          </Badge>
        ),
      },
      {
        field: "Amount",
        headerName: "Amount",
        width: columnWidths.Amount || 180,
        minWidth: 180,
        valueGetter: (params) => parseNumericLike(params.row?.Amount) ?? 0,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx, whiteSpace: "nowrap" }}>
            {formatMaybeCurrency(params.row?.Amount, numFmt)}
          </Typography>
        ),
      },
      {
        field: "Type",
        headerName: "Type",
        width: columnWidths.Type || 150,
        renderCell: (params) => <Badge variant="version">{params.row?.Type}</Badge>,
      },
      {
        field: "Schedule",
        headerName: "Schedule",
        width: columnWidths.Schedule || 150,
        renderCell: (params) => <Typography sx={tableTextSx}>{params.row?.Schedule}</Typography>,
      },
      {
        field: "manage",
        headerName: "Action",
        width: columnWidths.manage || 150,
        renderCell: (params) => (
          <Box className="flex gap-8 items-center h-full">
            <ActionButton
              action="Backtest"
              onClick={() => {
                setOpenCapital(true);
                setCapitalData({
                  date: params.row.Date,
                  initialAmount: params.row.Amount,
                  type: params.row.Type,
                });
                setAmount(params.row.Amount);
                setSelectedType(params.row?.Type?.replace(/\s+/g, "").toUpperCase());
                setStartDate(params.row.Date);
              }}
              label={params.row.status === "Completed" ? "NA" : "Manage"}
              textColor={params.row.status === "Completed" ? "#666666" : "#3D69D3"}
              iconClass="ri-play-line"
            />
          </Box>
        ),
      },
      {
        field: "moreaction",
        headerName: "",
        align: "center",
        maxWidth: 60,
        sortable: false,
        disableColumnMenu: true,
        renderHeader: () => (
          <IconButton size="small" onClick={(e) => handlePopoverOpen(e, "column")}>
            <SettingsIcon fontSize="small" color={hiddenColumns.length ? "primary" : ""} />
          </IconButton>
        ),
        renderCell: (params) => (
          <ActionMenu isDeleteButton handleDelete={() => handleDeleteClick(params.row)} />
        ),
      },
    ],
    [hiddenColumns, columnWidths, numFmt]
  );

  const visibleColumns = columns.filter(
    (col) => Array.isArray(hiddenColumns) && !hiddenColumns.includes(col.field)
  );

  const popoverContent = () => {
    if (activeFilter !== "column") return null;
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
          .filter(({ field }) => !["requestId", "name", "version", "createdAt", "status", "moreaction"].includes(field))
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
  };

  const pageCount = Math.ceil(rows.length / cardsPerPage);
  const paginatedRows = rows.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleColumnResize = (params) => {
    const newWidths = { ...columnWidths, [params.colDef.field]: params.width };
    setColumnWidths(newWidths);
    localStorage.setItem("capitalTableColumnWidths", JSON.stringify(newWidths));
  };

  return (
    <>
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          handleClose={() => setIsDeleteOpen(false)}
          handleConfirm={handleConfirmDelete}
          isLoading={loading}
          title="Are you Sure?"
          description="All planned capital will be cleared."
        />
      )}

      {openCapital && (
        <AddCapital
          title="Add Capital"
          isOpen={openCapital}
          handleClose={() => setOpenCapital(false)}
          capitalData={capitalData}
          setAmount={setAmount}
          setSelectedType={setSelectedType}
          setStartDate={setStartDate}
          amount={amount}
          selectedType={selectedType}
          startDate={startDate}
          loading={saving}
          onSave={handleSaveCapital}
        />
      )}

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
          {rows.length ? (
            paginatedRows.map((row, i) => {
              const cardRows = {
                Date: moment(row.Date).format("DD MMM YYYY"),
                Status: <Badge variant={row.status?.toLowerCase()}>{row.status}</Badge>,
                Amount: formatMaybeCurrency(row.Amount, numFmt),
                Type: <Badge variant="version">{row.Type}</Badge>,
                Schedule: row.Schedule ?? "-",
              };
              const isCompleted = row.status === "Completed";
              return (
                <Box key={i}>
                  <CommonCard
                    rows={cardRows}
                    overflowMode="wrap"    // wrap label & value
                    formatNumbers={false}  // preserve preformatted "₹ ..."
                  />
                  {/* actions bar under the card */}
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", px: 1, mb: 1 }}>
                    <ActionButton
                      action="Backtest"
                      label={isCompleted ? "" : "Manage"}
                      textColor={isCompleted ? "#666666" : "#3D69D3"}
                      iconClass="ri-play-line"
                      onClick={() => {
                        if (isCompleted) return;
                        setOpenCapital(true);
                        setCapitalData({ date: row.Date, initialAmount: row.Amount, type: row.Type });
                        setAmount(row.Amount);
                        setSelectedType(row?.Type?.replace(/\s+/g, "").toUpperCase());
                        setStartDate(row.Date);
                      }}
                    />
                    <ActionButton
                      action="Delete"
                      label="Delete"
                      textColor="red"
                      iconClass="ri-play-line"
                      onClick={() => handleDeleteClick(row)}
                    />
                  </Box>
                </Box>
              );
            })
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
          className={classes.filterModal + " flex"}
          sx={{
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "white",
            width: "100%",
            height: "450px",
            overflow: "auto",
          }}
        >
          <DataGrid
            disableColumnSelector
            rows={rows}
            columns={visibleColumns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            loading={loading}
            onColumnResize={handleColumnResize}
            slotProps={{
              loadingOverlay: {
                variant: "circular-progress",
                noRowsVariant: "circular-progress",
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
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
};

export default CapitalTable;
