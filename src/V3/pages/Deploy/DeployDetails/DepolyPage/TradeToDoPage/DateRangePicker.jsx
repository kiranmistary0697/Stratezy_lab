import React, { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import moment from "moment";

const DateRangePicker = () => {
  const [selectedDate, setSelectedDate] = useState(moment("2025-03-08"));

  // Function to apply custom styles to specific days
  const getDayClass = (date) => {
    const day = date.date();
    if ([2, 3, 4, 5, 6, 7].includes(day)) return "green-day"; // Green Dates
    if ([8, 9, 10, 11].includes(day)) return "yellow-day"; // Yellow Dates
    if (day === 12) return "blue-day"; // Blue Selected Date
    return "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        renderInput={(params) => <TextField {...params} />}
        shouldDisableDate={() => false} // Allow all dates
        renderDay={(day, selectedDates, pickersDayProps) => {
          const dayClass = getDayClass(day);
          return (
            <div className={`custom-day ${dayClass}`} {...pickersDayProps}>
              {day.date()}
            </div>
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
