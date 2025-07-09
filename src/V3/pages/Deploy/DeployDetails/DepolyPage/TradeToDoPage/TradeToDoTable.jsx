/* eslint-disable react/display-name */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
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
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const rowsWithId = tradeData?.map((strategy, index) => ({
    id: index + 1,
    ...strategy,
  }));

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
      default:
        return null;
    }
  };

  const columns = [
    {
      field: "symbol",
      headerName: "Symbol",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
      ),
    },
    {
      field: "number",
      headerName: "Number",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.number}</Typography>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyPrice}</Typography>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.profit}</Typography>
      ),
    },
    {
      field: "anPrf",
      headerName: "Annual Prf",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.anPrf}</Typography>
      ),
    },
    {
      field: "buyTime",
      headerName: "Buy Time",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.buyTime}</Typography>
      ),
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.sellTime}</Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.duration}</Typography>
      ),
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.risk1R}</Typography>
      ),
    },
    {
      field: "prf1R",
      headerName: "Prf1R",
      // minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ ...tableTextSx }}>{params?.row?.prf1R}</Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
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
      valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => {
        return <div> {params.row.closed ? "EXIT" : "ENTER"}</div>;
      },
    },
  ];

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

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
          width: "100%",
          height: "500px", // Set a max height for scrolling
          overflow: "auto", // Enable scrolling when content overflows
        }}
      >
        <DataGrid
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

export default TradeToDoTable;
