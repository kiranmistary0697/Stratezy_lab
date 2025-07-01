import React, { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import Badge from "../../common/Badge";
import CustomFilterPanel from "../Strategies/ViewStrategy/ViewModal/CustomFilterPanel";

import DuplicateModal from "./DuplicateModal";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../common/DeleteModal";
import { useLazyGetQuery, usePostMutation } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

import GlobalFunctionActionMenu from "./GlobalFunctionActionMenu";

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
const FunctionTable = ({ query }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [getAllStock] = usePostMutation();
  const [deleteData, { isLoading: isDeleting }] = useLazyGetQuery();

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});

  const open = Boolean(openDropdown);

  const fetchStockDetails = async () => {
    try {
      const { data } = await getAllStock({
        endpoint: "stock-analysis-function/details",
        payload: {
          filter: true,
          trade: true,
          entry: true,
          exit: true,
          gentry: true,
          gexit: true,
          psizing: true,
          order: true,
          staticFunc: false,
          underlying: false,
          cacheable: false,
        },
        tags: [tagTypes.GET_FILTERTYPE],
      });

      setRows(data?.data);
    } catch (error) {
      console.error("Failed to fetch stock details:", error);
    }
  };

  const handleCreateStrategy = (id) => {
    navigate(`/DevStudio/create-function?id=${id}`);
  };

  const handleRowClick = ({ row }) => {
    navigate(`/Devstudio/edit-function?name=${row.shortFuncName}`);
  };

  const handleStatusFilterOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusFilterClose = () => {
    setAnchorEl(null);
  };

  const handleStatusFilterChange = (filterData) => {
    setSelectedStatuses(filterData.value || []);
  };

  const openPopover = Boolean(anchorEl);

  // const normalizedQuery = String(query).toLowerCase();
  // const searchableFields = ["functionName"];

  const tableRows = (rows?.flat() || [])
    .sort((a, b) => a.symbol?.localeCompare(b.symbol || "") ?? 0)
    .map((item, index) => ({
      id: index + 1,
      ...item,
    }));

  const effectiveStatuses =
    selectedStatuses.includes("Buy") || selectedStatuses.includes("Sell")
      ? [
          ...selectedStatuses.filter((s) => s !== "Buy" && s !== "Sell"),
          "Trade Rule",
        ]
      : selectedStatuses;

  const normalizedQuery = query.toLowerCase();

  const searchedRows = tableRows.filter((row) =>
    row.func?.toLowerCase().includes(normalizedQuery)
  );

  const filteredRows = searchedRows.filter((row) => {
    if (effectiveStatuses.length === 0) return true;

    const rowTypes = [];

    if (row.filter && row.stockList) {
      rowTypes.push("Static");
    } else {
      rowTypes.push("Dynamic");
    }

    if (row.filter) rowTypes.push("Stock Filter");
    if (row.buysell) rowTypes.push("Trade Rule");

    if (row.gentry && row.gexit) {
      rowTypes.push("Global Entry & Exit");
    } else {
      if (row.gentry) rowTypes.push("Global Entry");
      if (row.gexit) rowTypes.push("Global Exit");
    }

    if (row.entry && row.exit) {
      rowTypes.push("Stock Entry & Exit");
    } else {
      if (row.entry) rowTypes.push("Stock Entry");
      if (row.exit) rowTypes.push("Stock Exit");
    }

    if (row.psizing) rowTypes.push("Portfolio Sizing");

    return effectiveStatuses.some((type) => rowTypes.includes(type));
  });

  const handleDelete = async () => {
    try {
      await deleteData({
        endpoint: `stock-analysis-function/delete/${deleteRow.name}`,
        tags: [tagTypes.GET_FILTERTYPE],
      }).unwrap();
    } catch (error) {
    } finally {
      fetchStockDetails();
      setIsDelete(false);
    }
  };

  useEffect(() => {
    fetchStockDetails();
  }, []);
  const columns = [
    {
      field: "shortFuncName",
      headerName: "Function Name",
      minWidth: 280,
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
          >
            <span>{params.row.shortFuncName}</span>
          </div>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 150,
      flex: 1,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
            Type
          </span>
          <IconButton size="small" onClick={handleStatusFilterOpen}>
            <FilterListIcon fontSize="small" />
          </IconButton>

          <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleStatusFilterClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <CustomFilterPanel
              data={[
                { status: "Stock Filter" },
                { status: "Trade Rule" },
                { status: "Global Entry & Exit" },
                { status: "Global Entry" },
                { status: "Global Exit" },
                { status: "Stock Entry & Exit" },
                { status: "Stock Entry" },
                { status: "Stock Exit" },
                { status: "Portfolio Sizing" },
              ]}
              fieldName="status"
              applyValue={handleStatusFilterChange}
              title="Select Type"
              dataKey="status"
            />
          </Popover>
        </Box>
      ),

      renderCell: ({ row }) => {
        const badges = [];

        if (row.filter) {
          badges.push("Stock Filter");
        }

        if (row.buysell) {
          badges.push("Trade Rule");
        }

        if (row.gentry && row.gexit) {
          badges.push("Global Entry & Exit");
        } else if (row.gentry) {
          badges.push("Global Entry");
        } else if (row.gexit) {
          badges.push("Global Exit");
        }

        if (row.entry && row.exit) {
          badges.push("Stock Entry & Exit");
        } else if (row.entry) {
          badges.push("Stock Entry");
        } else if (row.exit) {
          badges.push("Stock Exit");
        }

        if (row.psizing) {
          badges.push("Portfolio Sizing");
        }

        return (
          <Box
            sx={{
              display: "flex",
              gap: "5px",
              flexDirection: "row",
              alignItems: "center",
              height: "100%",
            }}
          >
            {badges.map((label, idx) => {
              return label ? (
                <Badge key={idx} variant="version">
                  <span>{label}</span>
                </Badge>
              ) : (
                "NA"
              );
            })}
          </Box>
        );
      },
    },

    {
      field: "subType",
      headerName: "Sub Type",
      minWidth: 150,
      flex: 1,
      renderHeader: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
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
            Sub Type
          </span>
          <IconButton size="small" onClick={handleStatusFilterOpen}>
            <FilterListIcon fontSize="small" />
          </IconButton>

          <Popover
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleStatusFilterClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <CustomFilterPanel
              data={[
                { status: "Static" },
                { status: "Dynamic" },
                { status: "Buy" },
                { status: "Sell" },
              ]}
              fieldName="status"
              applyValue={handleStatusFilterChange}
              title="Select Type"
              dataKey="status"
            />
          </Popover>
        </Box>
      ),
      renderCell: ({ row }) => {
        const badges = [];

        if (row.filter && row.stockList) {
          badges.push("Static");
        } else {
          badges.push("Dynamic");
        }

        if (row.buysell) {
          badges.push("Buy");
          badges.push("Sell");
        }

        return (
          <Box
            sx={{
              display: "flex",
              gap: "5px",
              flexDirection: "row",
              alignItems: "center",
              height: "100%",
            }}
          >
            {badges.map((label, idx) => {
              return label ? (
                <Badge key={idx} variant="version">
                  <span>{label}</span>
                </Badge>
              ) : (
                "NA"
              );
            })}
          </Box>
        );
      },
    },
    {
      field: "userDefined",
      headerName: "Created By",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0%",
            color: "#666666",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params?.row?.userDefined ? "User" : "System"}
        </Typography>
      ),
    },

    {
      field: "desc",
      headerName: "Description",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const description = params?.row?.desc || "";
        const maxLength = 30;
        const isTruncated = description.length > maxLength;
        const displayText = isTruncated
          ? `${description.slice(0, maxLength)}...`
          : description;

        return (
          <Tooltip title={description} placement="top" arrow>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#666666",
                display: "flex",
                alignItems: "center",
                height: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                cursor: isTruncated ? "pointer" : "default",
              }}
            >
              {displayText}
            </Typography>
          </Tooltip>
        );
      },
    },

    {
      field: "moreActions",
      headerName: "",
      resizable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerClassName: "no-resize-header", // for CSS override
      renderCell: ({ row }) => {
        const isRemove = row?.userDefined;
        return (
          <GlobalFunctionActionMenu
            isDeleteButton={isRemove}
            isDuplicateButton
            isEditButton={isRemove}
            handleDelete={() => {
              setDeleteRow({
                name: row.func,
              });
              setIsDelete(true);
            }}
            handleEdit={() =>
              navigate(`/Devstudio/edit-function?name=${row.shortFuncName}`)
            }
            handleDuplicate={() => setOpenDuplicateModal(true)}
          />
        );
      },
    },
  ];

  return (
    <>
      {openDuplicateModal && (
        <DuplicateModal
          isOpen={openDuplicateModal}
          handleClose={() => setOpenDuplicateModal(false)}
          title="Duplicate Function"
          buttonText="Save Function"
        />
      )}
      {isDelete && (
        <DeleteModal
          isOpen={isDelete}
          handleClose={() => setIsDelete(false)}
          handleConfirm={handleDelete}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the function and all its data cannot be recovered."
        />
      )}
      <Box
        className={`${classes.filterModal} flex`}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          width: "100%",
          height: "auto", // Set a max height for scrolling
          overflow: "auto", // Enable scrolling when content overflows
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          filterModel={filterModel}
          onRowClick={handleRowClick}
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

export default FunctionTable;
