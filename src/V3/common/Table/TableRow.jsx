import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import Badge from "../Badge";
import ActionMenu from "../DropDownButton";
import ActionButton from "../ActionButton";
import StrategyTimeline from "../../pages/Strategies/TimeLine/StrategyTimeline";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal";
import {
  useDeleteMutation,
  useLazyGetQuery,
  usePutMutation,
} from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

import {
  DEPLOY_DISABLE,
  DEPLOY_DISABLE_TOOLTIP,
  RUNBACKTEST_DISABLE_TOOLTIP,
} from "../../../constants/CommonText";
import CustomFilterPanel from "../../pages/Strategies/ViewStrategy/ViewModal/CustomFilterPanel";
import { toast } from "react-toastify";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import StrategyCard from "../Cards/StrategyCard";

const FavoriteCell = ({ params, onToggleFavorite }) => {
  return (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(params.row.id);
      }}
      disableRipple
    >
      {params.row.favorite ? (
        <StarIcon sx={{ color: "#FFD34E" }} />
      ) : (
        <StarBorderOutlinedIcon sx={{ color: "#666666" }} />
      )}
    </IconButton>
  );
};

const TableRow = () => {
  const [
    getStrategyData,
    { data: { data: strategyData = [] } = {}, isLoading },
  ] = useLazyGetQuery();

  const [setFavorite] = usePutMutation();
  const hiddenColumnsTableRow = localStorage.getItem("hiddenColumnsTableRow");

  const [getDemoData] = useLazyGetQuery();
  const [deleteData, { isLoading: isDeleting }] = useDeleteMutation();

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [rows, setRows] = useState([]);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const [isDeleteCase, setIsDeleteCase] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});

  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const storedWidths = localStorage.getItem("tableRowColumnWidths");
      return storedWidths ? JSON.parse(storedWidths) : {};
    } catch (error) {
      console.error("Error loading column widths:", error);
      return {};
    }
  });

  const [page, setPage] = useState(1);
  const cardsPerPage = 10;

  const navigate = useNavigate();
  const localSelectedStatus = localStorage.getItem("selectedStatusTableRow");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const clearLocalStrategyContext = () => {
    localStorage.removeItem("stockFilters");
    localStorage.removeItem("marketEntryExit.entry");
    localStorage.removeItem("marketEntryExit.exit");
    localStorage.removeItem("tradeRules.buyRule");
    localStorage.removeItem("stockEntry");
    localStorage.removeItem("stockExit");
    localStorage.removeItem("tradeSequence");
    localStorage.removeItem("portfolioSizing-saved");
  };

  const handleRowClick = (params) => {
    handleStrategyNavigation(
      "view",
      params.row.id,
      params.row.name,
      false,
      params.row.version,
      params.row.demo
    );
    clearLocalStrategyContext();
  };

  const handleStatusFilter = (data) => {
    setSelectedStatuses(data.value || []);
    localStorage.setItem(
      "selectedStatusTableRow",
      JSON.stringify(data.value || [])
    );
  };

  const handleColumnToggle = (field) => {
    setHiddenColumns((prev) => {
      const updatedColumns = prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field];

      localStorage.setItem(
        "hiddenColumnsTableRow",
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
    localStorage.setItem("tableRowColumnWidths", JSON.stringify(newWidths));
  };

  const handleEditStrategy = (id, name, version) => {
    handleStrategyNavigation("edit", id, name, false, version);
  };

  const handleDeployStrategy = (id, name, createdeploy, requestId, version) => {
    navigate(
      `/Deploy?id=${id}&name=${encodeURIComponent(
        name
      )}&createdeploy=${createdeploy}&requestId=${requestId}&version=${version}`
    );
  };

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const status = row.complete ? "Complete" : "Draft";
        return (
          selectedStatuses.length === 0 || selectedStatuses.includes(status)
        );
      }),
    [rows, selectedStatuses]
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

  const popoverContent = () => {
    if (!activeFilter) return null;

    switch (activeFilter) {
      case "status":
        return (
          <CustomFilterPanel
            data={[{ status: "Complete" }, { status: "Draft" }]}
            fieldName="status"
            applyValue={handleStatusFilter}
            title="Select Status"
            dataKey="status"
            selectedValues={selectedStatuses}
            isStatus
            isSquare={false}
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
                ({ field }) => !["favorite", "moreActions"].includes(field)
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

  const fetchAllData = async () => {
    try {
      const allDataResponse = await getStrategyData({
        endpoint: "strategystore/getall",
        tags: [tagTypes.GET_STRATEGY],
      }).unwrap();

      const demoDataResponse = await getDemoData({
        endpoint: "strategystore/get/demo/true",
        tags: [tagTypes.GET_DEMO],
      }).unwrap();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isToday = (timestampStr) => {
        const date = new Date(timestampStr);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      };

      const combinedData = [...demoDataResponse.data, ...allDataResponse.data];

      const sortedRows = combinedData.sort((a, b) => {
        const aIsToday = isToday(a.timestamp);
        const bIsToday = isToday(b.timestamp);

        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;

        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;

        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setRows(sortedRows);
    } catch (error) {
      console.error("Failed to fetch all data:", error);
    }
  };

  const handleToggleFavorite = async (id) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    const { name, version, favorite } = row;

    try {
      await setFavorite({
        endpoint: `strategystore/favorite?name=${name}&version=${version}&set=${!favorite}`,
      }).unwrap();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      fetchAllData();
    }
  };

  const handleDelete = async () => {
    try {
      const delResponse = await deleteData({
        endpoint: `strategystore/delete?name=${deleteRow.name}&version=${deleteRow.version}`,
        tags: [tagTypes.GET_STRATEGY],
      }).unwrap();
      toast.success(delResponse);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      fetchAllData();
      setIsDeleteCase(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (localSelectedStatus) {
      setSelectedStatuses(JSON.parse(localSelectedStatus));
    }
  }, []);

  useEffect(() => {
    if (hiddenColumnsTableRow) {
      setHiddenColumns(JSON.parse(hiddenColumnsTableRow));
    }
  }, []);

  useEffect(() => {
    const syncColumnWidths = () => {
      try {
        const storedWidths = localStorage.getItem("tableRowColumnWidths");
        if (storedWidths) {
          setColumnWidths(JSON.parse(storedWidths));
        }
      } catch (error) {
        console.error("Error syncing column widths:", error);
      }
    };

    syncColumnWidths();
  }, []);

  useEffect(() => {
    if (strategyData.length) {
      setRows(strategyData);
    }
  }, [strategyData]);

  const columns = useMemo(
    () => [
      {
        field: "favorite",
        headerName: "",
        width: columnWidths.favorite || 60,
        disableColumnMenu: true,
        renderCell: (params) =>
          !params.row.demo && (
            <FavoriteCell
              params={params}
              onToggleFavorite={handleToggleFavorite}
            />
          ),
      },
      {
        field: "name",
        headerName: "Name",
        width: columnWidths.name || 200,
        renderCell: (params) => (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{params.row.strategy.name}</span>
              {params.row.demo && <Badge variant="demo">Demo</Badge>}
            </div>
          </div>
        ),
      },
      {
        field: "version",
        headerName: "Version",
        width: columnWidths.version || 120,
        renderCell: (params) => (
          <Badge variant="version">{params?.row?.version || "v1"}</Badge>
        ),
      },
      {
        field: "timestamp",
        headerName: "Created On",
        width: columnWidths.timestamp || 180,
        renderCell: (params) => {
          const timestamp = params.row?.timestamp;
          const date = timestamp ? new Date(timestamp) : new Date();

          const formatted = date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          return <div className="text-[#666666]">{formatted}</div>;
        },
      },
      {
        field: "statusSort",
        headerName: "Status",
        width: columnWidths.statusSort || 150,
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
        valueGetter: (_, row) => (row?.complete ? 1 : 2),
        renderCell: (params) => (
          <Badge variant={params.row?.complete ? "complete" : "draft"}>
            {params.row?.complete ? "Complete" : "Draft"}
          </Badge>
        ),
      },
      {
        field: "description",
        headerName: "Summary",
        width: columnWidths.description || 250,
        renderCell: (params) => (
          <div className="text-[#666666]">
            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "preventOverflow",
                    options: { boundary: "window" },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: "500px",
                    height: "auto",
                    backgroundColor: "white",
                    color: "#000000",
                    fontSize: "14px",
                    overflow: "auto",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  },
                },
              }}
              title={<StrategyTimeline strategy={params.row} />}
            >
              <span>
                {params?.row?.strategy.description || "No description"}
              </span>
            </Tooltip>
          </div>
        ),
      },
      {
        field: "Backtests",
        headerName: "Backtests",
        width: columnWidths.Backtests || 150,
        sortable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const isDraft = !params.row.complete;
          const button = (
            <ActionButton
              action="Backtest"
              label="Run Backtest"
              disabled={isDraft}
              iconClass="ri-play-line"
              onClick={(e) => {
                e.stopPropagation();
                handleStrategyNavigation(
                  "view",
                  params.row.id,
                  params.row.strategy.name,
                  true,
                  params.row?.version,
                  params.row?.demo
                );
              }}
              textColor="#3D69D3"
            />
          );
          return (
            <Box className="flex gap-8 items-center h-full">
              {isDraft ? (
                <Tooltip
                  title={RUNBACKTEST_DISABLE_TOOLTIP}
                  placement="bottom"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontWeight: 400,
                        fontSize: "14px",
                        width: 258,
                        height: 80,
                        gap: 10,
                        borderRadius: "2px",
                        padding: "16px",
                        background: "#FFFFFF",
                        color: "#666666",
                      },
                    },
                  }}
                >
                  <span> {button} </span>
                </Tooltip>
              ) : (
                button
              )}
            </Box>
          );
        },
      },
      {
        field: "Deploy",
        headerName: "Deploy",
        width: columnWidths.Deploy || 150,
        disableColumnMenu: true,
        sortable: false,
        renderCell: (params) => {
          const isDraft =
            !params.row.complete || !params.row?.backtestSummaryRes;

          const button = (
            <ActionButton
              action="Deploy"
              label="Deploy"
              disabled={isDraft}
              iconClass="ri-play-line"
              onClick={(e) => {
                e.stopPropagation();
                handleDeployStrategy(
                  params.row.id,
                  params.row.strategy.name,
                  true,
                  params.row?.backtestSummaryRes?.requestId,
                  params.row?.version
                );
              }}
              textColor="#3D69D3"
            />
          );

          return (
            <Box className="flex gap-8 items-center h-full">
              {isDraft ? (
                <Tooltip
                  title={
                    !params.row.complete
                      ? DEPLOY_DISABLE_TOOLTIP
                      : DEPLOY_DISABLE
                  }
                  placement="bottom"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontWeight: 400,
                        fontSize: "14px",
                        width: 258,
                        height: 100,
                        gap: 10,
                        borderRadius: "2px",
                        padding: "16px",
                        background: "#FFFFFF",
                        color: "#666666",
                      },
                    },
                  }}
                >
                  <span> {button} </span>
                </Tooltip>
              ) : (
                button
              )}
            </Box>
          );
        },
      },

      {
        field: "moreActions",
        headerName: "",
        width: 80,
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
          return !params.row.demo ? (
            <ActionMenu
              formik={params.row}
              id={params.row.name}
              name={params.row.name}
              desc={params.row.strategy.description}
              ver={params.row?.version}
              variant={params.row?.complete ? "complete" : "draft"}
              handleDelete={() => {
                setDeleteRow({
                  name: params.row.name,
                  version: params.row.version,
                });
                setIsDeleteCase(true);
              }}
              handleEdit={() =>
                handleEditStrategy(
                  params.row.id,
                  params.row.name,
                  params.row?.version
                )
              }
              isDeleteButton
              isDuplicateButton
              fetchAllData={fetchAllData}
            />
          ) : (
            <ActionMenu
              formik={params.row}
              id={params.row.name}
              variant={params.row?.complete ? "complete" : "draft"}
              name={params.row.name}
              desc={params.row.strategy.description}
              ver={params.row?.version}
              demoStrategy={params.row?.demo}
              demoData={params.row}
              handleEdit={() =>
                handleEditStrategy(
                  params.row.id,
                  params.row.name,
                  params.row?.version
                )
              }
              isDuplicateButton
              fetchAllData={fetchAllData}
            />
          );
        },
        resizable: false,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        headerClassName: "no-resize-header",
      },
    ],
    [rows, selectedStatuses, hiddenColumns, columnWidths]
  );

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.includes(col.field)),
    [columns, hiddenColumns]
  );

  const pageCount = Math.ceil(rows.length / cardsPerPage);

  const paginatedRows = rows.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (_event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isDeleteCase && (
        <DeleteModal
          isOpen={isDeleteCase}
          handleClose={() => setIsDeleteCase(false)}
          handleConfirm={handleDelete}
          isLoading={isDeleting}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the strategy and all its data cannot be recovered."
        />
      )}
      <Box
        className="flex"
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
        {/* DataGrid version kept commented as in your code */}
      </Box>

      {isMobile ? (
        <>
          <Box display="flex" flexDirection="column" gap={2}>
            {filteredRows.length ? (
              paginatedRows.map((row) => (
                <StrategyCard
                  key={`${row.version}-${row.id}`}
                  row={row}
                  // Navigate when clicking ANYWHERE in the card content
                  onCardClick={() => {
                    handleStrategyNavigation(
                      "view",
                      row.id,
                      row.strategy.name,
                      false,
                      row.version,
                      row.demo
                    );
                    clearLocalStrategyContext();
                  }}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={() =>
                    handleEditStrategy(row.id, row.name, row?.version)
                  }
                  onDeploy={() =>
                    handleDeployStrategy(
                      row.id,
                      row.strategy.name,
                      true,
                      row?.backtestSummaryRes?.requestId,
                      row?.version
                    )
                  }
                  onBacktest={() =>
                    handleStrategyNavigation(
                      "view",
                      row.id,
                      row.strategy.name,
                      true,
                      row.version,
                      row.demo
                    )
                  }
                  onDelete={() => {
                    setDeleteRow({
                      name: row.name,
                      version: row.version,
                    });
                    setIsDeleteCase(true);
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
          className="flex"
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
            rows={filteredRows}
            columns={visibleColumns}
            disableSelectionOnClick
            getRowId={(row) => `${row.version}-${row.id}`}
            onRowClick={handleRowClick}
            onColumnResize={handleColumnResize}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            loading={isLoading}
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
      >
        {popoverContent()}
      </Popover>
    </>
  );
};

export default TableRow;
