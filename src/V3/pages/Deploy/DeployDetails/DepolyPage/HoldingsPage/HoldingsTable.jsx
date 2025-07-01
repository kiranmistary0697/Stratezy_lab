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
import { tagTypes } from "../../../../../tagTypes";
import { useLazyGetQuery } from "../../../../../../slices/api";

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

  const [openProfit, setOpenProfit] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const handleFilterProfitClose = () => {
    setOpenProfit(null);
  };
  const handleFilterProfit = (event) => {
    setOpenProfit(event.currentTarget);
  };
  const handleColumnToggle = (columnField) => {
    setHiddenColumns((prev) =>
      prev.includes(columnField)
        ? prev.filter((col) => col !== columnField)
        : [...prev, columnField]
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

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyPrice}</Typography>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.number}</Typography>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.sellPrice}
        </Typography>
      ),
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.sellTime}</Typography>
      ),
    },
    {
      field: "investment",
      headerName: "Investment",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.investment}
        </Typography>
      ),
    },
    {
      field: "principal",
      headerName: "Principal",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.principal}
        </Typography>
      ),
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.netProfit}
        </Typography>
      ),
    },
    {
      field: "profit",
      headerName: "Profit %",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.profit}</Typography>
      ),
    },

    {
      field: "anPrf",
      headerName: "Annual %",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.anPrf}</Typography>
      ),
    },

    {
      field: "buyTime",
      headerName: "Buy Time",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyTime}</Typography>
      ),
    },
    {
      field: "prf1R",
      headerName: "Prf1R",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.prf1R}</Typography>
      ),
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.risk1R}</Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Duration Time",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.duration}</Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.closeReason}
        </Typography>
      ),
    },
    {
      field: "openReason",
      headerName: "Open Reason",
      minWidth: 150,
      flex: 1,
      //   minWidth: 250,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.openReason}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return <div> {params.row.closed ? "EXIT" : "ENTER"}</div>;
      },
    },
  ].filter(Boolean);

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
        rows={rowsWithId}
        columns={columns}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        initialState={{
          columns: {
            columnVisibilityModel: {
              sellTime: false,
              sellPrice: false,
              prf1R: false,
              closeReason: false,
              openReason: false,
              action: false,
            },
          },
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
  );
});

export default HoldingsTable;
