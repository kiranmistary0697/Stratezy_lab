import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import Badge from "../../../../../common/Badge";
import moment from "moment";
import ActionMenu from "../../../../../common/DropDownButton";
import ActionButton from "../../../../../common/ActionButton";
import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";
import AddCapital from "./AddCapital";

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

  const handleSaveCapital = async () => {
    setLoading(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&date=${formattedDate}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
    } catch (error) {
      console.log("Add capital error:", error);
    } finally {
      // Ensures it's always called
      fetchAllData();
      setOpenCapital(false);
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "Date",
        headerName: "Date",
        minWidth: 250,
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
        minWidth: 200,
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
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
          <Typography sx={{ ...tableTextSx }}>{params.row?.Amount}</Typography>
        ),
      },
      {
        field: "Type",
        headerName: "Type",
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
          <Badge variant="version">{params.row?.Type}</Badge>
        ),
      },
      {
        field: "Schedule",
        headerName: "Schedule",
        minWidth: 150,
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
        minWidth: 150,
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
        field: " ",
        headerName: " ",
        align: "center",
        minWidth: 50,
        maxWidth: 60,
        sortable: false,
        disableColumnMenu: true,
        renderCell: () => <ActionMenu isDeleteButton />,
      },
    ],
    [rows]
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
          rows={rows}
          columns={columns}
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
