/* eslint-disable react/display-name */
import { forwardRef, useMemo, useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Pagination,
  Popover,
  Tooltip,
  Typography,
  Button,
  Drawer,
  Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { YET_TO_DO_MSG } from "../../../../../../constants/CommonText";
import CommonCard from "../../../../../common/Cards/CommonCard";

/** ---------- shared styles ----------- */
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

/** Generic number formatter */
const fmt2 = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : "0";
};

/**
 * Props:
 *  - tradeData: array
 *  - isLoading: boolean
 *  - mobileCardSchema?: [{ field, label?, format?(value,row) }]
 *  - mobileItemsPerPage?: number (default 10)
 *  - persistMobileCardSelection?: boolean (default true)
 *  - storageKey?: string (default "TradeToDoTable:cardFields")
 *  - showMobileCardSettings?: boolean (default true)
 *  - onCardFieldsChange?: (fields: string[]) => void
 */
const TradeToDoTable = forwardRef(
  (
    {
      tradeData = [],
      isLoading,
      mobileCardSchema,
      mobileItemsPerPage = 10,
      persistMobileCardSelection = true,
      storageKey = "TradeToDoTable:cardFields",
      showMobileCardSettings = true,
      onCardFieldsChange,
    },
    ref
  ) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [filterModel, setFilterModel] = useState({ items: [] });
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [popoverAnchor, setPopoverAnchor] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    const [page, setPage] = useState(1);

    const rowsWithId = useMemo(
      () =>
        (tradeData || []).map((strategy, index) => ({
          id: index + 1,
          ...strategy,
        })),
      [tradeData]
    );

    /** ---------- columns (desktop DataGrid) ----------- */
    const columns = useMemo(
      () => [
        {
          field: "symbol",
          headerName: "Symbol",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.symbol}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "companyName",
          headerName: "Company",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.companyName}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "number",
          headerName: "Number",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.number}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "buyPrice",
          headerName: "Buy Price",
          flex: 1,
          valueGetter: (_, row) =>
            row.buyPrice ? parseFloat(row.buyPrice) : 0,
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.buyPrice)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "sellPrice",
          headerName: "Sell Price",
          flex: 1,
          valueGetter: (_, row) =>
            row.sellPrice ? parseFloat(row.sellPrice) : 0,
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.sellPrice)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "principal",
          headerName: "Principal",
          flex: 1,
          valueGetter: (_, row) =>
            row.principal ? parseFloat(row.principal) : 0,
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.principal)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "investment",
          headerName: "Investment",
          flex: 1,
          valueGetter: (_, row) =>
            row.investment ? parseFloat(row.investment) : 0,
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.investment)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "netProfit",
          headerName: "Net Profit",
          flex: 1,
          valueGetter: (_, row) =>
            row.netProfit ? parseFloat(row.netProfit) : 0,
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.netProfit)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "buyTime",
          headerName: "Buy Time",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.buyTime}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "sellTime",
          headerName: "Sell Time",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.sellTime}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "duration",
          headerName: "Duration",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.duration}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "risk1R",
          headerName: "Risk1R",
          flex: 1,
          valueGetter: (_, row) => (row.risk1R ? parseFloat(row.risk1R) : 0),
          renderCell: (p) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: p?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {fmt2(p?.row?.risk1R)}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "closeReason",
          headerName: "Close Reason",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.closeReason}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "openReason",
          headerName: "Open Reason",
          flex: 1,
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <Typography sx={{ ...tableTextSx }}>
                {params?.row?.openReason}
              </Typography>
            </Tooltip>
          ),
        },
        {
          field: "action",
          headerName: "Action",
          flex: 1,
          disableColumnMenu: true,
          valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <div>{params.row.closed ? "EXIT" : "ENTER"}</div>
            </Tooltip>
          ),
        },
        {
          field: "yetToDo",
          headerName: "Yet To Do",
          flex: 1,
          disableColumnMenu: true,
          valueGetter: (_, row) => (row.yetToDo ? "True" : "False"),
          renderCell: (params) => (
            <Tooltip
              title={YET_TO_DO_MSG}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    visibility: params?.row?.yetToDo ? "visible" : "hidden",
                  },
                },
              }}
              placement="right-end"
            >
              <div>{params.row.yetToDo ? "True" : "False"}</div>
            </Tooltip>
          ),
        },
        {
          field: "moreaction",
          headerName: "Column Setting",
          flex: 1,
          disableColumnMenu: true,
          renderHeader: () => (
            <IconButton
              size="small"
              onClick={(e) => handlePopoverOpen(e, "column")}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          ),
          renderCell: () => <div />,
        },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const columnsMap = useMemo(() => {
      const m = {};
      columns.forEach((c) => (m[c.field] = c));
      return m;
    }, [columns]);

    /** ---------- column popover (desktop) ----------- */
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
      setHiddenColumns((prev) =>
        prev.includes(field)
          ? prev.filter((col) => col !== field)
          : [...prev, field]
      );
    };

    const popoverContent = () => {
      if (!activeFilter) return null;
      if (activeFilter === "column") {
        return (
          <FormGroup sx={{ padding: 2 }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "120%",
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
      }
      return null;
    };

    const visibleColumns = useMemo(
      () => columns.filter((col) => !hiddenColumns.includes(col.field)),
      [columns, hiddenColumns]
    );

    /** ---------- MOBILE CARD CONFIG (defaults + persistence) ----------- */
    const defaultMobileCardSchema = useMemo(
      () => [
        { field: "symbol" },
        { field: "companyName" },
        { field: "number" },
        {
          field: "action",
          format: (_, row) => (row.closed ? "EXIT" : "ENTER"),
        },
      ],
      []
    );

    const defaultFields = useMemo(
      () => (mobileCardSchema || defaultMobileCardSchema).map((s) => s.field),
      [mobileCardSchema, defaultMobileCardSchema]
    );

    const [cardFields, setCardFields] = useState(defaultFields);

    // Staged selection inside Drawer (prevents flicker)
    const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
    const [tempCardFields, setTempCardFields] = useState(defaultFields);

    const openMobileSettings = () => {
      setTempCardFields(cardFields);
      setMobileSettingsOpen(true);
    };
    const closeMobileSettings = () => setMobileSettingsOpen(false);
    const applyMobileSettings = () => {
      setCardFields(tempCardFields);
      setMobileSettingsOpen(false);
    };

    // Load persisted selection (mobile only)
    useEffect(() => {
      if (!isMobile || !persistMobileCardSelection) return;
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved)) return;
        const valid = saved.filter((f) => columnsMap[f]);
        if (valid.length) {
          setCardFields(valid);
          setTempCardFields(valid);
        }
      } catch {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, persistMobileCardSelection, storageKey, columnsMap]);

    // Save selection
    useEffect(() => {
      if (!isMobile || !persistMobileCardSelection) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(cardFields));
      } catch {}
      if (onCardFieldsChange) onCardFieldsChange(cardFields);
    }, [
      cardFields,
      isMobile,
      persistMobileCardSelection,
      storageKey,
      onCardFieldsChange,
    ]);

    const cardFormatMap = useMemo(() => {
      const map = {};
      (mobileCardSchema || defaultMobileCardSchema).forEach((s) => {
        if (s.format) map[s.field] = s.format;
      });
      return map;
    }, [mobileCardSchema, defaultMobileCardSchema]);

    const cardLabelOverride = useMemo(() => {
      const map = {};
      (mobileCardSchema || defaultMobileCardSchema).forEach((s) => {
        if (s.label) map[s.field] = s.label;
      });
      return map;
    }, [mobileCardSchema, defaultMobileCardSchema]);

    const buildMobileCardRows = (row) => {
      const out = {};
      cardFields.forEach((field) => {
        const col = columnsMap[field];
        const label = cardLabelOverride[field] || col?.headerName || field;

        let value;
        if (field === "action") value = row.closed ? "EXIT" : "ENTER";
        else if (field === "yetToDo") value = row.yetToDo ? "True" : "False";
        else value = row[field];

        const formatted =
          cardFormatMap[field] != null
            ? cardFormatMap[field](value, row)
            : [
                "buyPrice",
                "sellPrice",
                "principal",
                "investment",
                "netProfit",
                "risk1R",
              ].includes(field)
            ? fmt2(value)
            : value ?? "-";

        out[label] = formatted;
      });
      return out;
    };

    /** ---------- pagination for mobile cards ----------- */
    const pageCount = Math.ceil(rowsWithId.length / mobileItemsPerPage);
    const paginatedRows = useMemo(
      () =>
        rowsWithId.slice(
          (page - 1) * mobileItemsPerPage,
          page * mobileItemsPerPage
        ),
      [rowsWithId, page, mobileItemsPerPage]
    );
    const handlePageChange = (_, value) => {
      setPage(value);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <>
        {/* Desktop column popover */}
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          PaperProps={{
            sx: { maxHeight: 300, overflowY: "auto", overflowX: "hidden" },
          }}
        >
          {popoverContent()}
        </Popover>

        {/* Mobile card-fields Drawer (no flicker) */}
        <Drawer
          anchor="bottom"
          open={mobileSettingsOpen}
          onClose={closeMobileSettings}
          keepMounted
          ModalProps={{ disableScrollLock: true }}
          PaperProps={{
            sx: { p: 2, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontWeight: 600, mb: 1 }}>
            Select Card Fields
          </Typography>

          <FormGroup sx={{ maxHeight: 320, overflowY: "auto", pr: 1 }}>
            {columns
              .filter((c) => !["moreaction"].includes(c.field))
              .map((c) => {
                const checked = tempCardFields.includes(c.field);
                return (
                  <FormControlLabel
                    key={c.field}
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlinedIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        checked={checked}
                        onChange={() =>
                          setTempCardFields((prev) =>
                            checked
                              ? prev.filter((f) => f !== c.field)
                              : [...prev, c.field]
                          )
                        }
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: "Inter", fontWeight: 500 }}>
                        {c.headerName}
                      </Typography>
                    }
                  />
                );
              })}
          </FormGroup>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              size="small"
              onClick={() => setTempCardFields(defaultFields)}
            >
              Reset
            </Button>
            <Button size="small" onClick={closeMobileSettings}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={applyMobileSettings}
            >
              Done
            </Button>
          </Box>
        </Drawer>

        {isMobile ? (
          <>
            {/* Mobile toolbar */}
            {showMobileCardSettings && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Tooltip title="Choose card fields">
                  <IconButton size="small" onClick={openMobileSettings}>
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {/* Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {rowsWithId.length ? (
                paginatedRows.map((row) => (
                  <CommonCard key={row.id} rows={buildMobileCardRows(row)} />
                ))
              ) : (
                <div className="text-center pt-2">No data to show</div>
              )}

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
          </>
        ) : (
          // Desktop: DataGrid unchanged
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
              rows={rowsWithId}
              columns={visibleColumns}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              loading={isLoading}
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
                "& .row-yetToDo": { bgcolor: "#dce9f5" },
              }}
              getRowClassName={(params) =>
                params.row.yetToDo ? "row-yetToDo" : ""
              }
            />
          </Box>
        )}
      </>
    );
  }
);

export default TradeToDoTable;
