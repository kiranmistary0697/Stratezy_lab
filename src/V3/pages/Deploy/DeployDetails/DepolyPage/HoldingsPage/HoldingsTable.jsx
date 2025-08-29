/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
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

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CommonCard from "../../../../../common/Cards/CommonCard";

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
  // This targets the column and operator dropdowns in the filter modal
  filterModal: {
    // Hide the column dropdown (the field selector) and the operator dropdown (the operator selector)
    "& .MuiDataGrid-filterPanel": {
      display: "none",
    },
    "& .MuiDataGrid-filterPanelColumn": {
      display: "none",
    },
    "& .MuiDataGrid-filterPanelOperator": {
      display: "none",
    },
  },
});

const HoldingsTable = forwardRef((props, ref) => {
  const { query, rows = [], isLoading } = props;
  // { ref, data = {}, query }
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const stored = localStorage.getItem("hiddenColumnsHoldingsTable");
      const parsed = stored
        ? JSON.parse(stored)
        : [
            "sellTime",
            "sellPrice",
            "prf1R",
            "closeReason",
            "openReason",
            "yetToDo",
          ];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing hidden columns from localStorage:", error);
      return [
        "sellTime",
        "sellPrice",
        "prf1R",
        "closeReason",
        "openReason",
        "yetToDo",
      ];
    }
  });

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("holdingsTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsHoldingsTable"
  );

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

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

      localStorage.setItem(
        "hiddenColumnsHoldingsTable",
        JSON.stringify(updatedColumns)
      );

      return updatedColumns;
    });
  };

  const normalizedQuery = String(query).toLowerCase();
  const searchableFields = [
    "symbol",
    "buyPrice",
    "number",
    "investment",
    "principal",
    "netProfit",
    "profit",
    "anPrf",
    "buyTime",
    "risk1R",
    "duration",
  ];

  const rowsWithId = rows
    ?.slice() // shallow copy
    .sort((a, b) => a.symbol?.localeCompare(b.symbol || "") ?? 0)
    .map((strategy, index) => ({
      id: index + 1,
      ...strategy,
    }))
    .filter((row) =>
      searchableFields.some(
        (key) =>
          row[key] !== undefined &&
          String(row[key]).toLowerCase().includes(normalizedQuery)
      )
    );
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
              .filter(
                ({ field }) =>
                  ![
                    "requestId",
                    "name",
                    "version",
                    "createdAt",
                    "status",
                    "moreAction",
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
      default:
        return null;
    }
  };

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: columnWidths.symbol || 150,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      width: columnWidths.buyPrice || 150,
      valueGetter: (_, row) => (row.buyPrice ? parseFloat(row.buyPrice) : 0),
      renderCell: (params) => {
        const value = params?.row?.buyPrice;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "number",
      headerName: "Number",
      width: columnWidths.number || 150,
      // Assuming number is numeric, apply logic accordingly:
      valueGetter: (_, row) => (row.number ? parseFloat(row.number) : 0),
      renderCell: (params) => {
        const value = params?.row?.number;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      width: columnWidths.sellPrice || 150,
      valueGetter: (_, row) => (row.sellPrice ? parseFloat(row.sellPrice) : 0),
      renderCell: (params) => {
        const value = params?.row?.sellPrice;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      width: columnWidths.sellTime || 150,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.sellTime}</Typography>
      ),
    },
    {
      field: "investment",
      headerName: "Investment",
      width: columnWidths.investment || 150,
      valueGetter: (_, row) =>
        row.investment ? parseFloat(row.investment) : 0,
      renderCell: (params) => {
        const value = params?.row?.investment;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "principal",
      headerName: "Principal",
      width: columnWidths.principal || 150,
      valueGetter: (_, row) => (row.principal ? parseFloat(row.principal) : 0),
      renderCell: (params) => {
        const value = params?.row?.principal;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      width: columnWidths.netProfit || 150,
      valueGetter: (_, row) => (row.netProfit ? parseFloat(row.netProfit) : 0),
      renderCell: (params) => {
        const value = params?.row?.netProfit;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "profit",
      headerName: "Profit %",
      width: columnWidths.profit || 150,
      valueGetter: (_, row) => (row.profit ? parseFloat(row.profit) : 0),
      renderCell: (params) => {
        const value = params?.row?.profit;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "anPrf",
      headerName: "Annual %",
      width: columnWidths.anPrf || 150,
      valueGetter: (_, row) => (row.anPrf ? parseFloat(row.anPrf) : 0),
      renderCell: (params) => {
        const value = params?.row?.anPrf;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "buyTime",
      headerName: "Buy Time",
      width: columnWidths.buyTime || 150,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.buyTime}</Typography>
      ),
    },
    {
      field: "prf1R",
      headerName: "Prf1R",
      width: columnWidths.prf1R || 150,
      valueGetter: (_, row) => (row.prf1R ? parseFloat(row.prf1R) : 0),
      renderCell: (params) => {
        const value = params?.row?.prf1R;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      width: columnWidths.risk1R || 150,
      valueGetter: (_, row) => (row.risk1R ? parseFloat(row.risk1R) : 0),
      renderCell: (params) => {
        const value = params?.row?.risk1R;
        const num = Number(value);
        if (isNaN(num)) return <Typography sx={tableTextSx}>0</Typography>;
        return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
      },
    },
    {
      field: "duration",
      headerName: "Duration Time",
      width: columnWidths.duration || 150,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.duration}</Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      width: columnWidths.closeReason || 150,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.closeReason}</Typography>
      ),
    },
    {
      field: "openReason",
      headerName: "Open Reason",
      width: columnWidths.openReason || 200,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.openReason}</Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: columnWidths.action || 150,
      disableColumnMenu: true,
      valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => <div>{params.row.closed ? "EXIT" : "ENTER"}</div>,
    },
    {
      field: "yetToDo",
      headerName: "Yet To Do",
      width: columnWidths.yetToDo || 150,
      disableColumnMenu: true,
      valueGetter: (_, row) => (row.yetToDo ? "True" : "False"),
      renderCell: (params) => (
        <div>{params.row.yetToDo ? "True" : "False"}</div>
      ),
    },
    {
      field: "moreAction",
      headerName: "Setting",
      width: columnWidths.moreAction || 150,
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
      renderCell: () => <div>{null}</div>,
    },
  ].filter(Boolean);

  const visibleColumns = columns.filter(
    (col) => Array.isArray(hiddenColumns) && !hiddenColumns.includes(col.field)
  );

  useImperativeHandle(ref, () => ({
    getCSVData: () => ({
      columns,
      datas: rowsWithId,
      filename: "Holdings_data",
      separator: ",",
      wrapColumnChar: '"',
    }),
  }));

  const pageCount = Math.ceil(rowsWithId.length / cardsPerPage);

  const paginatedRows = rowsWithId.slice(
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
    localStorage.setItem(
      "holdingsTableColumnWidths",
      JSON.stringify(newWidths)
    );
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

  const mapRowToDisplay = (row) => ({
    Symbol: row.symbol,
    "Buy Price": row.buyPrice,
    Number: row.number,
    "Sell Price": row.sellPrice,
    "Sell Time": row.sellTime,
    Investment: row.investment,
    Principal: row.principal,
    "Net Profit": row.netProfit,
    "Profit %": row.profit,
    "Annual %": row.anPrf,
    "Buy Time": row.buyTime,
    Prf1R: row.prf1R,
    Risk1R: row.risk1R,
    "Duration Time": row.duration,
    "Close Reason": row.closeReason,
    "Open Reason": row.openReason,
    Action: row.closed ? "EXIT" : "ENTER",
    "Yet To Do": row.yetToDo ? "True" : "False",
  });

  return (
    <>
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
        // transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {popoverContent()}
      </Popover>

      {isMobile ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rowsWithId.length ? (
              paginatedRows.map((data, i) => (
                <CommonCard key={i} rows={mapRowToDisplay(data)} />
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
          className={`${classes.filterModal} flex`}
          sx={{
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "white",
            minWidth: "100%",
            height: "500px", // Set a max height for scrolling
            overflow: "auto", // Enable scrolling when content overflows
          }}
        >
          <DataGrid
            disableColumnSelector
            rows={rowsWithId}
            columns={visibleColumns}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            onColumnResize={handleColumnResize}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
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
            }}
          />
        </Box>
      )}
    </>
  );
});

export default HoldingsTable;
