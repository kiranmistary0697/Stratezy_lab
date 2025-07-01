import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const CustomSelectField = ({
  filterOptions,
  selectedFilter,
  setSelectedFilter,
  setIsNewStockFilter,
}) => {
  return (
    <Select
      value={selectedFilter || ""}
      onChange={(e) => setSelectedFilter(e.target.value)}
      displayEmpty
      renderValue={(selected) => {
        const selectedObj = filterOptions.find(
          (filter) => filter.name === selected
        );
        return selectedObj ? (
          <Box className="flex items-center gap-2">
            <Typography variant="body2" className="text-neutral-950">
              {selectedObj.name}
            </Typography>
            <Typography
              variant="caption"
              className="px-2 py-0.5 text-xs text-indigo-700 bg-indigo-50 rounded border border-indigo-200"
            >
              {selectedObj.type}
            </Typography>
          </Box>
        ) : (
          "Select an option"
        );
      }}
      className="custom-select"
      // className="flex h-10 px-5 py-4 items-center gap-2 bg-white border border-solid border-gray-300 rounded-sm"
      style={{ borderRadius: "2px", border: "1px solid #E0E1E4" }}
    >
      {filterOptions.map((filter, index) => (
        <MenuItem key={index} value={filter.name}>
          <Box className="flex gap-2 items-center w-full">
            <Typography variant="body2" className="text-neutral-950">
              {filter.name}
            </Typography>
            <Typography
              variant="caption"
              className="px-2 py-0.5 text-xs text-indigo-700 bg-indigo-50 rounded border border-indigo-200"
            >
              {filter.type}
            </Typography>
          </Box>
        </MenuItem>
      ))}

      {/* Special MenuItem for "Create a Stock Bundle" */}
      <MenuItem onClick={(e) => e.stopPropagation()} disableRipple>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsNewStockFilter(true);
          }}
          className="px-2 py-0.5 text-xs text-[#3D69D3] border border-indigo-200"
          style={{
            background: "none",
            outline: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create a Stock Bundle
        </Button>
      </MenuItem>
    </Select>
  );
};

export default CustomSelectField;
