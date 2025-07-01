import React, { forwardRef, useImperativeHandle, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";

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

const Tradetable = forwardRef((props, ref) => {
  const { rows = [] } = props; // ✅ get rows from props safely

  const [hiddenColumns, setHiddenColumns] = useState([
    "sellTime",
    "sellPrice",
    "risk1R",
    "principal",
    "duration",
    "annualPrf",
  ]);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const combinedArrayWithId = rows.flat().map((item, index) => ({
    id: index,
    ...item,
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
                  label={col.headerName}
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
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.symbol}
        </Typography>
      ),
    },
    {
      field: "buyTime",
      headerName: "Buy Time",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.buyTime}
        </Typography>
      ),
    },

    {
      field: "buyPrice",
      headerName: "Buy Price",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.buyPrice}
        </Typography>
      ),
    },
    {
      field: "sellTime",
      headerName: "Sell Time",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.sellTime}
        </Typography>
      ),
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.sellPrice}
        </Typography>
      ),
    },
    {
      field: "number",
      headerName: "Quantity",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.number}
        </Typography>
      ),
    },
    {
      field: "investment",
      headerName: "Investment",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.investment}
        </Typography>
      ),
    },
    {
      field: "risk1R",
      headerName: "Risk1R",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.risk1R}
        </Typography>
      ),
    },
    {
      field: "principal",
      headerName: "Principal",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.principal}
        </Typography>
      ),
    },
    {
      field: "duration",
      headerName: "Duration",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.duration}
        </Typography>
      ),
    },
    {
      field: "annualPrf",
      headerName: "Annual Profit",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.annualPrf}
        </Typography>
      ),
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.netProfit}
        </Typography>
      ),
    },
    {
      field: "profit",
      headerName: "Profit %",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.profit}
        </Typography>
      ),
    },
    {
      field: "closeReason",
      headerName: "Close Reason",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {params.row.closeReason}
        </Typography>
      ),
    },
    {
      field: "moreaction",
      headerName: "",
      minWidth: 50,
      maxWidth: 60,
      flex: 0, // prevent it from growing or shrinking
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <IconButton
          size="small"
          onClick={(e) => handlePopoverOpen(e, "column")}
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];
  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );
  useImperativeHandle(ref, () => ({
    getCSVData: () => ({
      columns,
      datas: combinedArrayWithId,
      filename: "trade_data",
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
        // transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {popoverContent()}
      </Popover>

      <Box
        className="flex h-full overflow-auto"
        sx={{
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
          borderRadius: 2,
          borderStyle: "solid",
          borderColor: "#E0E0E0",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <DataGrid
          rows={combinedArrayWithId}
          columns={visibleColumns}
          className="h-full"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
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

export default Tradetable;
