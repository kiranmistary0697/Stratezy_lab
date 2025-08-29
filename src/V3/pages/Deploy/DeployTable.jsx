import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Popover,
  FormGroup,
  Link,
  Pagination,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import Badge from "../../common/Badge";
import ActionButton from "../../common/ActionButton";
import ActionMenu from "../../common/DropDownButton";
import DeleteModal from "../../common/DeleteModal";
import ActionModal from "./DeployModal/ActionModal";
import SuccessModal from "../../common/SuccessModal";

import { useLazyGetQuery, usePostMutation } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeployCard from "../../common/Cards/DeployCard";

const tableTextSx = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  color: "#666666",
  display: "flex",
  alignItems: "center",
  height: "100%",
};

const useStyles = makeStyles({
  filterModal: {
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

const DeployTable = ({
  fetchAllData = () => {},
  startPolling = () => {},
  setLoading,
  setRows,
  rows,
  loading,
}) => {
  const navigate = useNavigate();
  const [getDeployData] = useLazyGetQuery();
  const [deleteDeployData] = usePostMutation();

  const popoverRef = useRef(null);

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("deployTableColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const [isDelete, setIsDelete] = useState(false);
  const [isActiveStrategy, setIsActiveStrategy] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [actionType, setActionType] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsDeploy"
  );

  const handleCreateStrategy = (reqId, name) => {
    navigate(`/Deploy/deploy-detail?id=${reqId}&&name=${name}`);
  };

  const handleRowClick = (params) => {
    if (params.row.state === "OPERATIONAL")
      handleCreateStrategy(params.row.reqId, params.row.name);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeployData({
        endpoint: "strategy/delete",
        payload: {
          exchangeId: rowToDelete.exchange,
          strategyName: rowToDelete.name,
          brokerage: rowToDelete.brokerage,
          version: rowToDelete.version,
        },
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();
      setIsDelete(false);
      fetchAllData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setActiveFilter(null);
  };

  const handleColumnToggle = (field) => {
    setHiddenColumns((prev) => {
      const updatedColumns = prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field];

      localStorage.setItem(
        "hiddenColumnsDeploy",
        JSON.stringify(updatedColumns)
      );

      return updatedColumns;
    });
  };

  const handleColumnResize = (params) => {
    const newWidths = {
      ...columnWidths,
      [params.colDef.field]: params.width,
    };

    setColumnWidths(newWidths);
    localStorage.setItem("deployTableColumnWidths", JSON.stringify(newWidths));
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

  // useEffect(() => {
  //   fetchAllData();
  // }, []);

  useEffect(() => {
    if (hiddenColumnsFromLocalStorage) {
      setHiddenColumns(JSON.parse(hiddenColumnsFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    const syncColumnWidths = () => {
      try {
        const storedWidths = localStorage.getItem("deployTableColumnWidths");
        if (storedWidths) {
          setColumnWidths(JSON.parse(storedWidths));
        }
      } catch (error) {
        console.error("Error syncing column widths:", error);
      }
    };

    syncColumnWidths();
  }, []);

  const filterRow = rows.map((deploy, index) => ({
    id: index + 1,
    ...deploy,
  }));

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
              .filter(({ field }) => !["moreActions"].includes(field))
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
        field: "name",
        headerName: "Strategy Name",
        width: columnWidths.name || 150,
        minWidth: 100,
        renderCell: (params) => (
          <Tooltip
            title={params.row.name || ""} // Use params.row.name instead of params.row.strategy.name
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
              {params.row.name || "-"}
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
        field: "deployedDate",
        headerName: "Deployed On",
        width: columnWidths.deployedDate || 130,
        valueGetter: (_, row) =>
          moment(row.deployedDate, "YYYY/MM/DD").format("Do MMM YYYY"),
        renderCell: (params) => (
          <Typography sx={tableTextSx}>
            {moment(params.row.deployedDate, "YYYY-MM-DD").format(
              "Do MMM YYYY"
            ) || "-"}
          </Typography>
        ),
      },
      {
        field: "dataDate",
        headerName: "Date",
        width: columnWidths.dataDate || 120,
        renderCell: (params) => (
          <Typography sx={tableTextSx}>{params.row.dataDate || "-"}</Typography>
        ),
      },
      {
        field: "state",
        headerName: "Status",
        width: columnWidths.state || 130,
        renderCell: (params) => (
          <Badge variant={params.row.state?.toLowerCase() || "default"}>
            {params.row.state || "-"}
          </Badge>
        ),
      },
      {
        field: "brokerage",
        headerName: "Brokerage",
        width: columnWidths.brokerage || 120,
        renderCell: (params) => (
          <Typography sx={tableTextSx}>
            {params.row.brokerage || "-"}
          </Typography>
        ),
      },
      {
        field: "initialCapital",
        headerName: "Initial Capital",
        width: columnWidths.initialCapital || 150,
        valueGetter: (_, row) =>
          row.initialCapital ? parseFloat(row.initialCapital) : 0,
        renderCell: (params) => {
          const value = params?.row?.initialCapital;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "currentCapital",
        headerName: "Current Capital",
        width: columnWidths.currentCapital || 150,
        valueGetter: (_, row) =>
          row.currentCapital && row.currentCapital !== "N/A"
            ? parseFloat(row.currentCapital)
            : 0,

        renderCell: (params) => {
          const value = params?.row?.currentCapital;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "avgAnProfit",
        headerName: "Avg Annual Profit",
        width: columnWidths.avgAnProfit || 130,
        valueGetter: (_, row) =>
          row.avgAnProfit ? parseFloat(row.avgAnProfit) : 0,
        renderCell: (params) => {
          const value = params?.row?.avgAnProfit;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "avgProfitPerTrade",
        headerName: "Average Profit Per Trade",
        width: columnWidths.avgProfitPerTrade || 130,
        valueGetter: (_, row) =>
          row.avgProfitPerTrade ? parseFloat(row.avgProfitPerTrade) : 0,
        renderCell: (params) => {
          const value = params?.row?.avgProfitPerTrade;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "maxDrawdown",
        headerName: "Max Drawdown",
        width: columnWidths.maxDrawdown || 120,
        valueGetter: (_, row) =>
          row.maxDrawdown ? parseFloat(row.maxDrawdown) : 0,
        renderCell: (params) => {
          const value = params?.row?.maxDrawdown;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "netProfit",
        headerName: "Net Profit",
        width: columnWidths.netProfit || 130,
        valueGetter: (_, row) =>
          row.netProfit ? parseFloat(row.netProfit) : 0,
        renderCell: (params) => {
          const value = params?.row?.netProfit;
          const num = Number(value);

          if (isNaN(num)) {
            return <Typography sx={{ ...tableTextSx }}>0</Typography>;
          }
          return <Typography sx={tableTextSx}>{num.toFixed(2)}</Typography>;
        },
      },
      {
        field: "exchange",
        headerName: "Exchange",
        width: columnWidths.exchange || 80,
        renderCell: (params) => (
          <Typography sx={tableTextSx}>{params.row.exchange || "-"}</Typography>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        width: columnWidths.action || 100,
        valueGetter: (_, row) => (row.active === "Yes" ? 1 : 0),
        renderCell: (params) => {
          const isColor = params.row.active === "Yes" ? "#CD3D64" : "#3D69D3";
          const actionName =
            params.row.active === "Yes" ? "De-activate" : "Activate";

          return (
            <Box className="flex gap-8 items-center h-full">
              <ActionButton
                action="Backtest"
                label={actionName}
                textColor={isColor}
                iconClass="ri-play-line"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionType(actionName);
                  setIsActiveStrategy(true);
                  setSelectedId({
                    strategyName: params.row.name,
                    exchange: params.row.exchange,
                    brokerage: params.row.brokerage,
                    version: params.row.version,
                  });
                }}
              />
            </Box>
          );
        },
      },
      {
        field: "moreActions",
        headerName: "",
        headerAlign: "right",
        align: "right",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 80,
        renderHeader: () => (
          <IconButton
            size="small"
            ref={popoverRef}
            onMouseDown={(e) => {
              e.stopPropagation();
              setPopoverAnchor(popoverRef.current);
              setActiveFilter("column");
            }}
          >
            <SettingsIcon
              fontSize="small"
              color={hiddenColumns.length ? "primary" : ""}
            />
          </IconButton>
        ),

        renderCell: (params) => (
          <ActionMenu
            handleDelete={() => {
              setIsDelete(true);
              setRowToDelete({
                name: params.row.name,
                exchange: params.row.exchange,
                brokerage: params.row.brokerage,
                version: params.row.version,
              });
            }}
            isDeleteButton
          />
        ),
      },
    ],
    [rows, hiddenColumns, columnWidths]
  );

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

  const pageCount = Math.ceil(rows.length / cardsPerPage);

  const paginatedRows = rows.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  return (
    <>
      {/* Delete Modal */}
      {isDelete && (
        <DeleteModal
          isOpen={isDelete}
          handleClose={() => setIsDelete(false)}
          handleConfirm={confirmDelete}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the deploy and all its data cannot be recovered."
        />
      )}

      {/* Action Modal */}
      {isActiveStrategy && (
        <ActionModal
          isOpen={isActiveStrategy}
          handleClose={() => setIsActiveStrategy(false)}
          title={"Are you sure?"}
          buttonText={actionType}
          description={` ${
            actionType === "De-activate"
              ? `Deactivate deployment on ${selectedId?.strategyName}`
              : `Activate deployment on ${selectedId?.strategyName}`
          }`}
          activeDeactive={selectedId}
          setSuccessModalOpen={() => setSuccessModalOpen(true)}
          close={() => setSuccessModalOpen(false)}
          onActionSuccess={() => {
            setTimeout(() => {
              fetchAllData();
            }, 400);
          }}
          // onActionSuccess={startPolling}
        />
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <SuccessModal
          isOpen={successModalOpen}
          handleClose={() => setSuccessModalOpen(false)}
          title="Status Updated"
          name="Status"
          description="Your status has been successfully updated."
          version="v3"
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
        disableRestoreFocus
      >
        {popoverContent()}
      </Popover>

      {/* Data Grid */}
      {isMobile ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {rows.length ? (
              paginatedRows.map((row, i) => (
                <DeployCard
                  key={i}
                  row={row}
                  onBacktest={() => {}}
                  handleActivate={() => {
                    setActionType(
                      row.active === "Yes" ? "De-activate" : "Activate"
                    );
                    setIsActiveStrategy(true);
                    setSelectedId({
                      strategyName: row.name,
                      exchange: row.exchange,
                      brokerage: row.brokerage,
                      version: row.version,
                    });
                  }}
                  handleDelete={() => {
                    setIsDelete(true);
                    setRowToDelete({
                      name: row.name,
                      exchange: row.exchange,
                      brokerage: row.brokerage,
                      version: row.version,
                    });
                  }}
                  onCardClick={() => handleRowClick({ row })}
                  onNameClick={() => {
                    handleStrategyRowClick({ row });
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
          className={`${classes.filterModal}`}
          sx={{ border: "1px solid #E0E0E0", borderRadius: 2 }}
        >
          <DataGrid
            disableColumnSelector
            rows={filterRow}
            getRowId={(row) => `${row.version}-${row.id}`}
            columns={visibleColumns}
            disableSelectionOnClick
            onRowClick={handleRowClick}
            onColumnResize={handleColumnResize}
            loading={loading}
            pageSizeOptions={[10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
                fontSize: "12px",
                color: "#666666",
              },
            }}
          />
        </Box>
      )}
    </>
  );
};

export default DeployTable;
