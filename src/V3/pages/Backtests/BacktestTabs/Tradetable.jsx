/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CommonCard from "../../../common/Cards/CommonCard";

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

const Tradetable = (props) => {
  const { rows = [] } = props;

  const [hiddenColumns, setHiddenColumns] = useState([
    "sellTime",
    "sellPrice",
    "risk1R",
    "principal",
    "duration",
    "annualPrf",
    "maxPrf",
  ]);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const combinedArrayWithId = rows.flat().map((item, index) => ({
    id: index,
    ...item,
  }));

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("tradeTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsTradeTable"
  );

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
        "hiddenColumnsTradeTable",
        JSON.stringify(updatedColumns)
      );

      return updatedColumns;
    });
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
      width: columnWidths.symbol || 150,
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
      // minWidth: 100,
      width: columnWidths.buyTime || 150,
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
      // minWidth: 100,
      width: columnWidths.buyPrice || 150,
      valueGetter: (_, row) => (row.buyPrice ? parseFloat(row.buyPrice) : 0),
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
      // minWidth: 100,
      width: columnWidths.sellTime || 150,
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
      // minWidth: 100,
      width: columnWidths.sellPrice || 150,
      valueGetter: (_, row) => (row.sellPrice ? parseFloat(row.sellPrice) : 0),
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
      // minWidth: 100,
      width: columnWidths.number || 150,
      valueGetter: (_, row) => (row.number ? parseFloat(row.number) : 0),
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
      // minWidth: 100,
      width: columnWidths.investment || 150,
      valueGetter: (_, row) =>
        row.investment ? parseFloat(row.investment) : 0,
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
      // minWidth: 100,
      width: columnWidths.risk1R || 150,
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
      // minWidth: 100,
      width: columnWidths.principal || 150,
      valueGetter: (_, row) => (row.principal ? parseFloat(row.principal) : 0),
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
      // minWidth: 100,
      width: columnWidths.duration || 150,
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
      // minWidth: 100,
      width: columnWidths.annualPrf || 150,
      valueGetter: (_, row) => (row.annualPrf ? parseFloat(row.annualPrf) : 0),
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
      // minWidth: 100,
      width: columnWidths.netProfit || 150,
      valueGetter: (_, row) => (row.netProfit ? parseFloat(row.netProfit) : 0),
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
      // minWidth: 100,
      width: columnWidths.profit || 150,
      valueGetter: (_, row) => (row.profit ? parseFloat(row.profit) : 0),
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
      field: "maxPrf",
      headerName: "Max Profit",
      // minWidth: 100,
      width: columnWidths.maxPrf || 150,
      valueGetter: (_, row) => (row.profit ? parseFloat(row.profit) : 0),
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
      // minWidth: 100,
      width: columnWidths.closeReason || 150,
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
      // minWidth: 50,
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
    },
  ];

  const handleColumnResize = (params) => {
    const newWidths = {
      ...columnWidths,
      [params.colDef.field]: params.width,
    };

    setColumnWidths(newWidths);
    localStorage.setItem("tradeTableColumnWidths", JSON.stringify(newWidths));
  };

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

  const pageCount = Math.ceil(combinedArrayWithId.length / cardsPerPage);

  const paginatedRows = combinedArrayWithId.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mapRowToDisplay = (row) => ({
    Symbol: row.symbol,
    "Buy Time": row.buyTime,
    "Buy Price": row.buyPrice,
    "Sell Time": row.sellTime,
    "Sell Price": row.sellPrice,
    Quantity: row.number,
    Investment: row.investment,
    "Net Profit": row.netProfit,
    "Profit (%)": row.profit,
    "Close Reason": row.closeReason,
  });

  useEffect(() => {
    if (hiddenColumnsFromLocalStorage) {
      setHiddenColumns(JSON.parse(hiddenColumnsFromLocalStorage));
    }
  }, []);

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
            {combinedArrayWithId.length ? (
              paginatedRows.map((data, i) => (
                <CommonCard key={i} rows={mapRowToDisplay(data)} />
              ))
            ) : (
              <div className="text-center pt-2">No data to show</div>
            )}
          </Box>

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
        </>
      ) : (
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
            disableColumnSelector
            rows={combinedArrayWithId}
            columns={visibleColumns}
            onColumnResize={handleColumnResize}
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
      )}
    </>
  );
};

export default Tradetable;
