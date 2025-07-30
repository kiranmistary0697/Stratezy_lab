/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";

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

  const [hiddenColumns, setHiddenColumns] = useState([
    "sellTime",
    "sellPrice",
    "prf1R",
    "closeReason",
    "openReason",
    "yetToDo",
  ]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [filterModel, setFilterModel] = useState({ items: [] });

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
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.sellTime}</Typography>
      ),
    },
    {
      field: "investment",
      headerName: "Investment",
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.buyTime}</Typography>
      ),
    },
    {
      field: "prf1R",
      headerName: "Prf1R",
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.duration}</Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.closeReason}</Typography>
      ),
    },
    {
      field: "openReason",
      headerName: "Open Reason",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={tableTextSx}>{params?.row?.openReason}</Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => <div>{params.row.closed ? "EXIT" : "ENTER"}</div>,
    },
    {
      field: "yetToDo",
      headerName: "Yet To Do",
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (_, row) => (row.yetToDo ? "True" : "False"),
      renderCell: (params) => (
        <div>{params.row.yetToDo ? "True" : "False"}</div>
      ),
    },
    {
      field: "moreAction",
      headerName: "Setting",
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
      renderCell: () => <div>{null}</div>,
    },
  ].filter(Boolean);

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
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
    </>
  );
});

export default HoldingsTable;
