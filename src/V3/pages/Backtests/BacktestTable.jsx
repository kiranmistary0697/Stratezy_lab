import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  Popover,
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
import { useDispatch } from "react-redux";

import CustomFilterPanel from "../Strategies/ViewStrategy/ViewModal/CustomFilterPanel";
import DeleteModal from "../../common/DeleteModal";
import Badge from "../../common/Badge";
import CreateDeploy from "../Deploy/DeployModal/CreateDeploy";
import ActionMenu from "../../common/DropDownButton";

import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import { setBacktestData } from "../../../slices/page/reducer";
import useDateTime from "../../hooks/useDateTime";

const useStyles = makeStyles({
  filterModal: {
    "& .MuiDataGrid-filterPanel": {
      display: "none",
    },
  },
});

const BacktestTable = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    getBackTestData,
    { data: { data: backtestData = [] } = {}, isLoading },
  ] = useLazyGetQuery();
  const [deleteData] = useLazyGetQuery();

  const [rows, setRows] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [isDelete, setIsDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeployCreate, setIsDeployCreate] = useState(false);
  const [deployName, setDeployName] = useState({});

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (backtestData?.length) {
      setRows(backtestData);
    }
  }, [backtestData]);

  const fetchAllData = async () => {
    try {
      const response = await getBackTestData({
        endpoint: "command/backtest/findall",
        tags: [tagTypes.BACKTEST],
      }).unwrap();
      setRows(response.data);
      dispatch(setBacktestData(response));
    } catch (error) {
      console.error("Failed to fetch backtest data:", error);
    }
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
      rows.map((row, index) => ({
        id: index + 1,
        ...row,
        backtestSummary: extractSummaryMetrics(row.summary || ""),
      })),
    [rows]
  );

  const filteredRows = useMemo(
    () =>
      rowsWithId.filter((row) => {
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
      }),
    [rowsWithId, selectedStrategies, selectedStatuses]
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
    setHiddenColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
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
      await deleteData({
        endpoint: `command/backtest/delete/${rowToDelete}`,
        tags: [tagTypes.BACKTEST],
      }).unwrap();
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
            applyValue={(data) => setSelectedStrategies(data.value || [])}
            title="Select Strategies"
            dataKey="name"
            isVersion
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
            applyValue={(data) => setSelectedStatuses(data.value || [])}
            title="Select Status"
            dataKey="status"
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
                  label={col.headerName}
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
        minWidth: 100,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Strategy Name",
        minWidth: 220,
        flex: 1.2,
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
              onClick={(e) => handlePopoverOpen(e, "strategy")}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
        renderCell: (params) => (
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
        ),
      },
      {
        field: "version",
        headerName: "Version",
        minWidth: 138,
        renderCell: (params) => (
          <Badge variant="version">{params.row.version || "v1"}</Badge>
        ),
      },
      {
        field: "executionTime",
        headerName: "Created At",
        minWidth: 140,
        flex: 1,
        renderCell: (params) => (
          <span className="text-[#666666]">
            {useDateTime(params.row?.executionTime) || "-"}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
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
              onClick={(e) => handlePopoverOpen(e, "status")}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
        minWidth: 140,
        flex: 1,
        renderCell: (params) => {
          const summary = params.row.summary || "";
          const status = summary.includes("still running")
            ? "In Progress"
            : summary.includes("Backtest summary for")
            ? "Complete"
            : "Failed";
          return (
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
          );
        },
      },
      {
        field: "timeFrame",
        headerName: "Time Frame",
        minWidth: 140,
        flex: 1,
        valueGetter: (_, row) => `${row.startDate} to ${row.endDate}`,
        renderCell: (params) => (
          <span className="text-[#666666]">{`${params.row.startDate} to ${params.row.endDate}`}</span>
        ),
      },
      {
        field: "initialCapital",
        headerName: "Initial Capital",
        minWidth: 140,
        flex: 1,
        renderCell: (params) => (
          <span className="text-[#666666]">{params.row.initialCapital}</span>
        ),
      },
      {
        field: "netProfit",
        headerName: "Net Profit",
        minWidth: 140,
        flex: 1,
        valueGetter: (_, row) => row.backtestSummary?.["Net profit"] ?? "0",
        renderCell: (params) => (
          <span>{params.row.backtestSummary?.["Net profit"] || "0"}</span>
        ),
      },
      {
        field: "avgAnnualProfit",
        headerName: "Avg Annual Profit",
        minWidth: 140,
        flex: 1,
        valueGetter: (_, row) =>
          row.backtestSummary?.["avg annual profit"] || "-",
        renderCell: (params) => (
          <span className="text-[#666666]">
            {params.row.backtestSummary?.["avg annual profit"] || "-"}
          </span>
        ),
      },
      {
        field: "totalTrades",
        headerName: "Total Trades",
        minWidth: 140,
        flex: 1,
        valueGetter: (_, row) =>
          row.backtestSummary?.["Total number of trades"] ?? "0",
        renderCell: (params) => (
          <span className="text-[#666666]">
            {params.row.backtestSummary?.["Total number of trades"] || "0"}
          </span>
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
            />
          );
        },
      },
    ],
    [hiddenColumns]
  );

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

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
          description="This action is irreversible. Once deleted, the deployment and all its data cannot be recovered."
        />
      )}
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
        className={classes.filterModal}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={visibleColumns}
          onRowClick={handleRowClick}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
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
    </>
  );
};

export default BacktestTable;
