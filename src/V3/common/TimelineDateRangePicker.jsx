// components/common/TimelineDateRangePicker.jsx
import { useState } from "react";
import { TextField, Popover } from "@mui/material";
import { DateRange } from "react-date-range";
import moment from "moment";
import { enGB } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const TimelineDateRangePicker = ({ range, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [range, setRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleChange = (item) => {
  //   setRange([item.selection]);
  // };

  const formattedRange = `${moment(range.startDate).format(
    "DD/MM/YYYY"
  )} - ${moment(range.endDate).format("DD/MM/YYYY")}`;

  return (
    <>
      <TextField
        fullWidth
        onClick={handleOpen}
        value={formattedRange}
        InputProps={{ readOnly: true }}
        size="small"
        sx={{
          border: "1px solid #E0E1E4",
          borderRadius: "4px",
          "& .MuiInputBase-input": {
            fontFamily: "Inter",
            fontSize: "14px",
          },
        }}
      />
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
          locale={enGB} // 👈 FIXED: explicitly pass locale
        />
      </Popover>
    </>
  );
};

export default TimelineDateRangePicker;
