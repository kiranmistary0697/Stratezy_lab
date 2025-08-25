import { useMemo, useState } from "react";
import ActionMenu from "../../../../common/DropDownButton";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Pagination } from "@mui/material";
import Badge from "../../../../common/Badge";
import moment from "moment";
import DeleteModal from "../../../../common/DeleteModal";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CommonCard from "../../../../common/Cards/CommonCard";

const ViewOtherVersion = ({
  selectedVersion = {},
  setDeleteRow,
  setIsDeleteCase,
  isDeleteCase,
  handleDelete = () => {},
  isDeleting,
  setTabIndex,
}) => {
  const [page, setPage] = useState(1);
  const cardsPerPage = 10;
  // const [columnWidths, setColumnWidths] = useState(() => {
  //   try {
  //     const storedWidths = localStorage.getItem("otherVersionColumnWidths");
  //     return storedWidths ? JSON.parse(storedWidths) : {};
  //   } catch (error) {
  //     console.error("Error loading column widths:", error);
  //     return {};
  //   }
  // });

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRowClick = ({ row }) => {
    setTabIndex(0);
    // Called when user clicks a row to view the strategy
    handleStrategyNavigation(
      "view",
      row.id,
      row.name,
      false,
      row.version,
      row.demo
    );
    localStorage.removeItem("stockFilters");
    localStorage.removeItem("marketEntryExit.entry-saved");
    localStorage.removeItem("marketEntryExit.exit-saved");
    localStorage.removeItem("tradeRules.buyRule");
    localStorage.removeItem("stockEntry");
    localStorage.removeItem("stockExit");
    localStorage.removeItem("portfolioSizing-saved");
  };

  const columns = useMemo(
    () => [
      {
        field: "version",
        headerName: "Strategy Version",
        // width: columnWidths.version || 150,
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params?.row?.version || "v1"}</Badge>
        ),
      },
      {
        field: "createdOn",
        headerName: "Timestamp",
        // width: columnWidths.createdOn || 170,
        flex: 1,
        valueGetter: (_, row) => moment(row.timestamp).format("Do MMM YYYY"),
        renderCell: (params) => {
          return moment(params.row.timestamp).format("Do MMM YYYY");
        },
      },
      {
        field: "status",
        headerName: "Status",
        // width: columnWidths.version || 130,
        flex: 1,
        valueGetter: (_, row) => (row?.complete ? "Complete" : "Draft"),
        renderCell: (params) => (
          <Badge variant={params.row?.complete ? "complete" : "draft"}>
            {params.row?.complete ? "Complete" : "Draft"}
          </Badge>
        ),
      },
      {
        field: "description",
        headerName: "Summary",
        // width: columnWidths.version || 180,
        flex: 1,
        renderCell: (params) => {
          return <span>{params?.row?.strategy?.description}</span>;
        },
      },

      {
        field: " ",
        headerAlign: "center",
        sortable: false,
        disableColumnMenu: true,
        // headerName: <Settings className="!size-[12px]" />,
        // minWidth: 5,
        flex: 1,
        renderCell: (params) => (
          <ActionMenu
            isDeleteButton
            handleDelete={() => {
              setDeleteRow({
                name: params.row.name,
                version: params.row.version,
              });
              setIsDeleteCase(true);
            }}
            // variant={params.row.status.toLowerCase()}
          />
        ),
      },
    ],
    // [columnWidths]
    []
  );

  // const handleColumnResize = (params) => {
  //   const newWidths = {
  //     ...columnWidths,
  //     [params.colDef.field]: params.width,
  //   };

  //   setColumnWidths(newWidths);
  //   localStorage.setItem("otherVersionColumnWidths", JSON.stringify(newWidths));
  // };

  const pageCount = Math.ceil(selectedVersion.length / cardsPerPage);

  const paginatedRows = selectedVersion.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
  };

  const mapRowToDisplay = (row) => ({
    version: <Badge variant="version">{row.version || "v1"}</Badge>,
    Timestamp: moment(row.timestamp).format("Do MMM YYYY"),
    Status: (
      <Badge variant={row?.complete ? "complete" : "draft"}>
        {row?.complete ? "Complete" : "Draft"}
      </Badge>
    ),
    Summary: row.description,
  });

  return (
    <>
      {isDeleteCase && (
        <DeleteModal
          isOpen={isDeleteCase}
          handleClose={() => setIsDeleteCase(false)}
          handleConfirm={handleDelete}
          isLoading={isDeleting}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the version and all its data cannot be recovered."
        />
      )}

      {isMobile ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {selectedVersion.length ? (
              paginatedRows.map((data, i) => (
                <CommonCard
                  key={i}
                  rows={mapRowToDisplay(data)}
                  showDelete
                  onRowClick={() => {
                    handleRowClick({ row: data });
                  }}
                  onDelete={() => {
                    setDeleteRow({
                      name: data.name,
                      version: data.version,
                    });
                    setIsDeleteCase(true);
                  }}
                />
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
          className="flex"
          sx={{
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <DataGrid
            disableColumnSelector
            rows={selectedVersion}
            columns={columns}
            // hideFooter
            // getRowId={(row) => row.version}
            getRowId={(row) => `${row.version}-${row.id}`}
            onRowClick={handleRowClick}
            // onColumnResize={handleColumnResize}
            disableSelectionOnClick
            GridLinesVisibility="None"
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

export default ViewOtherVersion;
