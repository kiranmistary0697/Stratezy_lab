import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Divider,
  Button,
  MenuItem,
  Select,
  Tooltip,
  Autocomplete,
  TextField,
  Paper,
} from "@mui/material";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";
import { tagTypes } from "../../../tagTypes";
import StockConfigModal from "../CreateStratezy/StockConfigModal";
import { useNavigate } from "react-router-dom";
import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TradeHeader from "../TradeRule/TradeHEader";
import {
  STOCK_ENTRY_BUTTON_TITLE,
  STOCK_ENTRY_CONFIG_TITLE,
  STOCK_ENTRY_DESCRIPTION,
  STOCK_ENTRY_SUB_TITLE,
  STOCK_ENTRY_TITLE,
  STOCK_EXIT_BUTTON_TITLE,
  STOCK_EXIT_CONFIG_TITLE,
  STOCK_EXIT_DESCRIPTION,
  STOCK_EXIT_SUB_TITLE,
  STOCK_EXIT_TITLE,
} from "../../../../constants/CommonText";

const STORAGE_KEY_ENTRY = "stockEntry";
const STORAGE_KEY_EXIT = "stockExit";

const StockEntryExit = ({ formik, isView, id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { values, setFieldValue } = formik;

  const [getStockEntry] = usePostMutation();
  const [getStockExit] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const { stockEntryExit } = useSelector((state) => ({
    stockEntryExit: state.Stock,
  }));

  const [stockEntryOptions, setStockEntryOptions] = useState([]);
  const [stockExitOptions, setStockExitOptions] = useState([]);
  const [openConfig, setOpenConfig] = useState(null);

  useEffect(() => {
    (async () => {
      if (stockEntryExit?.length) {
        setStockEntryOptions(stockEntryExit);
        setStockExitOptions(stockEntryExit);
      } else {
        const { data: stockEntry } = await getStockEntry({
          endpoint: "stock-analysis-function/details",
          payload: { entry: true },
        });
        dispatch(
          setAllData({ data: stockEntry?.data, key: "stockEntryExitEntry" })
        );
        setStockEntryOptions(stockEntry?.data);

        const { data: stockExit } = await getStockExit({
          endpoint: "stock-analysis-function/details",
          payload: { exit: true },
        });
        dispatch(
          setAllData({ data: stockExit?.data, key: "stockEntryExitExit" })
        );
        setStockExitOptions(stockExit?.data);
      }
    })();
  }, []);

  useEffect(() => {
    const { stockEntryExit } = values;
    if (
      !stockEntryExit ||
      !Array.isArray(stockEntryExit.entry) ||
      !Array.isArray(stockEntryExit.exit)
    ) {
      setFieldValue("stockEntryExit", {
        entry: [{ fieldName: "AND", name: "", adesc: [], args: [] }],
        exit: [{ fieldName: "AND", name: "", adesc: [], args: [] }],
      });
    }
  }, []);

  useEffect(() => {
    const savedEntry = localStorage.getItem(STORAGE_KEY_ENTRY);
    if (savedEntry) {
      setFieldValue("stockEntryExit.entry", JSON.parse(savedEntry));
    }
    const savedExit = localStorage.getItem(STORAGE_KEY_EXIT);
    if (savedExit) {
      setFieldValue("stockEntryExit.exit", JSON.parse(savedExit));
    }
  }, []);

  const handleFilterChange = async (type, index, key, value) => {
    const updated = [...values.stockEntryExit[type]];
    updated[index][key] = value?.shortFuncName;

    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value?.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        updated[index].adesc = data?.adesc || [];
        updated[index].args = data?.args || [];
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    }

    setFieldValue(`stockEntryExit.${type}`, updated);
    localStorage.setItem(
      type === "entry" ? STORAGE_KEY_ENTRY : STORAGE_KEY_EXIT,
      JSON.stringify(updated)
    );
  };

  const addFilter = (type) => {
    const updated = [
      ...(values?.stockEntryExit?.[type] || []),
      {
        fieldName: "AND",
        name: "",
        adesc: [],
        args: [],
      },
    ];
    setFieldValue(`stockEntryExit.${type}`, updated);
  };

  const handleDelete = (type, index) => {
    const updated = [...values.stockEntryExit[type]];
    if (index === 0) {
      // Just clear the first item instead of removing it
      updated[0] = {
        name: "",
        adesc: [],
        args: [],
        type: "",
      };
    } else {
      // Remove the selected index
      updated.splice(index, 1);
    }
    setFieldValue(`stockEntryExit.${type}`, updated);
    localStorage.setItem(
      type === "entry" ? STORAGE_KEY_ENTRY : STORAGE_KEY_EXIT,
      JSON.stringify(updated)
    );
  };

  const handleConfigure = (index, type) => setOpenConfig({ index, type });

  const renderFilters = (type, options) => {
    const filters = values?.stockEntryExit?.[type];

    if (!Array.isArray(filters)) return null;
    return filters.map((filter, index) => (
      <Box
        key={index}
        className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3"
      >
        <Box className="flex flex-col sm:flex-row gap-2 flex-1">
          {index > 0 && (
            <Select
              value={filter?.fieldName || "AND"}
              onChange={(e) =>
                handleFilterChange(type, index, "fieldName", e.target.value)
              }
              // className="custom-select"
              style={{ "--custom-width": "w-[80px]" }}
              size="small"
              disabled={isView}
            >
              <MenuItem value="AND">AND</MenuItem>
            </Select>
          )}
          <Autocomplete
            options={options}
            // value={
            //   options.find((o) => o.shortFuncName === filter?.name) || null
            // }
            value={filter?.name || ""}
            onChange={(e, newValue) => {
              handleFilterChange(type, index, "name", newValue);
            }}
            onInputChange={(e, newInputValue) => {
              // Optional: filter options dynamically or track user input
            }}
            disableClearable
            selectOnFocus
            clearOnBlur={false}
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "368px",
              },
              maxWidth: "100%",
              outline: "none",
            }}
            disabled={isView}
            getOptionLabel={(option) =>
              // option can be string *or* object depending on where MUI calls it from
              typeof option === "string" ? option : option?.shortFuncName || ""
            }
            isOptionEqualToValue={(option, value) =>
              option?.shortFuncName ===
              (typeof value === "string" ? value : value?.shortFuncName)
            }
            renderInput={(params) => {
              const selectedOption =
                options.find((opt) => opt.shortFuncName === filter?.name) || {}; // {} when nothing selected

              return (
                <Tooltip
                  title={selectedOption.desc || ""}
                  placement="right"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontWeight: 400,
                        fontSize: "14px",
                        maxWidth: 400,
                        p: "12px 16px",
                        bgcolor: "#FFFFFF",
                        color: "#0A0A0A",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                >
                  <TextField
                    {...params}
                    placeholder={
                      type === "entry"
                        ? "Select Stock Entry Rule"
                        : "Select Stock Exit Rule"
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <Box className="flex items-center gap-2 pl-2" />
                      ),
                    }}
                  />
                </Tooltip>
              );
            }}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                <Tooltip
                  title={option?.desc}
                  placement="right"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontFamily: "inherit",
                        fontWeight: 400,
                        fontSize: "14px",
                        maxWidth: 400,
                        padding: "12px 16px",
                        backgroundColor: "#FFFFFF",
                        color: "#0A0A0A",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                >
                  <Box className="flex gap-2 items-center w-full">
                    <Typography variant="body2" className="text-neutral-950">
                      {option?.shortFuncName}
                    </Typography>
                  </Box>
                </Tooltip>
              </li>
            )}
            PaperComponent={({ children }) => (
              <Paper
                elevation={4}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                {children}
                <Box px={2} py={1}>
                  <Button
                    fullWidth
                    disableRipple
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate("/Devstudio/create-function")}
                    className="button px-2 py-1 text-xs text-[#3D69D3] border border-indigo-200 rounded-2xl"
                    style={{ background: "none", justifyContent: "flex-start" }}
                  >
                    {type === "entry"
                      ? STOCK_ENTRY_BUTTON_TITLE
                      : STOCK_EXIT_BUTTON_TITLE}
                    <CallMadeIcon fontSize="small" />
                  </Button>
                </Box>
              </Paper>
            )}
          />
        </Box>
        {filter?.name && (
          <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
            {!isView && (
              <Box
                onMouseEnter={(e) => (e.currentTarget.style.color = "red")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "transparent")
                }
                style={{ color: "transparent", cursor: "pointer" }}
              >
                <DeleteOutlineOutlinedIcon
                  sx={{ "&:hover": { color: "red" } }}
                  onClick={() => handleDelete(type, index)}
                />
              </Box>
            )}
            <div
              className="text-sm font-medium px-5 py-3 text-blue-600 cursor-pointer"
              onClick={() => handleConfigure(index, type)}
            >
              {isView ? "View Argument" : "Configure Argument"}
            </div>
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <>
      {openConfig && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenConfig(null)}
          title={
            values.stockEntryExit[openConfig.type][openConfig.index]?.name ||
            "Configure"
          }
          adesc={
            values.stockEntryExit[openConfig.type][openConfig.index]?.adesc ||
            []
          }
          args={
            values.stockEntryExit[openConfig.type][openConfig.index]?.args || []
          }
          subTitle={
            openConfig.type === "entry"
              ? STOCK_ENTRY_CONFIG_TITLE
              : STOCK_EXIT_CONFIG_TITLE
          }
          onSave={(updatedData) => {
            const updated = [...values.stockEntryExit[openConfig.type]];
            updated[openConfig.index] = {
              ...updated[openConfig.index],
              ...updatedData,
            };
            setFieldValue(`stockEntryExit.${openConfig.type}`, updated);
            localStorage.setItem(
              openConfig.type === "entry"
                ? STORAGE_KEY_ENTRY
                : STORAGE_KEY_EXIT,
              JSON.stringify(updated)
            );
            setOpenConfig(null);
          }}
        />
      )}

      <Box className="p-5 flex flex-col space-y-6">
        <TradeHeader
          title={STOCK_ENTRY_TITLE}
          description={STOCK_ENTRY_DESCRIPTION}
        />
        <Typography
          fontWeight="medium"
          mb={1}
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0px",
            color: "#0A0A0A",
          }}
        >
          {STOCK_ENTRY_SUB_TITLE}
        </Typography>
        {renderFilters("entry", stockEntryOptions)}
        {!isView && values?.stockEntryExit?.entry[0]?.name && (
          <div
            className="text-sm font-medium text-blue-600 cursor-pointer"
            onClick={() => addFilter("entry")}
          >
            Add another Stock Filter
          </div>
        )}
        <Divider sx={{ width: "100%" }} />
        <TradeHeader
          title={STOCK_EXIT_TITLE}
          description={STOCK_EXIT_DESCRIPTION}
        />
        <Typography
          fontWeight="medium"
          mb={1}
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0px",
            color: "#0A0A0A",
          }}
        >
          {STOCK_EXIT_SUB_TITLE}
        </Typography>
        {renderFilters("exit", stockExitOptions)}
        {!isView && values?.stockEntryExit?.exit[0]?.name && (
          <div
            className="text-sm font-medium text-blue-600 cursor-pointer"
            onClick={() => addFilter("exit")}
          >
            Add another Stock Filter
          </div>
        )}
      </Box>
    </>
  );
};

export default StockEntryExit;
