/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
  setIsDirty = () => {},
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
    tradeSequence: [],
    portfolioSizing: [],
    utility: [],
  });

  const getDefaultValues = (data) => ({
    filterRule: data
      ? data.filter && data.stockList
        ? ["Static"]
        : data.filter
        ? ["Dynamic"]
        : []
      : [],
    tradeRule: data?.buysell ? ["Buy", "Sell"] : [],
    stockEntryExit: [
      ...(data?.entry ? ["Entry"] : []),
      ...(data?.exit ? ["Exit"] : []),
      ...((data?.entry || data?.exit) && data?.accountRule ? ["Account"] : []),
    ],
    globalEntryExit: [
      ...(data?.gentry ? ["Entry"] : []),
      ...(data?.gexit ? ["Exit"] : []),
      ...((data?.gentry || data?.gexit) && data?.accountRule
        ? ["Account"]
        : []),
    ],
    tradeSequence: [...(data?.sort && data?.accountRule ? ["Account"] : [])],
    portfolioSizing: [
      ...(data?.psizing && data?.accountRule ? ["Account"] : []),
    ],
    utility: data?.utility ? ["Utility"] : [],
  });

  const shallowEqual = (obj1, obj2) =>
    JSON.stringify(obj1) === JSON.stringify(obj2);

  useEffect(() => {
    if (!id || !stockData) return;

    const defaultSelectedValues = getDefaultValues(stockData);
    const defaultSelectedTypes = Object.fromEntries(
      Object.entries(defaultSelectedValues).map(([key, arr]) => [
        key,
        arr.length > 0,
      ])
    );

    if (!shallowEqual(selectedValues, defaultSelectedValues)) {
      setSelectedValues(defaultSelectedValues);
    }
    if (!shallowEqual(selectedTypes, defaultSelectedTypes)) {
      setSelectedTypes(defaultSelectedTypes);
    }

    localStorage.removeItem("selectedTypes");
    localStorage.removeItem("selectedValues");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockData, id]);

  useEffect(() => {
    if (!id) {
      const storedTypes = localStorage.getItem("selectedTypes");
      const storedValues = localStorage.getItem("selectedValues");

      if (storedTypes) {
        try {
          setSelectedTypes(JSON.parse(storedTypes));
        } catch {
          console.error("Invalid selectedTypes in localStorage");
        }
      }
      if (storedValues) {
        try {
          setSelectedValues(JSON.parse(storedValues));
        } catch {
          console.error("Invalid selectedValues in localStorage");
        }
      }
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
  }, [selectedTypes]);

  useEffect(() => {
    localStorage.setItem("selectedValues", JSON.stringify(selectedValues));
  }, [selectedValues]);

  useEffect(() => {
    const updatedFunction = {
      filterRule: selectedValues.filterRule?.length > 0,
      tradeRule: selectedValues.tradeRule?.length > 0,
      tradeSequence: selectedTypes.tradeSequence,
      portfolioSizing: selectedTypes.portfolioSizing,
      utility: selectedTypes.utility,
    };

    updatedFunction.accountRule =
      (selectedValues.stockEntryExit &&
        selectedValues.stockEntryExit.includes("Account")) ||
      (selectedValues.globalEntryExit &&
        selectedValues.globalEntryExit.includes("Account")) ||
      (selectedValues.tradeSequence &&
        selectedValues.tradeSequence.includes("Account")) ||
      (selectedValues.portfolioSizing &&
        selectedValues.portfolioSizing.includes("Account"));

    if (
      selectedTypes.stockEntryExit &&
      !selectedValues.stockEntryExit.includes("Entry") &&
      !selectedValues.stockEntryExit.includes("Exit")
    ) {
      updatedFunction.entry = true;
    } else if (
      selectedTypes.stockEntryExit &&
      Array.isArray(selectedValues.stockEntryExit)
    ) {
      if (selectedValues.stockEntryExit.includes("Entry")) {
        updatedFunction.entry = true;
      }
      if (selectedValues.stockEntryExit.includes("Exit")) {
        updatedFunction.exit = true;
      }
    } else {
      updatedFunction.entry = false;
      updatedFunction.exit = false;
    }

    if (
      selectedTypes.globalEntryExit &&
      !selectedValues.globalEntryExit.includes("Entry") &&
      !selectedValues.globalEntryExit.includes("Exit")
    ) {
      updatedFunction.gentry = true;
    } else if (
      selectedTypes.globalEntryExit &&
      Array.isArray(selectedValues.globalEntryExit)
    ) {
      if (selectedValues.globalEntryExit.includes("Entry")) {
        updatedFunction.gentry = true;
      }
      if (selectedValues.globalEntryExit.includes("Exit")) {
        updatedFunction.gexit = true;
      }
    } else {
      updatedFunction.gentry = false;
      updatedFunction.gexit = false;
    }

    if (Array.isArray(selectedValues.filterRule)) {
      if (
        selectedTypes.filterRule &&
        selectedValues.filterRule.includes("Static")
      ) {
        updatedFunction.stockList = true;
      } else if (
        selectedTypes.filterRule &&
        selectedValues.filterRule.includes("Dynamic")
      ) {
        updatedFunction.stockList = false;
      }
    }

    // payload modification
    if (Object.values(selectedTypes).every((val) => val === false)) {
      updatedFunction.utility = true;
    }

    if (
      selectedTypes.filterRule &&
      (!selectedValues.filterRule.includes("Static") ||
        !selectedValues.filterRule.includes("Dynamic"))
    ) {
      updatedFunction.filterRule = true;
    } else {
      updatedFunction.filterRule = false;
    }

    if (selectedTypes.tradeRule && selectedValues.tradeRule.includes("Buy")) {
      updatedFunction.tradeRule = true;
    } else if (selectedTypes.tradeRule) {
      updatedFunction.tradeRule = true;
    } else {
      updatedFunction.tradeRule = false;
    }

    setSelectedFunction(updatedFunction);
  }, [selectedValues, selectedTypes, setSelectedFunction, stockData]);

  const toggleType = (type) => {
    const canEdit = !id || editUserData;
    if (!canEdit) return;
    setSelectedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    setIsDirty(true);
  };

  const handleSelectChange = (key, value) => {
    const selected = Array.isArray(value) ? value : [value];
    setSelectedValues((prev) => {
      if (
        selected.length === 0 ||
        (selected.length === 1 && selected[0] === undefined)
      ) {
        return { ...prev, [key]: [] };
      }
      return {
        ...prev,
        [key]:
          key === "filterRule" ? [selected[selected.length - 1]] : selected,
      };
    });
  };

  const allOptions = {
    filterRule: ["Static", "Dynamic"],
    tradeRule: ["Buy", "Sell"],
    stockEntryExit: ["Entry", "Exit", "Account"],
    globalEntryExit: ["Entry", "Exit", "Account"],
    tradeSequence: ["Account"],
    portfolioSizing: ["Account"],
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
    "tradeSequence",
    "portfolioSizing",
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
                  maxWidth: 350,
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

        <FormGroup
          sx={{
            display: { xs: "grid", sm: "grid", md: "flex" },
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            flexDirection: { md: "row" },
            flexWrap: { md: "wrap" },
            gap: { xs: 1, sm: 2, md: 4 },
            width: { md: "100%" },
          }}
        >
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
                sx={{ marginRight: 0, marginBottom: 0 }}
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
                  maxWidth: 350,
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
              <div key={key} className="min-w-0 w-full sm:w-auto">
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
                  className={`${!isEnabled ? "opacity-50" : ""}`}
                  sx={{
                    width: { xs: "100%", sm: 160, md: 200 }, // full width on mobile
                    maxWidth: "100%",
                    "& .MuiSelect-select": {
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      py: 0.5,
                      alignItems: "center",
                    },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {selected.length > 0 ? (
                        selected.map((val) => (
                          <Badge variant="version" key={val}>
                            <span>{val}</span>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400">No Options</span>
                      )}
                    </Box>
                  )}
                  MenuProps={{
                    marginThreshold: 0,
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                    PaperProps: {
                      sx: {
                        maxHeight: 320,
                        width: { xs: "calc(100vw - 32px)", sm: "auto" },
                        maxWidth: { xs: "calc(100vw - 32px)", sm: "auto" },
                        overflowX: "hidden",
                      },
                    },
                  }}
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
