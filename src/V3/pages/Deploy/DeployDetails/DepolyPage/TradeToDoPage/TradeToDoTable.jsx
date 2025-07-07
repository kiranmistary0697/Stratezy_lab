/* eslint-disable react/display-name */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Typography } from "@mui/material";
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

const TradeToDoTable = forwardRef((props, ref) => {
  const classes = useStyles();
  const { tradeData = [], isLoading } = props;
  const [filterModel, setFilterModel] = useState({ items: [] });

  const rowsWithId = tradeData?.map((strategy, index) => ({
    id: index + 1,
    ...strategy,
  }));

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.number}</Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyPrice}</Typography>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.sellPrice}
        </Typography>
      ),
    },
    {
      field: "principal",
      headerName: "Principal",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.principal}
        </Typography>
      ),
    },
    {
      field: "investment",
      headerName: "Investment",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.investment}
        </Typography>
      ),
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>
          {params?.row?.netProfit}
        </Typography>
      ),
    },
    {
      field: "profit",
      headerName: "Profit",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.profit}</Typography>
      ),
    },
    {
      field: "anPrf",
      headerName: "Annual Prf",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.anPrf}</Typography>
      ),
    },
    {
      field: "buyTime",
      headerName: "Buy Time",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyTime}</Typography>
      ),
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.sellTime}</Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.duration}</Typography>
      ),
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.risk1R}</Typography>
      ),
    },
    {
      field: "prf1R",
      headerName: "Prf1R",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.prf1R}</Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      minWidth: 150,
      flex: 1,
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
      valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => {
        return <div> {params.row.closed ? "EXIT" : "ENTER"}</div>;
      },
    },
  ];

  useImperativeHandle(ref, () => ({
    getCSVData: () => ({
      columns,
      data: rowsWithId,
      filename: "Trade_To_do_data",
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
        width: "100%",
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

export default TradeToDoTable;
