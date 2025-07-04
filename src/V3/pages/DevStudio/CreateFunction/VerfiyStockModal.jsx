import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Autocomplete,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TimelineDateRangePicker from "../../../common/TimelineDateRangePicker";
import ModalButton from "../../../common/Table/ModalButton";
import {
  PrimaryYAxis,
  SecondaryYAxis,
  TimelineAxis,
  VERIFY_SUB_TITLE_TOOLTIP,
} from "../../../../constants/CommonText";
import moment from "moment";

const VerfiyStockModal = ({
  title,
  isOpen,
  handleClose,
  stockList,
  dateRange,
  setDateRange,
  selectedStock,
  setSelectedStock,
  xAxisInput,
  setXAxisInput,
  yAxisInput,
  setYAxisInput,
  isSaving,
  handleVerifyStock = () => {},
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

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="!p-[30px]">
        {/* Header */}
        <Box className="flex gap-2.5 items-center text-center md:text-left">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              color: "#0A0A0A",
            }}
          >
            {title}
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

        {/* Body */}
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
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
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

              <TimelineDateRangePicker
                range={dateRange}
                onChange={(r) => {
                  setDateRange(r);
                  setDateRangeError(false); // reset error on change
                }}
                error={dateRangeError}
                errorMessage="Start date and end date cannot be the same."
              />
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

        {/* Footer */}
        <div className="flex gap-5 justify-center items-center w-full mt-[30px]">
          <ModalButton
            variant="secondary"
            disabled={isSaving}
            onClick={handleClose}
          >
            Close
          </ModalButton>
          <ModalButton
            variant="primary"
            disabled={isSaving}
            onClick={handlePlotGraph}
          >
            {isSaving && (
              <CircularProgress color="inherit" size={18} thickness={4} />
            )}
            Plot Graph
          </ModalButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerfiyStockModal;
