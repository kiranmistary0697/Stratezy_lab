import { useState, useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlinedIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import moment from "moment";
import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

import ActionButton from "../../../../../common/ActionButton";
import ActionMenu from "../../../../../common/DropDownButton";
import AddCapital from "./AddCapital";
import DeleteModal from "../../../../../common/DeleteModal";
import Badge from "../../../../../common/Badge";

const tableTextSx = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0%",
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

const CapitalTable = ({
  data = {},
  rows = [],
  loading,
  fetchAllData,
  fetchDeployData,
}) => {
  const classes = useStyles();
  const [deleteCapital] = useLazyGetQuery();
  const [addCapital] = useLazyGetQuery();

  const { name, exchange, brokerage, version } = data;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [openCapital, setOpenCapital] = useState(false);
  const [capitalData, setCapitalData] = useState(null);
  const [amount, setAmount] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(
    moment(capitalData?.date || new Date()).format("DD/MM/YYYY")
  );
  const [saving, setSaving] = useState(false);

  const [rowToDelete, setRowToDelete] = useState(null);

  const handlePopoverOpen = (event, type) => {
    event.stopPropagation();
    setPopoverAnchor(event.currentTarget);
    setActiveFilter(type);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setActiveFilter(null);
  };

  const handleConfirmDelete = async () => {
    if (!rowToDelete) return;

    try {
      const params = new URLSearchParams({
        name,
        exchange,
        version,
        brokerage,
      }).toString();

      const { data } = await deleteCapital({
        endpoint: `/deploy/strategy/clearcapital?${params}`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();

      toast.success(data?.message);
      await fetchAllData();
      await fetchDeployData();
    } catch (error) {
      console.error("Failed to delete capital:", error);
    } finally {
      setIsDeleteOpen(false);
      setRowToDelete(null);
    }
  };

  const handleDeleteClick = (row) => {
    setRowToDelete(row);
    setIsDeleteOpen(true);
  };

  const handleColumnToggle = (field) => {
    setHiddenColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  const handleSaveCapital = async () => {
    if (!amount) return;
    setSaving(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${moment(
          startDate,
          "DD/MM/YYYY"
        ).format("YYYY-MM-DD")}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();

      setAmount("");
      await fetchAllData();
      await fetchDeployData();
      setOpenCapital(false);
    } catch (error) {
      console.error("Add capital error:", error);
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "Date",
        headerName: "Date",
        flex: 1,
        valueGetter: (params) => moment(params.row?.Date).format("DD MMM YYYY"),
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>
            {moment(params.row?.Date).format("DD MMM YYYY")}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
          <Badge variant={params.row.status?.toLowerCase()}>
            {params.row?.status}
          </Badge>
        ),
      },
      {
        field: "Amount",
        headerName: "Amount",
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>{params.row?.Amount}</Typography>
        ),
      },
      {
        field: "Type",
        headerName: "Type",
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params.row?.Type}</Badge>
        ),
      },
      {
        field: "Schedule",
        headerName: "Schedule",
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>
            {params.row?.Schedule}
          </Typography>
        ),
      },
      {
        field: "manage",
        headerName: "Action",
        flex: 1,
        renderCell: (params) => (
          <Box className="flex gap-8 items-center h-full">
            <ActionButton
              action="Backtest"
              onClick={() => {
                setOpenCapital(true);

                setCapitalData({
                  date: params.row.Date,
                  initialAmount: params.row.Amount,
                  type: params.row.Type,
                });

                setAmount(params.row.Amount);
                setSelectedType(
                  params.row?.Type?.replace(/\s+/g, "").toUpperCase()
                );
                setStartDate(params.row.Date);
              }}
              label={params.row.status === "Completed" ? "NA" : "Manage"}
              textColor={
                params.row.status === "Completed" ? "#666666" : "#3D69D3"
              }
              iconClass="ri-play-line"
            />
          </Box>
        ),
      },
      {
        field: "moreaction",
        headerName: "",
        align: "center",
        maxWidth: 60,
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
        renderCell: (params) => (
          <ActionMenu
            isDeleteButton
            handleDelete={() => handleDeleteClick(params.row)}
          />
        ),
      },
    ],
    [hiddenColumns]
  );

  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

  const popoverContent = () => {
    if (activeFilter !== "column") return null;
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
  };

  return (
    <>
      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          handleClose={() => setIsDeleteOpen(false)}
          handleConfirm={handleConfirmDelete}
          isLoading={loading}
          title="Are you Sure?"
          description="All planned capital will be cleared."
        />
      )}

      {openCapital && (
        <AddCapital
          title="Add Capital"
          isOpen={openCapital}
          handleClose={() => setOpenCapital(false)}
          capitalData={capitalData}
          setAmount={setAmount}
          setSelectedType={setSelectedType}
          setStartDate={setStartDate}
          amount={amount}
          selectedType={selectedType}
          startDate={startDate}
          loading={saving}
          onSave={handleSaveCapital}
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
        className={classes.filterModal + " flex"}
        sx={{
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          width: "100%",
          height: "450px",
          overflow: "auto",
        }}
      >
        <DataGrid
          disableColumnSelector
          rows={rows}
          columns={visibleColumns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          loading={loading}
          slotProps={{
            loadingOverlay: {
              variant: "circular-progress",
              noRowsVariant: "circular-progress",
            },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
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

export default CapitalTable;
