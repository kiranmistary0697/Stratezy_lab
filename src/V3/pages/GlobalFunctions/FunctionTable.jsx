import { useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
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
  const localSelectedStatus = localStorage.getItem("selectedStatus");
  const localSelectedSubStatuses = localStorage.getItem("selectedSubStatuses");
  const localSelectedCreatedBy = localStorage.getItem("selectedCreatedBy");

  const classes = useStyles();
  const navigate = useNavigate();
  const [getAllStock] = usePostMutation();
  const [deleteData, { isLoading: isDeleting }] = useLazyGetQuery();

  const [filterModel, setFilterModel] = useState({ items: [] });
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedSubStatuses, setSelectedSubStatuses] = useState([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState([]);
  const [typeAnchorEl, setTypeAnchorEl] = useState(null);
  const [subTypeAnchorEl, setSubTypeAnchorEl] = useState(null);
  const [createdByAnchor, setCreatedByAnchor] = useState(null);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});

  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hiddenColumnsFromLocalStorage = localStorage.getItem(
    "hiddenColumnsFunctionTable"
  );

  const fetchStockDetails = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
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
        ? prev.filter((f) => f !== field)
        : [...prev, field];

      localStorage.setItem(
        "hiddenColumnsFunctionTable",
        JSON.stringify(updatedColumns)
      );

      return updatedColumns;
    });
  };

  const handleRowClick = ({ row }) => {
    navigate(`/Devstudio/edit-function?name=${row.shortFuncName}`);

    localStorage.removeItem("argsData");
    localStorage.removeItem("editorFunctionCode");
    localStorage.removeItem("selectedValues");
    localStorage.removeItem("selectedTypes");
  };

  // Separate handler for type filter
  const handleTypeFilterOpen = (event) => {
    setTypeAnchorEl(event.currentTarget);
  };

  const handleTypeFilterClose = () => {
    setTypeAnchorEl(null);
  };

  // Separate handler for subType filter
  const handleSubTypeFilterOpen = (event) => {
    setSubTypeAnchorEl(event.currentTarget);
  };

  const handleCreatedByFilterOpen = (event) => {
    setCreatedByAnchor(event.currentTarget);
  };

  const handleCreatedByFilterClose = () => {
    setCreatedByAnchor(null);
  };

  const handleSubTypeFilterClose = () => {
    setSubTypeAnchorEl(null);
  };

  const handleStatusFilterChange = (filterData) => {
    setSelectedStatuses(filterData.value || []);
    localStorage.setItem(
      "selectedStatus",
      JSON.stringify(filterData.value || [])
    );
  };

  const handleSubTypeFilterChange = (filterData) => {
    setSelectedSubStatuses(filterData.value || []);
    localStorage.setItem(
      "selectedSubStatuses",
      JSON.stringify(filterData.value || [])
    );
  };

  const handleCreatedByFilterChange = (filterData) => {
    setSelectedCreatedBy(filterData.value || []);
    localStorage.setItem(
      "selectedCreatedBy",
      JSON.stringify(filterData.value || [])
    );
  };

  useEffect(() => {
    if (localSelectedStatus) {
      setSelectedStatuses(JSON.parse(localSelectedStatus));
    }
    if (localSelectedSubStatuses) {
      setSelectedSubStatuses(JSON.parse(localSelectedSubStatuses));
    }
    if (localSelectedCreatedBy) {
      setSelectedCreatedBy(JSON.parse(localSelectedCreatedBy));
    }
  }, []);

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

  const searchedRows = tableRows.filter((row) => {
    const filteredRow =
      row.func?.toLowerCase().includes(normalizedQuery) ||
      row.shortFuncName?.toLowerCase().includes(normalizedQuery);
    return filteredRow;
  });

  const filteredRows = searchedRows.filter((row) => {
    if (
      effectiveStatuses.length === 0 &&
      selectedSubStatuses.length === 0 &&
      selectedCreatedBy.length === 0
    )
      return true;

    const rowTypes = [];
    const rowSubTypes = [];
    const rowCreatedBy = [];

    if (row.filter && row.stockList) {
      rowSubTypes.push("Static");
    } else {
      rowSubTypes.push("Dynamic");
    }

    if (row.filter) rowTypes.push("Stock Filter");
    if (row.buysell) {
      rowTypes.push("Trade Rule");
      rowSubTypes.push("Buy");
      rowSubTypes.push("Sell");
    }

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

    if (row.sort) rowTypes.push("Trade Sequence");
    if (row.ulying) rowTypes.push("Utility");

    rowCreatedBy.push(row.userDefined ? "User" : "System");

    const matchesType =
      effectiveStatuses.length === 0 ||
      effectiveStatuses.some((type) => rowTypes.includes(type));
    const matchesSubType =
      selectedSubStatuses.length === 0 ||
      selectedSubStatuses.some((subType) => rowSubTypes.includes(subType));

    const matchCreatedBy =
      selectedCreatedBy.length === 0 ||
      selectedCreatedBy.some((type) => rowCreatedBy.includes(type));

    return matchesType && matchesSubType && matchCreatedBy;
  });

  const handleDelete = async () => {
    try {
      await deleteData({
        endpoint: `stock-analysis-function/delete/${deleteRow.name}`,
        tags: [tagTypes.GET_FILTERTYPE],
      }).unwrap();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      fetchStockDetails();
      setIsDelete(false);
    }
  };

  useEffect(() => {
    fetchStockDetails();
  }, []);

  useEffect(() => {
    if (hiddenColumnsFromLocalStorage) {
      setHiddenColumns(JSON.parse(hiddenColumnsFromLocalStorage));
    }
  }, []);

  const columns = [
    {
      field: "func",
      headerName: "Function Name",
      // minWidth: 280,
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <span>{params.row.func}</span>
        </div>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      // minWidth: 150,
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
          <IconButton size="small" onClick={handleTypeFilterOpen}>
            {selectedStatuses.length ? (
              <FilterListIcon fontSize="small" color="primary" />
            ) : (
              <FilterListIcon fontSize="small" />
            )}
          </IconButton>

          <Popover
            open={Boolean(typeAnchorEl)}
            anchorEl={typeAnchorEl}
            onClose={handleTypeFilterClose}
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
                { status: "Trade Sequence" },
                { status: "Utility" },
              ]}
              fieldName="status"
              applyValue={handleStatusFilterChange}
              title="Select Type"
              dataKey="status"
              selectedValues={selectedStatuses}
            />
          </Popover>
        </Box>
      ),
      valueGetter: (_, row) => {
        const badges = [];

        if (row.filter) badges.push("Stock Filter");
        if (row.buysell) badges.push("Trade Rule");

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

        if (row.psizing) badges.push("Portfolio Sizing");

        return badges.length > 0 ? badges.join(", ") : "NA";
      },
      renderCell: ({ row }) => {
        const badges = [];

        if (row.filter) badges.push("Stock Filter");
        if (row.buysell) badges.push("Trade Rule");
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
        if (row.psizing) badges.push("Portfolio Sizing");
        if (row.sort) badges.push("Trade Sequence");
        if (row.ulying) badges.push("Utility");

        // if(!row.filter && !row.buysell && !row.gentry && !row.gexit && !row.entry && !row.exit)

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
            {badges.length > 0 ? (
              badges.map((label, idx) => (
                <Badge key={idx} variant="version">
                  <span>{label}</span>
                </Badge>
              ))
            ) : (
              <div>-</div>
            )}
          </Box>
        );
      },
    },
    {
      field: "subType",
      headerName: "Sub Type",
      // minWidth: 150,
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
          <IconButton size="small" onClick={handleSubTypeFilterOpen}>
            {selectedSubStatuses.length ? (
              <FilterListIcon fontSize="small" color="primary" />
            ) : (
              <FilterListIcon fontSize="small" />
            )}
          </IconButton>
          <Popover
            open={Boolean(subTypeAnchorEl)}
            anchorEl={subTypeAnchorEl}
            onClose={handleSubTypeFilterClose}
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
            <CustomFilterPanel
              data={[
                { status: "Static" },
                { status: "Dynamic" },
                { status: "Buy" },
                { status: "Sell" },
              ]}
              fieldName="status"
              applyValue={handleSubTypeFilterChange}
              title="Select Sub Type"
              dataKey="status"
              selectedValues={selectedSubStatuses}
            />
          </Popover>
        </Box>
      ),
      valueGetter: (_, row) => {
        const badges = [];

        if (row.filter && row.stockList) {
          badges.push("Static");
        } else {
          badges.push("Dynamic");
        }

        if (row.buysell) {
          badges.push("Buy", "Sell");
        }

        return badges.length > 0 ? badges.join(", ") : "NA";
      },
      renderCell: ({ row }) => {
        const badges = [];

        if (row.filter && row.stockList) {
          badges.push("Static");
        } else if (row.filter && !row.stockList) {
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
            {badges.length > 0 ? (
              badges.map((label, idx) => (
                <Badge key={idx} variant="version">
                  <span>{label}</span>
                </Badge>
              ))
            ) : (
              <span>-</span>
            )}
          </Box>
        );
      },
    },
    {
      field: "timestamp",
      headerName: "Created On",
      flex: 1,
      valueGetter: (_, row) => {
        const createdOn = row?.createdOn;
        return createdOn ? new Date(createdOn) : null;
      },
      renderCell: (params) => {
        const timestamp = params?.row?.createdOn;
        if (!timestamp) {
          return <div className="text-[#666666]">-</div>;
        }

        const date = new Date(timestamp);
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
      // minWidth: 150,
    },
    {
      field: "userDefined",
      headerName: "Created By",
      // minWidth: 150,
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
            Created By
          </span>
          <IconButton size="small" onClick={handleCreatedByFilterOpen}>
            {selectedCreatedBy.length ? (
              <FilterListIcon fontSize="small" color="primary" />
            ) : (
              <FilterListIcon fontSize="small" />
            )}
          </IconButton>
          <Popover
            open={Boolean(createdByAnchor)}
            anchorEl={createdByAnchor}
            onClose={handleCreatedByFilterClose}
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
            <CustomFilterPanel
              data={[{ status: "System" }, { status: "User" }]}
              fieldName="status"
              applyValue={handleCreatedByFilterChange}
              title="Select Created By"
              dataKey="status"
              selectedValues={selectedCreatedBy}
            />
          </Popover>
        </Box>
      ),
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
      // minWidth: 150,
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
      renderCell: ({ row }) => {
        const isRemove = row?.userDefined;
        return (
          <GlobalFunctionActionMenu
            isDeleteButton={isRemove}
            isDuplicateButton
            isEditButton={isRemove}
            handleDelete={() => {
              setDeleteRow({ name: row.func });
              setIsDelete(true);
            }}
            handleEdit={() =>
              navigate(`/Devstudio/edit-function?name=${row.shortFuncName}`)
            }
            handleDuplicate={() =>
              navigate(
                `/Devstudio/edit-function?name=${row.shortFuncName}&duplicate=true`
              )
            }
          />
        );
      },
    },
  ];

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

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
      <Box
        className={`${classes.filterModal} flex`}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          width: "100%",
          height: "auto",
          overflow: "auto",
        }}
      >
        <DataGrid
          disableColumnSelector
          rows={filteredRows}
          loading={isLoading}
          columns={visibleColumns}
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
