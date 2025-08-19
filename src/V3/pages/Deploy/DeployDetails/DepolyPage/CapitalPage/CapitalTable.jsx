import React, { useEffect, useMemo, useState } from "react";
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
import moment from "moment";

import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

import AddCapital from "./AddCapital";

import ActionButton from "../../../../../common/ActionButton";
import ActionMenu from "../../../../../common/DropDownButton";
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

const CapitalTable = ({ data }) => {
  const classes = useStyles();
  const [getCapital] = useLazyGetQuery();
  const [addCapital] = useLazyGetQuery();

  const {
    name,
    exchange,
    brokerage,
    currentCapital,
    deployedDate,
    initialCapital,
    version,
  } = data;

  const [rows, setRows] = useState([]);
  const [openCapital, setOpenCapital] = useState(false);
  const [capitalData, setCapitalData] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState([]);

  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(
    moment(capitalData.date, "YYYY-MM-DD").format("DD/MM/YYYY")
  ); // init as string
  const formattedDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data } = await getCapital({
        endpoint: `deploy/strategy/viewcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_CAPITAL],
      }).unwrap();

      const formattedRows = [];

      formattedRows.push({
        id: `${deployedDate}-planned`,
        Date: deployedDate,
        Amount: `₹${initialCapital.toLocaleString("en-IN")}`,
        status: "Completed",
        Type: "One Time",
        Schedule: "1/1",
      });

      if (data.applied) {
        for (const [date, amount] of Object.entries(data.applied)) {
          formattedRows.push({
            id: `${date}-applied`,
            Date: date,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
            status: "Completed",
            Type: "One Time",
            Schedule: "1/1",
          });
        }
      }

      if (data.planned) {
        for (const [date, amount] of Object.entries(data.planned)) {
          formattedRows.push({
            id: `${date}-planned`,
            Date: date,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
            status: "Planned",
            Type: "One Time",
            Schedule: "1/1",
          });
        }
      }

      setRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch capital data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

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

  const handleSaveCapital = async () => {
    setLoading(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${formattedDate}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      setAmount("");
    } catch (error) {
      console.log("Add capital error:", error);
    } finally {
      // Ensures it's always called
      fetchAllData();
      setOpenCapital(false);
      setLoading(false);
    }
  };

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
        field: "Date",
        headerName: "Date",
        // minWidth: 100,
        flex: 1,
        valueGetter: (_, row) => moment(row?.Date).format("DD MMM YYYY"),
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>
            {moment(params.row?.Date).format("DD MMM YYYY")}
          </Typography>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        // minWidth: 100,
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
        // minWidth: 100,
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>{params.row?.Amount}</Typography>
        ),
      },
      {
        field: "Type",
        headerName: "Type",
        // minWidth: 100,
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params.row?.Type}</Badge>
        ),
      },
      {
        field: "Schedule",
        headerName: "Schedule",
        // minWidth: 100,
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
        // minWidth: 100,
        flex: 1,
        renderCell: (params) => {
          return (
            <Box className="flex gap-8 items-center h-full">
              <ActionButton
                action="Backtest"
                onClick={(e) => {
                  setOpenCapital(true);
                  setCapitalData({
                    date: params.row.Date,
                    initialAmount: params.row.Amount,
                    type: params.row.Type,
                  });
                }}
                label={params.row.status === "Completed" ? "NA" : "Manage"}
                textColor={
                  params.row.status === "Completed" ? "#666666" : "#3D69D3"
                }
                iconClass="ri-play-line"
              />
            </Box>
          );
        },
      },
      {
        field: "moreaction",
        headerName: "",
        align: "center",
        // minWidth: 50,
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
        renderCell: () => <ActionMenu isDeleteButton />,
      },
    ],
    [rows, hiddenColumns]
  );
  const visibleColumns = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );
  return (
    <>
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
          loading={loading}
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
        // transformOrigin={{ vertical: "top", horizontal: "left" }}
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
          height: "450px",
          overflow: "auto",
        }}
      >
        <DataGrid
          disableColumnSelector
          rows={rows}
          columns={visibleColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
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
