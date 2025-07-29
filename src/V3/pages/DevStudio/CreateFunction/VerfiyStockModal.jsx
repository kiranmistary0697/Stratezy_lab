import { forwardRef, useRef, useState } from "react";
import Draggable from "react-draggable";
import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Autocomplete,
  Tooltip,
  CircularProgress,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import moment from "moment";

import {
  PrimaryYAxis,
  SecondaryYAxis,
  VERIFY_SUB_TITLE_TOOLTIP,
} from "../../../../constants/CommonText";
import CustomDatePicker from "../../../common/CustomDatePicker";
import ModalButton from "../../../common/Table/ModalButton";

// Draggable Paper Component for Dialog
const PaperComponent = forwardRef(function PaperComponent(props, ref) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      nodeRef={nodeRef}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
});

const VerfiyStockModal = ({
  title,
  isOpen,
  handleClose,
  stockList,
  selectedStock,
  setSelectedStock,
  xAxisInput,
  setXAxisInput,
  yAxisInput,
  setYAxisInput,
  isSaving,
  handleVerifyStock = () => {},
  startDate,
  setStartDate = () => {},
  endDate,
  setEndDate = () => {},
}) => {
  const [dateRangeError, setDateRangeError] = useState(false);

  const handlePlotGraph = () => {
    const start = moment(startDate, "DD/MM/YYYY").startOf("day");
    const end = moment(endDate, "DD/MM/YYYY").startOf("day");

    if (start == end) {
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
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <Box
        id="draggable-dialog-title"
        sx={{
          cursor: "move",
          paddingTop: "30px ",
          paddingLeft: "30px ",
          fontWeight: 600,
          fontSize: "20px",
          fontFamily: "Inter",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#0A0A0A",
        }}
      >
        {title}
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

      <DialogContent className="!p-[30px]">
        {/* Body */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "48%",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#0A0A0A",
                    fontFamily: "Inter",
                  }}
                >
                  Start Date
                </Typography>
                <CustomDatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(val) => setStartDate(val)}
                  name="startDate"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "48%",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#0A0A0A",
                    fontFamily: "Inter",
                  }}
                >
                  End Date
                </Typography>
                <CustomDatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(val) => setEndDate(val)}
                  name="endDate"
                />
              </Box>
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
        <Box className="flex gap-5 justify-center items-center w-full mt-[30px]">
          <ModalButton
            variant="secondary"
            disabled={isSaving}
            onClick={handleClose}
          >
            Close
          </ModalButton>
          <ModalButton
            variant="primary"
            disabled={!selectedStock?.symbol || isSaving}
            onClick={handlePlotGraph}
            className={`${
              !selectedStock?.symbol || isSaving ? "opacity-50" : ""
            }`}
          >
            {isSaving && (
              <CircularProgress color="inherit" size={18} thickness={4} />
            )}
            Plot Graph
          </ModalButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VerfiyStockModal;
