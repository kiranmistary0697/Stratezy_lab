/* eslint-disable react/display-name */
import { forwardRef, useImperativeHandle, useState } from "react";
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
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { YET_TO_DO_MSG } from "../../../../../../constants/CommonText";

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

const TradeToDoTable = forwardRef((props, ref) => {
  const classes = useStyles();
  const { tradeData = [], isLoading } = props;
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const rowsWithId = tradeData?.map((strategy, index) => ({
    id: index + 1,
    ...strategy,
  }));

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
          <Typography sx={{ ...tableTextSx }}>{params?.row?.symbol}</Typography>
        </Tooltip>
      ),
    },
    // Sanjay ------------
    {
      field: "companyName",
      headerName: "Company",
      // minWidth: 100,
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
    // ---- Sanjay
    {
      field: "number",
      headerName: "Number",
      // minWidth: 100,
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
          <Typography sx={{ ...tableTextSx }}>{params?.row?.number}</Typography>
        </Tooltip>
      ),
    },
    {
      field: "buyPrice",
      headerName: "Buy Price",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.buyPrice ? parseFloat(row.buyPrice) : 0),
      renderCell: (params) => {
        const value = params?.row?.buyPrice;
        const num = Number(value);
        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "sellPrice",
      headerName: "Sell Price",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.sellPrice ? parseFloat(row.sellPrice) : 0),
      renderCell: (params) => {
        const value = params?.row?.sellPrice;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "principal",
      headerName: "Principal",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.principal ? parseFloat(row.principal) : 0),
      renderCell: (params) => {
        const value = params?.row?.principal;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "investment",
      headerName: "Investment",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) =>
        row.investment ? parseFloat(row.investment) : 0,
      renderCell: (params) => {
        const value = params?.row?.investment;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "netProfit",
      headerName: "Net Profit",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.netProfit ? parseFloat(row.netProfit) : 0),
      renderCell: (params) => {
        const value = params?.row?.netProfit;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    /*     {
      field: "profit",
      headerName: "Profit",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.profit ? parseFloat(row.profit) : 0),
      renderCell: (params) => {
        const value = params?.row?.profit;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: "anPrf",
      headerName: "Annual Prf",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.anPrf ? parseFloat(row.anPrf) : 0),
      renderCell: (params) => {
        const value = params?.row?.anPrf;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    }, */
    {
      field: "buyTime",
      headerName: "Buy Time",
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.risk1R ? parseFloat(row.risk1R) : 0),
      renderCell: (params) => {
        const value = params?.row?.risk1R;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    },
    /* {
      field: "prf1R",
      headerName: "Prf1R",
      // minWidth: 100,
      flex: 1,
      valueGetter: (_, row) => (row.prf1R ? parseFloat(row.prf1R) : 0),
      renderCell: (params) => {
        const value = params?.row?.prf1R;
        const num = Number(value);

        return (
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
              {isNaN(num) ? "0" : num.toFixed(2)}
            </Typography>
          </Tooltip>
        );
      },
    }, */
    {
      field: "closeReason",
      headerName: "Close Reason",
      // minWidth: 100,
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
      // minWidth: 100,
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
      // minWidth: 100,
      flex: 1,
      disableColumnMenu: true,
      valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => {
        return (
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
            <div> {params.row.closed ? "EXIT" : "ENTER"}</div>;
          </Tooltip>
        );
      },
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
      // valueGetter: (_, row) => (row.closed ? "EXIT" : "ENTER"),
      renderCell: (params) => {
        return <div> </div>;
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

  const pageCount = Math.ceil(rowsWithId.length / cardsPerPage);

  const paginatedRows = rowsWithId.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mapRowToDisplay = (row) => ({
    Symbol: row.symbol,
    Company: row.companyName,
    Number: row.number,
    "Buy Price": row.buyPrice,
    "Sell Price": row.sellPrice,
    Principal: row.principal,
    Investment: row.investment,
    "Net Profit": row.netProfit,
    "Buy Time": row.buyTime,
    "Sell Time": row.sellTime,
    "Duration Time": row.duration,
    Risk1R: row.risk1R,
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
              "& .row-yetToDo": {
                bgcolor: "#dce9f5",
                // "&:hover": {
                //   bgcolor: "#c3d6f7",
                // },
              },
            }}
            getRowClassName={(params) =>
              params.row.yetToDo ? "row-yetToDo" : ""
            }
          />
        </Box>
      )}
    </>
  );
});

export default TradeToDoTable;
