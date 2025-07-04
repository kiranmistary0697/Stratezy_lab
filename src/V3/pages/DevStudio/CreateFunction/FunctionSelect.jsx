import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Badge from "../../../common/Badge";
import {
  FUNCTION_SUBTYPE_TITLE,
  FUNCTION_SUBTYPE_TOOLTIP,
  FUNCTION_TYPE_TITLE,
  FUNCTION_TYPE_TOOLTIP,
} from "../../../../constants/CommonText";

const FunctionSelect = ({
  stockData,
  editUserData,
  id,
  setSelectedFunction = () => {},
}) => {
  const [selectedTypes, setSelectedTypes] = useState({
    filterRule: false,
    tradeRule: false,
    stockEntryExit: false,
    globalEntryExit: false,
    tradeSequence: false,
    portfolioSizing: false,
    utility: false,
  });

  const [selectedValues, setSelectedValues] = useState({
    filterRule: [],
    tradeRule: [],
    stockEntryExit: [],
    globalEntryExit: [],
  });

  // Helper function to get default values from stockData
  const getDefaultValues = () => ({
    filterRule: stockData
      ? stockData?.filter && stockData?.stockList
        ? ["Static"]
        : stockData?.filter
        ? ["Dynamic"]
        : []
      : [],
    tradeRule: stockData?.buysell ? ["Buy", "Sell"] : [],
    stockEntryExit: [
      ...(stockData?.entry ? ["Entry"] : []),
      ...(stockData?.exit ? ["Exit"] : []),
    ],
    globalEntryExit: [
      ...(stockData?.gentry ? ["Entry"] : []),
      ...(stockData?.gexit ? ["Exit"] : []),
    ],
    portfolioSizing: stockData?.psizing ? ["Portfolio Sizing"] : [],
    tradeSequence: stockData?.sort ? ["Trade Sequence"] : [],
    utility: stockData?.ulying ? ["Utility"] : [],
  });

  // Initialize selectedTypes and selectedValues based on stockData when id or stockData changes
  useEffect(() => {
    if (id && stockData) {
      const defaultValues = getDefaultValues();
      setSelectedValues(defaultValues);

      const updatedTypes = { ...selectedTypes };
      Object.keys(defaultValues).forEach((key) => {
        updatedTypes[key] = defaultValues[key]?.length > 0;
      });
      setSelectedTypes(updatedTypes);

      // Optionally, clear localStorage to avoid conflicts
      localStorage.removeItem("selectedTypes");
      localStorage.removeItem("selectedValues");
    }
  }, [stockData, id]);

  // Load saved state from localStorage only if no id (new function, not editing)
  useEffect(() => {
    if (!id) {
      const storedTypes = localStorage.getItem("selectedTypes");
      const storedValues = localStorage.getItem("selectedValues");

      if (storedTypes) {
        try {
          setSelectedTypes(JSON.parse(storedTypes));
        } catch (e) {
          console.error("Invalid selectedTypes in localStorage");
        }
      }

      if (storedValues) {
        try {
          setSelectedValues(JSON.parse(storedValues));
        } catch (e) {
          console.error("Invalid selectedValues in localStorage");
        }
      }
    }
  }, []);

  // Persist selectedTypes to localStorage
  useEffect(() => {
    localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  // Persist selectedValues to localStorage
  useEffect(() => {
    localStorage.setItem("selectedValues", JSON.stringify(selectedValues));
  }, [selectedValues]);

  // Update parent component whenever state changes
  useEffect(() => {
    const updatedFunction = {
      filterRule: selectedValues.filterRule?.length > 0,
      tradeRule: selectedValues.tradeRule?.length > 0,
      tradeSequence: selectedTypes.tradeSequence,
      portfolioSizing: selectedTypes.portfolioSizing,
      utility: selectedTypes.utility,
    };

    if (Array.isArray(selectedValues.stockEntryExit)) {
      if (selectedValues.stockEntryExit.includes("Entry")) {
        updatedFunction.entry = true;
      }
      if (selectedValues.stockEntryExit.includes("Exit")) {
        updatedFunction.exit = true;
      }
    }

    if (Array.isArray(selectedValues.globalEntryExit)) {
      if (selectedValues.globalEntryExit.includes("Entry")) {
        updatedFunction.gentry = true;
      }
      if (selectedValues.globalEntryExit.includes("Exit")) {
        updatedFunction.gexit = true;
      }
    }

    if (Array.isArray(selectedValues.filterRule)) {
      if (selectedValues.filterRule.includes("Static")) {
        updatedFunction.stockList = true;
      }
    }

    setSelectedFunction(updatedFunction);
  }, [selectedValues, selectedTypes, stockData]);

  const toggleType = (type) => {
    const canEdit = !id || editUserData;
    if (!canEdit) return;

    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSelectChange = (key, value) => {
    const selected = Array.isArray(value) ? value : [value];
    setSelectedValues((prev) => ({
      ...prev,
      [key]: key === "filterRule" ? [selected[selected.length - 1]] : selected,
    }));
  };

  const allOptions = {
    filterRule: ["Static", "Dynamic"],
    tradeRule: ["Buy", "Sell"],
    stockEntryExit: ["Entry", "Exit"],
    globalEntryExit: ["Entry", "Exit"],
  };

  const typeLabels = {
    filterRule: "Filter Rule",
    tradeRule: "Trade Rule",
    stockEntryExit: "Stock Entry & Exit",
    globalEntryExit: "Global Entry & Exit",
    tradeSequence: "Trade Sequence",
    portfolioSizing: "Portfolio Sizing",
    utility: "Utility",
  };

  const subtypeKeys = [
    "filterRule",
    "tradeRule",
    "stockEntryExit",
    "globalEntryExit",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Type of Function */}
      <div className="flex flex-col gap-4">
        <Box className="flex gap-2.5 items-center">
          <div className="text-[16px] font-semibold text-neutral-950">
            {FUNCTION_TYPE_TITLE}
          </div>
          <Tooltip
            title={FUNCTION_TYPE_TOOLTIP}
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

        <FormGroup row className="flex flex-wrap gap-4">
          {Object.entries(selectedTypes).map(([key, value]) => {
            const shouldHide =
              key === "utility" && stockData?.filter && stockData?.stockList;
            if (shouldHide) return null;

            return (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    icon={<CheckBoxOutlinedIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    checked={value}
                    onChange={() => toggleType(key)}
                  />
                }
                label={
                  <div className="text-sm font-normal text-[#0A0A0A]">
                    {typeLabels[key]}
                  </div>
                }
              />
            );
          })}
        </FormGroup>
      </div>

      {/* Sub Types */}
      <div>
        <Box className="flex gap-2.5 items-center">
          <div className="text-[16px] font-semibold text-neutral-950">
            {FUNCTION_SUBTYPE_TITLE}
          </div>
          <Tooltip
            title={FUNCTION_SUBTYPE_TOOLTIP}
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

        <div className="flex gap-6 mt-5 flex-wrap">
          {subtypeKeys.map((key) => {
            const isEnabled = selectedTypes[key] && (!id || editUserData);
            const selected = selectedValues[key] || [];
            const options = allOptions[key];

            return (
              <div key={key}>
                <label
                  className={`block mb-1 text-xs font-semibold ${
                    isEnabled ? "text-[#0A0A0A]" : "opacity-50"
                  }`}
                >
                  {typeLabels[key]}
                </label>
                <Select
                  multiple
                  size="small"
                  disabled={!isEnabled}
                  value={selected}
                  onChange={
                    key === "tradeRule"
                      ? () => {}
                      : (e) => handleSelectChange(key, e.target.value)
                  }
                  className={`min-w-[160px] bg-white border border-gray-200 rounded-md ${
                    !isEnabled ? "opacity-50" : ""
                  }`}
                  renderValue={(selected) => (
                    <div className="flex gap-2">
                      {selected.length > 0 ? (
                        selected.map((val) => (
                          <Badge variant="version" key={val}>
                            <span>{val}</span>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">No Options</span>
                      )}
                    </div>
                  )}
                >
                  {options.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      onClick={
                        key === "tradeRule"
                          ? () =>
                              setSelectedValues((prev) => ({
                                ...prev,
                                [key]: selected.includes(option)
                                  ? []
                                  : ["Buy", "Sell"],
                              }))
                          : undefined
                      }
                    >
                      <Checkbox
                        checked={selected.includes(option)}
                        size="small"
                      />
                      <Typography variant="body2">{option}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FunctionSelect;