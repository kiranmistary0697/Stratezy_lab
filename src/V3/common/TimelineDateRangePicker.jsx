import { useState } from "react";
import { TextField, Popover, Typography, Box } from "@mui/material";
import { DateRange } from "react-date-range";
import moment from "moment";
import { enGB } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TimelineDateRangePicker = ({
  range,
  onChange,
  error = false,
  errorMessage = "",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formattedRange = `${moment(range.startDate).format(
    "DD/MM/YYYY"
  )} - ${moment(range.endDate).format("DD/MM/YYYY")}`;

  return (
    <Box>
      <TextField
        fullWidth
        onClick={handleOpen}
        value={formattedRange}
        InputProps={{ readOnly: true }}
        size="small"
        error={error}
        sx={{
          border: "1px solid #E0E1E4",
          borderRadius: "4px",
          "& .MuiInputBase-input": {
            fontFamily: "Inter",
            fontSize: "14px",
          },
        }}
      />
      {error && (
        <Typography
          variant="caption"
          sx={{ color: "error.main", mt: "4px", ml: "2px" }}
        >
          {errorMessage}
        </Typography>
      )}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <DateRange
          onChange={(item) => onChange(item.selection)}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
          showDateDisplay={false}
          locale={enGB}
          maxDate={new Date()}
        />
      </Popover>
    </Box>
  );
};

export default TimelineDateRangePicker;
