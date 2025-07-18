import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Checkbox,
  Chip,
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
  MoreVert as MoreVertIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import Badge from "../../../../common/Badge";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import ActionMenu from "../../../../common/DropDownButton";
import CustomFilterPanel from "./CustomFilterPanel";
import { makeStyles } from "@mui/styles";
import useDateTime from "../../../../hooks/useDateTime";
import DeleteModal from "../../../../common/DeleteModal";
import { useLazyGetQuery } from "../../../../../slices/api";
import CreateDeploy from "../../../Deploy/DeployModal/CreateDeploy";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import SettingsIcon from "@mui/icons-material/Settings";

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

const ViewBacktestResult = ({
  rows,
  setTabIndex,
  setDeployName,
  setIsDeployCreate,
  setRowToDelete,
  setIsDelete,
  isDelete,
  confirmDelete = () => {},
  isDeployCreate,
  deployName,
}) => {
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const classes = useStyles();

  const navigate = useNavigate();

  const rowsWithId = useMemo(
    () =>
      rows.map((row, index) => ({
        id: index + 1,
        ...row,
        backtestSummary: extractSummaryMetrics(row.summary || ""),
      })),
    [rows]
  );

  const handleColumnToggle = (columnField) => {
    setHiddenColumns((prev) =>
      prev.includes(columnField)
        ? prev.filter((col) => col !== columnField)
        : [...prev, columnField]
    );
  };

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
  const handleRowClick = ({ row }) => {
    // if (row.summary?.includes("Backtest command still running")) {
    //   navigate(
    //     `/Backtest/backtest-detail?id=${row.requestId}&name=${row.name}`
    //   );
    // } else if (row.summary?.includes("Backtest summary for")) {
    navigate(`/Backtest/backtest-output?id=${row.requestId}&name=${row.name}`);
    // }
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
    // action === "edit"
    //   ? "/Strategies/edit-strategies"
    // : "/Strategies/view-strategies";

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
    setTabIndex(0);
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
        // minWidth: 100,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Strategy Name",
        // minWidth: 220,
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
        // minWidth: 138,
        renderCell: (params) => (
          <Badge variant="version">{params.row.version || "v1"}</Badge>
        ),
      },
      {
        field: "executionTime",
        headerName: "Created At",
        // minWidth: 140,
        flex: 1,
        renderCell: (params) => (
          <span>{useDateTime(params.row?.executionTime) || "-"}</span>
        ),
      },
      {
        field: "summary",
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
        // minWidth: 140,
        flex: 1,
        valueGetter: (_, row) => {
          return row.summary.includes("still running")
            ? "In Progress"
            : row.summary.includes("Backtest summary for")
            ? "Complete"
            : "Failed";
        },
        renderCell: (params) => {
          const summary = params.row.summary || "";
          const status = summary.includes("still running")
            ? "In Progress"
            : summary.includes("Backtest summary for")
            ? "Complete"
            : "Failed";
          return (
            <Badge variant={status.toLowerCase()} isSquare>
              {status}
            </Badge>
          );
        },
      },
      {
        field: "timeFrame",
        headerName: "Time Frame",
        // minWidth: 140,
        flex: 1,
        valueGetter: (_, row) => `${row.startDate} to ${row.endDate}`,
        renderCell: (params) => (
          <span>{`${params.row.startDate} to ${params.row.endDate}`}</span>
        ),
      },
      {
        field: "initialCapital",
        headerName: "Initial Capital",
        // minWidth: 140,
        flex: 1,
      },
      {
        field: "netProfit",
        headerName: "Net Profit",
        // minWidth: 140,
        flex: 1,
        valueGetter: (_, row) =>
          parseFloat(
            row.backtestSummary?.["Net profit"]?.slice(
              0,
              row.backtestSummary?.["Net profit"].indexOf(" ") + 1
            )
          ) || 0,
        renderCell: (params) => (
          <span>{params.row.backtestSummary?.["Net profit"] || "0"}</span>
        ),
      },
      {
        field: "avgAnnualProfit",
        headerName: "Avg Annual Profit",
        // minWidth: 140,
        flex: 1,
        valueGetter: (_, row) =>
          parseFloat(
            row.backtestSummary?.["avg annual profit"]?.slice(
              0,
              row.backtestSummary?.["avg annual profit"].indexOf(" ") + 1
            )
          ) || 0,
        renderCell: (params) => (
          <span>
            {params.row.backtestSummary?.["avg annual profit"] || "-"}
          </span>
        ),
      },
      {
        field: "totalTrades",
        headerName: "Total Trades",
        // minWidth: 140,
        flex: 1,
        valueGetter: (_, row) =>
          parseFloat(row.backtestSummary?.["Total number of trades"]) || 0,
        renderCell: (params) => (
          <span>
            {params.row.backtestSummary?.["Total number of trades"] || "0"}
          </span>
        ),
      },
      {
        field: "moreaction",
        headerName: "",
        // minWidth: 50,
        maxWidth: 60,
        flex: 0, // prevent it from growing or shrinking
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
                setRowToDelete(params.row.requestId);
              }}
              handleEdit={() => {
                setIsDeployCreate(true);
                setDeployName({
                  name: params.row.name,
                  reqId: params.row.requestId,
                });
              }}
              isDeployStrategy={isDeployable}
              isDeleteButton
            />
          );
        },
      },
    ],
    [navigate, hiddenColumns]
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
          description="This action is irreversible. Once deleted, the backtest and all its data cannot be recovered."
        />
      )}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            maxHeight: 300,
            overflowY: "auto",
            overflowX: "hidden",
          },
        }}
      >
        {popoverContent()}
      </Popover>
      <Box
        className={`${classes.filterModal} flex`}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          overflow: "hidden",
          backgroundColor: "white",
        }}
      >
        <DataGrid
          disableColumnSelector
          rows={filteredRows}
          columns={visibleColumns}
          // hideFooter
          onRowClick={handleRowClick}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
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
};

export default ViewBacktestResult;
