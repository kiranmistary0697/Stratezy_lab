/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
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
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";

import CustomFilterPanel from "../Strategies/ViewStrategy/ViewModal/CustomFilterPanel";
import DeleteModal from "../../common/DeleteModal";
import Badge from "../../common/Badge";
import CreateDeploy from "../Deploy/DeployModal/CreateDeploy";
import ActionMenu from "../../common/DropDownButton";

import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import useDateTime from "../../hooks/useDateTime";
import { toast } from "react-toastify";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import BacktestCard from "../../common/Cards/BacktestCard";

const useStyles = makeStyles({
  filterModal: {
    "& .MuiDataGrid-filterPanel": {
      display: "none",
    },
  },
});

const BacktestTable = ({
  isLoading,
  fetchAllData,
  rows,
  seletedRows = [],
  setSeletedRows = () => {},
  confirmMultiDelete = () => {},
  setIsRowSelectionEnabled = () => {},
  setIsMultideleteOpen = () => {},
  isRowSelectionEnabled = false,
  isMultideleteOpen = false,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [deleteData] = useLazyGetQuery();
  const localSelectedStatus = localStorage.getItem(
    "selectedStatusBackTestTable"
  );
  const localSelectedStrategies = localStorage.getItem(
    "localSelectedStrategies"
  );
  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsBacktestTable"
  );

  const [filterModel, setFilterModel] = useState({ items: [] });

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("backtestTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [isDelete, setIsDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeployCreate, setIsDeployCreate] = useState(false);
  const [deployName, setDeployName] = useState({});

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  useEffect(() => {
    if (localSelectedStatus) {
      setSelectedStatuses(JSON.parse(localSelectedStatus));
    }
    if (localSelectedStrategies) {
      setSelectedStrategies(JSON.parse(localSelectedStrategies));
    }
  }, []);

  useEffect(() => {
    const syncColumnWidths = () => {
      try {
        const storedWidths = localStorage.getItem("backtestTableColumnWidths");
        if (storedWidths) {
          setColumnWidths(JSON.parse(storedWidths));
        }
      } catch (error) {
        console.error("Error syncing column widths:", error);
      }
    };

    syncColumnWidths();
  }, []);

  const extractErrorList = (logString) => {
    let errors = [];
    try {
      // Remove the non-JSON parts and parse the JSON
      const errorSectionMatch = logString.match(
        /Error -\s*(\[[\s\S]*?\])\s*-----------/
      );
      if (errorSectionMatch && errorSectionMatch[1]) {
        const errorArray = JSON.parse(errorSectionMatch[1].trim());
        errors = errorArray.flatMap((errorObj) => errorObj.errorList || []);
      }
    } catch (e) {
      // console.error("Failed to parse log string:", e);
    }
    return errors.filter((error) => error !== "");
  };

  const extractSummaryMetrics = (rawString = "") => {
    const summary = {};
    rawString.split("\n").forEach((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        const cleanedValue = value?.trim();

        if (
          cleanedValue && // not undefined or empty
          cleanedValue.toLowerCase() !== "null" &&
          cleanedValue.toLowerCase() !== "null %" &&
          cleanedValue.toLowerCase() !== "null days"
        ) {
          summary[key.trim()] = cleanedValue;
        }
      }
    });
    return summary || "-";
  };

  const rowsWithId = useMemo(
    () =>
      rows
        .map((row) => ({
          id: row.requestId,
          ...row,
          backtestSummary: extractSummaryMetrics(row.summary || ""),
        }))
        .sort((a, b) => new Date(a.executionTime) - new Date(b.executionTime)),
    [rows]
  );

  const filteredRows = useMemo(
    () =>
      rowsWithId
        .filter((row) => {
          const summary = row.summary || "";
          const status = summary.includes("still running")
            ? "In Progress"
            : summary.includes("Backtest summary for")
            ? "Complete"
            : "Failed";
          return (
            (selectedStrategies.length === 0 ||
              selectedStrategies.includes(row.name)) &&
            (selectedStatuses.length === 0 || selectedStatuses.includes(status))
          );
        })
        ?.reverse(),
    [rowsWithId, selectedStrategies, selectedStatuses, seletedRows]
  );

  const handleColumnResize = (params) => {
    const newWidths = {
      ...columnWidths,
      [params.colDef.field]: params.width,
    };

    setColumnWidths(newWidths);
    localStorage.setItem(
      "backtestTableColumnWidths",
      JSON.stringify(newWidths)
    );
  };

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
        "hiddenColumnsBacktestTable",
        JSON.stringify(updatedColumns)
      );

      return updatedColumns;
    });
  };

  const handleRowClick = ({ row }) => {
    row.summary.includes("still running")
      ? navigate(
          `/Backtest/backtest-detail?id=${row.requestId}&name=${row.name}`
        )
      : row.summary.includes("Backtest summary for")
      ? navigate(
          `/Backtest/backtest-output?id=${row.requestId}&name=${row.name}`
        )
      : "";
  };

  const handleStatusFilter = (data) => {
    setSelectedStatuses(data.value || []);
    localStorage.setItem(
      "selectedStatusBackTestTable",
      JSON.stringify(data.value || [])
    );
  };
  const handleStarategiesFilter = (data) => {
    setSelectedStrategies(data.value || []);
    localStorage.setItem(
      "localSelectedStrategies",
      JSON.stringify(data.value || [])
    );
  };

  const handleStrategyNavigation = (
    action,
    id,
    name,
    runbacktest = false,
    version,
    demo
  ) => {
    const basePath = "/Strategies/edit-strategies";

    const query = new URLSearchParams({
      id,
      name,
      version,
      ...(action === "view" && {
        runbacktest,
        action,
        version: version ?? "v1",
      }),
      demo,
    });

    navigate(`${basePath}?${query.toString()}`);
    localStorage.removeItem("stockBundle-saved");
  };
  const handleStrategyRowClick = (params) => {
    // Called when user clicks a row to view the strategy
    handleStrategyNavigation(
      "view",
      params.row.id,
      params.row.name,
      false,
      params.row.version,
      params.row.demo
    );
    localStorage.removeItem("stockFilters");
    localStorage.removeItem("marketEntryExit.entry-saved");
    localStorage.removeItem("marketEntryExit.exit-saved");
    localStorage.removeItem("tradeRules.buyRule");
    localStorage.removeItem("stockEntry");
    localStorage.removeItem("stockExit");
    localStorage.removeItem("portfolioSizing-saved");
  };
  const confirmDelete = async () => {
    try {
      const { data } = await deleteData({
        endpoint: `command/backtest/delete/${rowToDelete}`,
        tags: [tagTypes.BACKTEST],
      }).unwrap();

      toast.success(data?.message);
      setIsDelete(false);
      fetchAllData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const popoverContent = () => {
    if (!activeFilter) return null;

    switch (activeFilter) {
      case "strategy":
        return (
          <CustomFilterPanel
            data={rowsWithId}
            fieldName="name"
            applyValue={handleStarategiesFilter}
            title="Select Strategies"
            dataKey="name"
            isVersion
            selectedValues={selectedStrategies}
          />
        );
      case "status":
        return (
          <CustomFilterPanel
            data={[
              { status: "In Progress" },
              { status: "Complete" },
              { status: "Failed" },
            ]}
            fieldName="status"
            applyValue={handleStatusFilter}
            title="Select Status"
            dataKey="status"
            selectedValues={selectedStatuses}
            isStatus
          />
        );
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

  const columns = useMemo(
    () => [
      {
        field: "requestId",
        headerName: "Request ID",
        width: columnWidths.requestId || 120,
      },
      {
        field: "name",
        headerName: "Strategy Name",
        width: columnWidths.name || 180,
        minWidth: 100,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#666666",
              }}
            >
              Strategy Name
            </span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handlePopoverOpen(e, "strategy");
              }}
              sx={{
                backgroundColor: selectedStrategies.length ? "#D0E7FF" : "",
              }}
            >
              <FilterListIcon
                fontSize="small"
                color={selectedStrategies.length ? "primary" : ""}
              />
            </IconButton>
          </Box>
        ),
        renderCell: (params) => (
          <Tooltip
            title={params.row.name || ""}
            placement="bottom"
            componentsProps={{
              tooltip: {
                sx: {
                  fontFamily: "inherit",
                  fontWeight: 400,
                  fontSize: "14px",
                  gap: 10,
                  borderRadius: "2px",
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#666666",
                },
              },
            }}
          >
            <Link
              component="button"
              underline="none"
              color="#3D69D3"
              onClick={(e) => {
                e.stopPropagation();
                handleStrategyRowClick(params);
              }}
            >
              {params.row.name}
            </Link>
          </Tooltip>
        ),
      },
      {
        field: "version",
        headerName: "Version",
        width: columnWidths.version || 80,
        renderCell: (params) => (
          <Badge variant="version">{params.row.version || "v1"}</Badge>
        ),
      },
      {
        field: "executionTime",
        headerName: "Created At",
        width: columnWidths.executionTime || 160,
        renderCell: (params) => (
          <span className="text-[#666666]">
            {useDateTime(params.row?.executionTime) || "-"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: columnWidths.status || 100,
        valueGetter: (_, row) => {
          const summary = row.summary || "";
          if (summary.includes("still running")) return "In Progress";
          if (summary.includes("Backtest summary for")) return "Complete";
          return "Failed";
        },
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <span
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#666666",
              }}
            >
              Status
            </span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handlePopoverOpen(e, "status");
              }}
              sx={{
                backgroundColor: selectedStatuses.length ? "#D0E7FF" : "",
              }}
            >
              <FilterListIcon
                fontSize="small"
                color={selectedStatuses.length ? "primary" : ""}
              />
            </IconButton>
          </Box>
        ),
        renderCell: (params) => {
          const summary = params.row.summary || "";
          const status = summary.includes("still running")
            ? "In Progress"
            : summary.includes("Backtest summary for")
            ? "Complete"
            : "Failed";

          const errorListArray = extractErrorList(summary);

          return (
            <Tooltip
              title={
                <span>
                  {errorListArray.map((err, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "Inter",
                        // fontWeight: 500,
                        fontSize: "12px",
                        lineHeight: "120%",
                        letterSpacing: "0%",
                        color: "#0A0A0A",
                      }}
                    >
                      {`${index + 1}. ${err}`}
                    </Typography>
                  ))}
                </span>
              }
              placement="right-end"
              componentsProps={{
                tooltip: {
                  sx: {
                    visibility: errorListArray.length ? "visible" : "hidden",
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                  },
                },
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Badge variant={status.toLowerCase()} isSquare>
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "22px",
                      letterSpacing: "0%",
                    }}
                  >
                    {status}
                  </span>
                </Badge>
              </Box>
            </Tooltip>
          );
        },
      },
      {
        field: "timeFrame",
        headerName: "Time Frame",
        width: columnWidths.timeFrame || 160,
        valueGetter: (_, row) => `${row.startDate} to ${row.endDate}`,
        renderCell: (params) => (
          <span className="text-[#666666]">{`${params.row.startDate} to ${params.row.endDate}`}</span>
        ),
      },
      {
        field: "initialCapital",
        headerName: "Initial Capital",
        width: columnWidths.initialCapital || 90,
        renderCell: (params) => {
          const value = params?.row?.initialCapital;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>₹0</span>;
          }

          return <span>₹{num.toFixed(2)}</span>;
        },
      },
      {
        field: "netProfit",
        headerName: "Net Profit",
        width: columnWidths.netProfit || 90,
        valueGetter: (_, row) =>
          row.netProfit ? parseFloat(row.netProfit) : 0,
        renderCell: (params) => {
          const value = params?.row?.netProfit;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>₹0</span>;
          }

          return <span>₹{num.toFixed(2)}</span>;
        },
      },
      {
        field: "maxDrawdown",
        headerName: "Max Drawdown",
        width: columnWidths.maxDrawdown || 100,
        valueGetter: (_, row) =>
          row?.maxDrawdown ? parseFloat(row.maxDrawdown) : 0,
        renderCell: (params) => {
          const value = params?.row?.maxDrawdown;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "maxAccountValue",
        headerName: "Max Account Value",
        width: columnWidths.maxAccountValue || 100,
        valueGetter: (_, row) =>
          row?.maxAccountValue ? parseFloat(row.maxAccountValue) : 0,
        renderCell: (params) => {
          const value = params?.row?.maxAccountValue;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>₹0</span>;
          }

          return <span>₹{num.toFixed(2)}</span>;
        },
      },
      {
        field: "avgProfitPerTrade",
        headerName: "Average profit/trade",
        width: columnWidths.avgProfitPerTrade || 100,
        valueGetter: (_, row) =>
          row?.avgProfitPerTrade ? parseFloat(row.avgProfitPerTrade) : 0,
        renderCell: (params) => {
          const value = params?.row?.avgProfitPerTrade;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "expectancy",
        headerName: "Expectancy",
        width: columnWidths.expectancy || 100,
        valueGetter: (_, row) =>
          row?.expectancy ? parseFloat(row.expectancy) : 0,
        renderCell: (params) => {
          const value = params?.row?.expectancy;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "sharpeRatio",
        headerName: "Sharpe ratio",
        width: columnWidths.sharpeRatio || 100,
        valueGetter: (_, row) =>
          row?.sharpeRatio ? parseFloat(row.sharpeRatio) : 0,
        renderCell: (params) => {
          const value = params?.row?.sharpeRatio;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "sqn",
        headerName: "SQN",
        width: columnWidths.sqn || 100,
        valueGetter: (_, row) => (row?.sqn ? parseFloat(row.sqn) : 0),
        renderCell: (params) => {
          const value = params?.row?.sqn;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "avgAnnualProfit",
        headerName: "Avg Annual Profit",
        width: columnWidths.avgAnnualProfit || 100,
        valueGetter: (_, row) =>
          row.avgAnnualProfit ? parseFloat(row.avgAnnualProfit) : 0,
        renderCell: (params) => {
          const value = params?.row?.avgAnnualProfit;
          const num = Number(value);

          if (isNaN(num)) {
            return <span>0</span>;
          }

          return <span>{num.toFixed(2)}</span>;
        },
      },
      {
        field: "totalTrades",
        headerName: "Total Trades",
        width: columnWidths.totalTrades || 90,
        valueGetter: (_, row) =>
          row.backtestSummary?.["Total number of trades"]
            ? parseFloat(row.backtestSummary["Total number of trades"])
            : 0,
        renderCell: (params) => (
          <span className="text-[#666666]">
            {params.row.backtestSummary?.["Total number of trades"] || "0"}
          </span>
        ),
      },
      {
        field: "moreaction",
        headerName: "",
        width: 80,
        maxWidth: 80,
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
        renderCell: (params) => {
          const isDeployable = params.row.summary?.includes(
            "Backtest summary for"
          );
          return (
            <ActionMenu
              formik={params.row}
              id={params.row.name}
              handleDelete={() => {
                setIsDelete(true);
                setRowToDelete(params.row?.requestId);
              }}
              handleEdit={() => {
                setIsDeployCreate(true);
                setDeployName({
                  name: params.row?.name,
                  reqId: params.row?.requestId,
                  version: params.row?.version,
                });
              }}
              isDeployStrategy={isDeployable}
              isDeleteButton
              isDeleteMultipleButton
              handleMultiDelete={() => {
                setIsRowSelectionEnabled(true);
              }}
              isRowSelectionEnabled={isRowSelectionEnabled}
            />
          );
        },
      },
    ],
    [
      hiddenColumns,
      selectedStrategies,
      selectedStatuses,
      seletedRows,
      isRowSelectionEnabled,
      isMultideleteOpen,
      columnWidths,
    ]
  );

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

  useEffect(() => {
    if (hiddenColumnsFromLocalStorage) {
      setHiddenColumns(JSON.parse(hiddenColumnsFromLocalStorage));
    }
  }, []);

  const pageCount = Math.ceil(rowsWithId.length / cardsPerPage);

  const paginatedRows = rowsWithId.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  return (
    <>
      {isDeployCreate && (
        <CreateDeploy
          isOpen={isDeployCreate}
          handleClose={() => setIsDeployCreate(false)}
          title="Deploy Strategy"
          buttonText="Deploy Strategy"
          deployStrategy={deployName}
        />
      )}
      {isDelete && (
        <DeleteModal
          isOpen={isDelete}
          handleClose={() => setIsDelete(false)}
          handleConfirm={confirmDelete}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the backtest and all its data cannot be recovered."
        />
      )}
      {isMultideleteOpen && (
        <DeleteModal
          isOpen={isMultideleteOpen}
          handleClose={() => setIsMultideleteOpen(false)}
          handleConfirm={confirmMultiDelete}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the backtest and all its data cannot be recovered."
        />
      )}
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
              paginatedRows.map((row, index) => (
                <BacktestCard
                  key={index}
                  row={row}
                  onDeploy={() => {
                    setIsDeployCreate(true);
                    setDeployName({
                      name: row?.name,
                      reqId: row?.requestId,
                      version: row?.version,
                    });
                  }}
                  onDelete={() => {
                    setIsDelete(true);
                    setRowToDelete(row?.requestId);
                  }}
                  extractSummaryMetrics={extractSummaryMetrics}
                  handleStrategyRowClick={handleStrategyRowClick}
                  onBacktestClick={(row) => {
                    if (row.summary.includes("still running")) {
                      navigate(
                        `/Backtest/backtest-detail?id=${row.requestId}&name=${row.name}`
                      );
                    } else if (row.summary.includes("Backtest summary for")) {
                      navigate(
                        `/Backtest/backtest-output?id=${row.requestId}&name=${row.name}`
                      );
                    }
                  }}
                />
              ))
            ) : (
              <div className="text-center pt-2">No data to show</div>
            )}
          </Box>

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
        </>
      ) : (
        <Box
          className={classes.filterModal}
          sx={{
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            backgroundColor: "white",
          }}
        >
          <DataGrid
            checkboxSelection={isRowSelectionEnabled}
            selectionModel={seletedRows}
            onRowSelectionModelChange={(newSelection) => {
              setSeletedRows(newSelection);
            }}
            rows={filteredRows}
            columns={visibleColumns}
            onRowClick={handleRowClick}
            onColumnResize={handleColumnResize}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            disableColumnSelector
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
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
};

export default BacktestTable;
