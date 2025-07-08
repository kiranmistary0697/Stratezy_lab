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
import moment from "moment";
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

const TradeHistroyTable = forwardRef((props, ref) => {
  const { data, query, setCsvData } = props;
  const { reqId } = data;
  const classes = useStyles();
  const [getTradeHistroy] = useLazyGetQuery();

  const [hiddenColumns, setHiddenColumns] = useState([
    "sellTime",
    "sellPrice",
    "risk1R",
    "principal",
    "duration",
    "annualPrf",
    "closeReason",
  ]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchDeployData = async () => {
      setLoading(true);
      try {
        const { data } = await getTradeHistroy({
          endpoint: `command/backtest/tradetable?id=${reqId}`,
          tags: [tagTypes.GET_TRADETABLE],
        }).unwrap();
        setTradeData(data);
      } catch (error) {
        console.error("Failed to fetch deploy data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployData();
  }, []);

  useEffect(() => {
    if (ref.current) {
      setCsvData(ref.current.getCSVData());
    }
  }, [tradeData, query]);

  const normalizedQuery = String(query).toLowerCase();
  const searchableFields = [
    "symbol",
    "buyPrice",
    "buyTime",
    "number",
    "netProfit",
    "investment",
    "duration",
    "closeReason",
  ];

  const rowsWithId = (tradeData?.flat() || [])
    .sort((a, b) => a.symbol?.localeCompare(b.symbol || "") ?? 0)
    .map((item, index) => ({
      id: index + 1,
      ...item,
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
      minWidth: 100,
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
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            ...tableTextSx,
          }}
        >
          {moment(params.row?.buyTime).format("Do MMM YYYY")}
        </Typography>
      ),
    },

    {
      field: "buyPrice",
      headerName: "Buy Price",
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      headerName: "Number",
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      minWidth: 100,
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
      datas: rowsWithId,
      filename: "TradeHistroy_data",
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
          // hideFooter
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          loading={loading}
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

export default TradeHistroyTable;
