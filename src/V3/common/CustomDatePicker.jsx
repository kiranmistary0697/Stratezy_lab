import { useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  styled,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import moment from "moment";

// Custom theme overrides
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            fontSize: 16,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#1976D2",
            color: "#fff",
          },
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        },
      },
    },
  },
});

// Custom calendar header
const CustomCalendarHeaderRoot = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 16px",
  alignItems: "center",
});

const CustomCalendarHeader = ({ currentMonth, onMonthChange }) => (
  <CustomCalendarHeaderRoot>
    <IconButton
      onClick={() => onMonthChange(currentMonth.subtract(1, "month"))}
    >
      <ChevronLeft />
    </IconButton>
    <Typography variant="body2">{currentMonth.format("MMMM YYYY")}</Typography>
    <IconButton onClick={() => onMonthChange(currentMonth.add(1, "month"))}>
      <ChevronRight />
    </IconButton>
  </CustomCalendarHeaderRoot>
);

// Calendar wrapper
// const CalendarHeaderComponent = ({
//   selectedDate,
//   onDateChange,
//   onClose,
//   isShowPending,
//   pendingDates = [],
//   completedDates = [],
//   isView = false,
//   isFuture = false, // Add isFuture prop
//   minDate,
// }) => {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DateCalendar
//         views={["year", "month", "day"]}
//         minDate={
//           dayjs(minDate, "DD/MM/YYYY", true).isValid()
//             ? dayjs(minDate, "DD/MM/YYYY")
//             : undefined
//         }
//         value={dayjs(selectedDate)}
//         onChange={(newDate) => {
//           if (!isView) {
//             onDateChange(newDate);
//             onClose();
//           }
//         }}
//         shouldDisableDate={(date) => {
//           // Disable date if in view mode or before today when isFuture is true
//           return isView || (isFuture && dayjs(date).isBefore(dayjs(), "day"));
//         }}
//         // slots={{ calendarHeader: CustomCalendarHeader }}
//         slotProps={{
//           day: (ownerState) => {
//             const date = ownerState.day;
//             const isToday = dayjs().isSame(date, "day");
//             const isPending = pendingDates?.some((d) =>
//               dayjs(date).isSame(d, "day")
//             );
//             const isCompleted = completedDates?.some((d) =>
//               dayjs(date).isSame(d, "day")
//             );

//             return {
//               disabled:
//                 isView || (isFuture && dayjs(date).isBefore(dayjs(), "day")),
//               sx: isShowPending
//                 ? {
//                     backgroundColor: isToday
//                       ? "#1976D2"
//                       : isCompleted
//                       ? "#0A994A"
//                       : isPending
//                       ? "#FECF6A"
//                       : "transparent",
//                     color:
//                       isToday || isCompleted || isPending ? "#fff" : "inherit",
//                     borderRadius: "50%",
//                     "&:hover": {
//                       backgroundColor:
//                         isToday || isCompleted || isPending
//                           ? "#1565C0"
//                           : "#eee",
//                     },
//                   }
//                 : {
//                     borderRadius: 0,
//                     width: 32,
//                     height: 32,
//                   },
//             };
//           },
//         }}
//       />
//     </LocalizationProvider>
//   );
// };
const CalendarHeaderComponent = ({
  selectedDate,
  onDateChange,
  onClose,
  isShowPending,
  pendingDates = [],
  completedDates = [],
  isView = false,
  isFuture = false,
  minDate,
}) => {
  const [currentView, setCurrentView] = useState("day"); // track the view

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        views={["year", "month", "day"]}
        view={currentView}
        onViewChange={(newView) => setCurrentView(newView)}
        minDate={
          dayjs(minDate, "DD/MM/YYYY", true).isValid()
            ? dayjs(minDate, "DD/MM/YYYY")
            : undefined
        }
        value={selectedDate}
        // value={dayjs(selectedDate)}
        onChange={(newDate) => {
          if (!isView) {
            onDateChange(newDate);

            // Only close the popover if the user selected a day
            if (currentView === "day") {
              onClose();
            }
          }
        }}
        shouldDisableDate={(date) => {
          return isView || (isFuture && dayjs(date).isBefore(dayjs(), "day"));
        }}
        slotProps={{
          day: (ownerState) => {
            const date = ownerState.day;
            const isToday = dayjs().isSame(date, "day");
            const isPending = pendingDates?.some((d) =>
              dayjs(date).isSame(d, "day")
            );
            const isCompleted = completedDates?.some((d) =>
              dayjs(date).isSame(d, "day")
            );

            return {
              disabled:
                isView || (isFuture && dayjs(date).isBefore(dayjs(), "day")),
              sx: isShowPending
                ? {
                    backgroundColor: isToday
                      ? "#1976D2"
                      : isCompleted
                      ? "#0A994A"
                      : isPending
                      ? "#FECF6A"
                      : "transparent",
                    color:
                      isToday || isCompleted || isPending ? "#fff" : "inherit",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor:
                        isToday || isCompleted || isPending
                          ? "#1565C0"
                          : "#eee",
                    },
                  }
                : {
                    borderRadius: 0,
                    width: 32,
                    height: 32,
                  },
            };
          },
        }}
      />
    </LocalizationProvider>
  );
};

// Main custom date picker component
const CustomDatePicker = ({
  value,
  onChange = () => {},
  isShowPending = false,
  pendingDates = [],
  completedDates = [],
  isView = false,
  isFuture = false, // <-- Add here
  isDisable = false,
  minDate,
  onBlur = () => {},
  name = "",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    if (!isDisable) setAnchorEl(event.currentTarget); // Prevent opening if disabled
  };
  const handleClose = () => setAnchorEl(null);

  const handleDateSelect = (newDate) => {
    const formatted = moment(newDate.toDate()).format("DD/MM/YYYY");
    onChange(formatted);
  };

  const parsedMoment = moment(value, "DD/MM/YYYY", true);
  const dayjsDate = parsedMoment.isValid()
    ? dayjs(parsedMoment.toDate())
    : null;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <TextField
            size="small"
            value={value}
            onClick={handleOpen}
            onChange={(e) => {
              const input = e.target.value;
              const parsed = moment(input, "DD/MM/YYYY", true);
              onChange(parsed.isValid() ? parsed.format("DD/MM/YYYY") : input);
            }}
            error={value && !parsedMoment.isValid()}
            helperText={
              value && !parsedMoment.isValid()
                ? "Invalid date format (DD/MM/YYYY)"
                : ""
            }
            onBlur={onBlur}
            name={name}
            className="custom-select !w-full"
          />

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <CalendarHeaderComponent
              selectedDate={dayjsDate}
              onDateChange={handleDateSelect}
              onClose={handleClose}
              isShowPending={isShowPending}
              pendingDates={pendingDates}
              completedDates={completedDates}
              isView={isView}
              isFuture={isFuture} // <-- Pass it here
              minDate={minDate}
            />
          </Popover>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDatePicker;
