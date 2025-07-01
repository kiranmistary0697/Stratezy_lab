import React, { useEffect, useMemo, useState } from "react";
import ActionMenu from "../../../../common/DropDownButton";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Badge from "../../../../common/Badge";
import { Settings } from "@mui/icons-material";
import moment from "moment";
import { useDeleteMutation } from "../../../../../slices/api";
import { tagTypes } from "../../../../tagTypes";
import DeleteModal from "../../../../common/DeleteModal";
import { useNavigate } from "react-router-dom";

const ViewOtherVersion = ({
  selectedVersion = {},
  setDeleteRow,
  setIsDeleteCase,
  isDeleteCase,
  handleDelete = () => {},
  isDeleting,
  setTabIndex,
}) => {
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
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params?.row?.version || "v1"}</Badge>
        ),
      },
      {
        field: "createdOn",
        headerName: "timestamp",
        valueGetter: (_, row) => moment(row.timestamp).format("Do MMM YYYY"),
        renderCell: (params) => {
          return moment(params.row.timestamp).format("Do MMM YYYY");
        },
        minWidth: 150,
        flex: 1,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
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
        renderCell: (params) => {
          return <span>{params?.row?.strategy?.description}</span>;
        },
        minWidth: 200,
        flex: 1,
      },

      {
        field: " ",
        headerAlign: "center",
        sortable: false,
        disableColumnMenu: true,
        // headerName: <Settings className="!size-[12px]" />,
        minWidth: 5,
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
    []
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
          description="This action is irreversible. Once deleted, the version and all its data cannot be recovered."
        />
      )}

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
          rows={selectedVersion}
          columns={columns}
          // hideFooter
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
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
    </>
  );
};

export default ViewOtherVersion;
