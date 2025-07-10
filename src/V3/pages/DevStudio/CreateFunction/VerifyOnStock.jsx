import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  PrimaryYAxis,
  SecondaryYAxis,
  TimelineAxis,
  VERIFY_SUB_TITLE_TOOLTIP,
} from "../../../../constants/CommonText";
import TimelineDateRangePicker from "../../../common/TimelineDateRangePicker";
import moment from "moment";
import CustomDatePicker from "../../../common/CustomDatePicker";

const VerifyOnStock = ({
  title,
  stockList,
  selectedStock,
  setSelectedStock,
  xAxisInput,
  setXAxisInput,
  yAxisInput,
  setYAxisInput,
  handleVerifyStock = () => {},
  isSaving,
  triggerVerify,
  setTriggerVerify,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [dateRangeError, setDateRangeError] = useState(false);

  const handlePlotGraph = () => {
    const start = moment(dateRange.startDate).startOf("day");
    const end = moment(dateRange.endDate).startOf("day");

    if (start.isSame(end)) {
      setDateRangeError(true);
      return;
    }

    setDateRangeError(false);

    const xAxisArray = xAxisInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const yAxisArray = yAxisInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    handleVerifyStock({ xAxis: xAxisArray, yAxis: yAxisArray });
  };

  useEffect(() => {
    if (triggerVerify) {
      handlePlotGraph();
      setTriggerVerify(false); // reset trigger
    }
  }, [triggerVerify]);

  return (
    <Box className="p-4">
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: "20px", mt: 4 }}
      >
        {/* Stock Name */}
        <Box className="flex gap-2.5 items-center text-center md:text-left">
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "12px",
              color: "#0A0A0A",
              fontFamily: "Inter",
            }}
          >
            Test Stock Name
          </Typography>
          <Tooltip
            title={VERIFY_SUB_TITLE_TOOLTIP}
            placement="right-end"
            componentsProps={{
              tooltip: {
                sx: {
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#666666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                },
              },
            }}
          >
            <InfoOutlinedIcon
              sx={{
                color: "#666666",
                width: "17px",
                height: "17px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Box>

        <Autocomplete
          options={stockList}
          getOptionLabel={(option) => option.symbol || ""}
          value={selectedStock}
          onChange={(event, newValue) => setSelectedStock(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select Stock" size="small" />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />

        {/* Visualization Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "#0A0A0A",
              fontFamily: "Inter",
            }}
          >
            Visualisation
          </Typography>

          {/* Timeline Picker */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#0A0A0A",
                  fontFamily: "Inter",
                }}
              >
                Timeline
              </Typography>
              <Tooltip
                title={TimelineAxis}
                placement="right-end"
                componentsProps={{
                  tooltip: {
                    sx: {
                      padding: "16px",
                      background: "#FFFFFF",
                      color: "#666666",
                      boxShadow: "0px 8px 16px 0px #7B7F8229",
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                    },
                  },
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#666666",
                    width: "17px",
                    height: "17px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: "10px", flexDirection: "column" }}>
              <Box>
                <label className="text-sm font-semibold text-neutral-850">
                  Start Date
                </label>
                <CustomDatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                  name="startDate"
                />
              </Box>
              <Box>
                <label className="text-sm font-semibold text-neutral-950">
                  End Date
                </label>

                <CustomDatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                  name="endDate"
                />
              </Box>
            </Box>

            {/* <TimelineDateRangePicker
              range={dateRange}
              onChange={(r) => {
                setDateRange(r);
                setDateRangeError(false); // reset error on change
              }}
              error={dateRangeError}
              errorMessage="Start date and end date cannot be the same."
            /> */}
          </Box>

          {/* X Axis */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#0A0A0A",
                  fontFamily: "Inter",
                }}
              >
                Primary Y axis
              </Typography>
              <Tooltip
                title={PrimaryYAxis}
                placement="right-end"
                componentsProps={{
                  tooltip: {
                    sx: {
                      padding: "16px",
                      background: "#FFFFFF",
                      color: "#666666",
                      boxShadow: "0px 8px 16px 0px #7B7F8229",
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                    },
                  },
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#666666",
                    width: "17px",
                    height: "17px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Attribute1, Attribute2"
              value={xAxisInput}
              onChange={(e) => setXAxisInput(e.target.value)}
            />
          </Box>

          {/* Y Axis */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#0A0A0A",
                  fontFamily: "Inter",
                }}
              >
                Secondary Y axis
              </Typography>
              <Tooltip
                title={SecondaryYAxis}
                placement="right-end"
                componentsProps={{
                  tooltip: {
                    sx: {
                      padding: "16px",
                      background: "#FFFFFF",
                      color: "#666666",
                      boxShadow: "0px 8px 16px 0px #7B7F8229",
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                    },
                  },
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#666666",
                    width: "17px",
                    height: "17px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="e.g. Attribute3, Attribute4"
              value={yAxisInput}
              onChange={(e) => setYAxisInput(e.target.value)}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "14px",
                color: "#3D69D3",
                fontFamily: "Inter",
              }}
            >
              Add another Y axis
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyOnStock;
