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
import CapitalCard from "../../../../../common/Cards/CapitalCard";

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

const useStyles = makeStyles({
  filterModal: {
    "& .MuiDataGrid-filterPanel": { display: "none" },
    "& .MuiDataGrid-filterPanelColumn": { display: "none" },
    "& .MuiDataGrid-filterPanelOperator": { display: "none" },
  },
});

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
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const stored = localStorage.getItem("hiddenColumnsCapitalTable");
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing hidden columns from localStorage:", error);
      return [];
    }
  });
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(
    moment(capitalData?.date || new Date()).format("DD/MM/YYYY")
  );
  const [saving, setSaving] = useState(false);

  const [rowToDelete, setRowToDelete] = useState(null);

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("capitalTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsCapitalTable"
  );

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
      const params = new URLSearchParams({
        name,
        exchange,
        version,
        brokerage,
      }).toString();

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

      localStorage.setItem(
        "hiddenColumnsCapitalTable",
        JSON.stringify(updatedColumns)
      );

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

  // ---------- Currency formatting (prevents ₹NaN) ----------
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2, // set 0 if you don't want decimals
      }),
    []
  );

  // Robust parser: handles plain numbers, "₹3,00,00,000.00", "3E7", "+3e+7", "-1.2e-3"
  const parseToNumber = useCallback((raw) => {
    if (raw === 0) return 0;
    if (raw == null || raw === "") return null;

    if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;

    // Clean out currency/commas & weird spaces, keep digits, dot, sign, and exponent marker
    const s = String(raw)
      .replace(/[\u00A0\u202F]/g, "") // NBSP, thin space
      .replace(/,/g, "") // commas
      .replace(/₹/g, "") // rupee symbol
      .trim();

    // Try a strict scientific/decimal match to avoid picking up stray text
    const m = s.match(/^[+-]?\d*\.?\d+(?:[eE][+-]?\d+)?$/);
    const candidate = m ? m[0] : s; // if it doesn't strictly match, still try Number(s)

    const n = Number(candidate);
    return Number.isFinite(n) ? n : null;
  }, []);

  const formatINR = useCallback(
    (raw) => {
      const n = parseToNumber(raw);
      return n == null ? "₹0" : currencyFormatter.format(n);
    },
    [currencyFormatter, parseToNumber]
  );

  // --------------------------------------------------------

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
        minWidth: 180, // so big values like ₹3,00,00,000.00 don't get cut to "₹3"
        valueGetter: (params) => parseToNumber(params.row?.Amount) ?? 0,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx, whiteSpace: "nowrap" }}>
            {formatINR(params.row?.Amount)}
          </Typography>
        ),
      },
      {
        field: "Type",
        headerName: "Type",
        width: columnWidths.Type || 150,
        renderCell: (params) => (
          <Badge variant="version">{params.row?.Type}</Badge>
        ),
      },
      {
        field: "Schedule",
        headerName: "Schedule",
        width: columnWidths.Schedule || 150,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>
            {params.row?.Schedule}
          </Typography>
        ),
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
                setSelectedType(
                  params.row?.Type?.replace(/\s+/g, "").toUpperCase()
                );
                setStartDate(params.row.Date);
              }}
              label={params.row.status === "Completed" ? "NA" : "Manage"}
              textColor={
                params.row.status === "Completed" ? "#666666" : "#3D69D3"
              }
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
          <IconButton
            size="small"
            onClick={(e) => handlePopoverOpen(e, "column")}
          >
            <SettingsIcon
              fontSize="small"
              color={hiddenColumns.length ? "primary" : ""}
            />
          </IconButton>
        ),
        renderCell: (params) => (
          <ActionMenu
            isDeleteButton
            handleDelete={() => handleDeleteClick(params.row)}
          />
        ),
      },
    ],
    [hiddenColumns, formatINR, parseToNumber, columnWidths]
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
          .filter(
            ({ field }) =>
              ![
                "requestId",
                "name",
                "version",
                "createdAt",
                "status",
                "moreaction",
              ].includes(field)
          )
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

  const paginatedRows = rows.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleColumnResize = (params) => {
    const newWidths = {
      ...columnWidths,
      [params.colDef.field]: params.width,
    };

    setColumnWidths(newWidths);
    localStorage.setItem("capitalTableColumnWidths", JSON.stringify(newWidths));
  };

  // useEffect(() => {
  //   if (hiddenColumnsFromLocalStorage) {
  //     try {
  //       const parsed = JSON.parse(hiddenColumnsFromLocalStorage);
  //       if (Array.isArray(parsed)) {
  //         setHiddenColumns(parsed);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing hidden columns:", error);
  //     }
  //   }
  // }, [hiddenColumnsFromLocalStorage]);

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
        PaperProps={{
          sx: {
            maxHeight: 300,
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        {popoverContent()}
      </Popover>

      {isMobile ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.length ? (
              paginatedRows.map((data, i) => (
                <CapitalCard
                  key={i}
                  row={data}
                  handleDelete={() => handleDeleteClick(data)}
                />
              ))
            ) : (
              <div className="text-center pt-2">No data to show</div>
            )}
            <Box />

            <Box display="flex" flexDirection="column" gap={2}>
              {pageCount > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </>
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
