import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Popover, Tooltip } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarIcon from "@mui/icons-material/Star";
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
  // const [cachedGet, { data: { data: tableData } = {}, isLoading, isFetching }] =
  //   useLazyCachedGetQuery();
  const [
    getStrategyData,
    { data: { data: strategyData = [] } = {}, isLoading },
  ] = useLazyGetQuery();

  const [setFavorite] = usePutMutation();

  const [getDemoData] = useLazyGetQuery();
  const [deleteData, { isLoading: isDeleting }] = useDeleteMutation();

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [hoveredStrategy, setHoveredStrategy] = useState(null);

  const [isDeleteCase, setIsDeleteCase] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});
  // const { authToken } = useAuth();

  const navigate = useNavigate();

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

  const handleRowClick = (params) => {
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
    localStorage.removeItem("marketEntryExit.entry");
    localStorage.removeItem("marketEntryExit.exit");
    localStorage.removeItem("tradeRules.buyRule");
    localStorage.removeItem("stockEntry");
    localStorage.removeItem("stockExit");
    localStorage.removeItem("tradeSequence");
    localStorage.removeItem("portfolioSizing-saved");
  };

  const handleEditStrategy = (id, name, version) => {
    // Called when user clicks an Edit button
    handleStrategyNavigation("edit", id, name, false, version);
  };

  const handleDeployStrategy = (id, name, createdeploy, requestId, version) => {
    navigate(
      `/Deploy?id=${id}&name=${encodeURIComponent(
        name
      )}&createdeploy=${createdeploy}&requestId=${requestId}&version=${version}`
    );
  };

  const [rows, setRows] = useState([]);

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

      // Clone and sort only allDataResponse by name
      const sortedAllData = [...allDataResponse.data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Combine: demo data on top, then sorted strategy data
      const combinedData = [...demoDataResponse.data, ...sortedAllData];

      const sortedRows = [...combinedData].sort((a, b) => {
        if (a.favorite === b.favorite) return 0;
        return a.favorite ? -1 : 1; // favorite = true goes up
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
      await deleteData({
        endpoint: `strategystore/delete?name=${deleteRow.name}&version=${deleteRow.version}`,
        tags: [tagTypes.GET_STRATEGY],
      }).unwrap();
    } catch (error) {
    } finally {
      fetchAllData();
      setIsDeleteCase(false);
    }
  };

  useEffect(() => {
    fetchAllData();
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
        minWidth: 30,
        disableColumnMenu: true,
        flex: 1,
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
        minWidth: 180,
        flex: 1,
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
        minWidth: 138,
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params?.row?.version || "v1"}</Badge>
        ),
      },
      {
        field: "timestamp",
        headerName: "Created On",
        flex: 1,
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
        minWidth: 150,
      },
      {
        field: "complete",
        headerName: "Status",
        minWidth: 150,
        flex: 1,
        renderCell: (params) => (
          <Badge variant={params.row?.complete ? "complete" : "draft"}>
            {params.row?.complete ? "Complete" : "Draft"}
          </Badge>
        ),
      },
      {
        field: "description",
        headerName: "Summary",
        minWidth: 180,
        flex: 1,
        renderCell: (params) => (
          <div
            onMouseEnter={() => setHoveredStrategy(params.row)} // Set hovered row data
            onMouseLeave={() => setHoveredStrategy(null)} // Clear on mouse leave
            className="text-[#666666]"
          >
            <Tooltip
              PopperProps={{
                modifiers: [
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "window",
                    },
                  },
                ],
              }}
              componentsProps={{
                tooltip: {
                  // className: "!w-[348px] ",
                  className: "!w-[500px] ",
                  sx: {
                    backgroundColor: "white", // Change to your desired color
                    color: "white", // Change text color if needed
                    fontSize: "14px", // Adjust font size
                  },
                },
              }}
              title={<StrategyTimeline strategy={params.row} />}
            >
              <span>{params?.row?.strategy.description}</span>
            </Tooltip>
          </div>
        ),
      },
      {
        field: "Backtests",
        headerName: "Backtests",
        minWidth: 150,
        flex: 1,
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
                  // key={index}
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
                // <Tooltip title="Cannot deploy draft strategy">{button}</Tooltip>
                button
              )}
            </Box>
          );
        },
      },
      {
        field: "Deploy",
        headerName: "Deploy",
        minWidth: 150,
        flex: 1,
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
                  // key={index}
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
                // <Tooltip title="Cannot deploy draft strategy">{button}</Tooltip>
                button
              )}
            </Box>
          );
        },
      },

      {
        field: "moreActions",
        headerName: "",
        flex: 1,
        renderCell: (params) => {
          return !params.row.demo ? (
            <ActionMenu
              formik={params.row}
              id={params.row.name}
              name={params.row.name}
              desc={params.row.strategy.description}
              ver={params.row?.version}
              // demoStrategy={params.row?.demo}
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
              // isEditButton
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
              // handleDelete={() => setIsDeleteCase(true)}
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
        headerClassName: "no-resize-header", // for CSS override
      },
    ],
    [rows]
  );

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
        <DataGrid
          rows={rows}
          columns={columns}
          // hideFooter
          disableSelectionOnClick
          onRowClick={handleRowClick}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          GridLinesVisibility="None"
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
};

export default TableRow;
