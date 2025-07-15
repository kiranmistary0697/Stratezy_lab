import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  FormGroup,
  Tooltip,
  Autocomplete,
  TextField,
  Paper,
  createFilterOptions,
} from "@mui/material";
import { usePostMutation, useLazyGetQuery } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";
import { tagTypes } from "../../../tagTypes";
import StockConfigModal from "./StockConfigModal";
import CreateStock from "../Modal/CreateStock";
import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TradeHEader from "../TradeRule/TradeHEader";
import AddStockFilterModal from "../Modal/AddStockFilterModal";
import {
  STOCK_BUNDLE_BUTTON_TITLE,
  STOCK_BUNDLE_CONFIG_TITLE,
  STOCK_BUNDLE_DESCRIPTION,
  STOCK_BUNDLE_TITLE,
  STOCK_SUB_TITLE,
} from "../../../../constants/CommonText";

const LOCAL_STORAGE_KEY = "stockFilters";

const StockBundleStep = ({ isView, formik = {}, setIsDirty }) => {
  const dispatch = useDispatch();
  const { stockBundle } = useSelector((state) => ({
    stockBundle: state.Stock.stockBundle,
  }));

  const { values, touched, errors, setFieldValue, setFieldTouched } = formik;

  const [getStockBundle] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const [stockBundleOptions, setStockBundleOptions] = useState([]);
  const [openConfigIndex, setOpenConfigIndex] = useState(null);
  const [isCreateStock, setIsCreateStock] = useState(false);
  const [activeStockIndex, setActiveStockIndex] = useState(null);
  const [openAddStockModal, setOpenAddStockModal] = useState(null);
  const [viewStockList, setViewStockList] = useState("");

  // Load from Redux or fetch stock filter options
  useEffect(() => {
    (async () => {
      if (stockBundle?.length) {
        const sortedStockBundle = [...stockBundle].sort((a, b) =>
          a.func.localeCompare(b.func)
        );
        setStockBundleOptions(sortedStockBundle);
      } else {
        const { data } = await getStockBundle({
          endpoint: "stock-analysis-function/details",
          payload: { filter: true },
          tags: [tagTypes.GET_FILTERTYPE, tagTypes.CREATE_STRATEGY],
        });
        dispatch(setAllData({ data: data?.data, key: "stockBundle" }));
        if (data?.data.length) {
          const sortedStockBundle = [...data.data].sort((a, b) =>
            a.func.localeCompare(b.func)
          );
          setStockBundleOptions(sortedStockBundle) || [];
        } else {
          setStockBundleOptions([]);
        }
      }
    })();
  }, []);

  // Restore filters from localStorage
  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY);
    if (saved && saved !== "undefined") {
      const parsed = JSON.parse(saved);

      setFieldValue("stockBundle", parsed);
    }
  }, []);

  // Persist to localStorage on any change
  useEffect(() => {
    const filters = values.stockBundle;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [values.stockBundle]);

  const handleSaveCreatedStock = (newFilter) => {
    // 1. Add new name to options if it's not already there
    if (!stockBundleOptions.includes(newFilter.name)) {
      setStockBundleOptions((prev) => [...prev, newFilter.name]);
    }

    // 2. Set this new filter name into Formik
    formik.setFieldValue(
      `stockBundle[${activeStockIndex}].name`,
      newFilter.name
    );
    formik.setFieldValue(
      `stockBundle[${activeStockIndex}].type`,
      newFilter.type
    );
    formik.setFieldTouched(`stockBundle[${activeStockIndex}].name`, false);
  };

  const handleChangeStockBundle = async (index, key, value) => {
    const updated = [...values.stockBundle];
    updated[index][key] = value.func;
    setIsDirty(true);
    // If a new filter name is selected, fetch args/adesc
    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        updated[index].type = value.static ? "Static" : "Dynamic";
        updated[index].adesc = data?.adesc || [];
        updated[index].args = data?.args || [];
        setViewStockList(data);
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    }

    setFieldValue("stockBundle", updated);
  };

  const customFilterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => {
      return `${option?.func?.toLowerCase()} ${option?.shortFuncName?.toLowerCase()}`;
    },
  });

  const addFilter = () => {
    const updated = [
      ...values.stockBundle,
      {
        fieldName: "AND",
        name: "",
        type: "Dynamic",
        adesc: [],
        args: [],
      },
    ];
    setFieldValue("stockBundle", updated);
    setFieldTouched(`stockBundle[${updated.length - 1}].name`, false);
  };

  const handleConfigure = (index) => {
    setOpenConfigIndex(index); // Open modal for this index
  };

  const handleAddEditStock = (index) => {
    setOpenAddStockModal(index);
  };

  const handleDelete = (index) => {
    const updated = [...values.stockBundle];

    if (updated.length === 1) {
      updated[0] = {
        name: "",
        type: "Dynamic",
        adesc: [],
        args: [],
      };
      setFieldTouched(`stockBundle[0].name`, false);
    } else {
      updated.splice(index, 1);
      if (index < updated.length) {
        setFieldTouched(`stockBundle[${index}].name`, false);
      }
    }

    setFieldValue("stockBundle", updated);

    setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }, 0);
  };

  return (
    <>
      {isCreateStock && (
        <CreateStock
          isOpen={isCreateStock}
          handleClose={() => {
            setIsCreateStock(false);
          }}
          setIsCreateStock={setIsCreateStock}
          handleNewStockFilter={handleSaveCreatedStock}
        />
      )}
      {openAddStockModal !== null && (
        <AddStockFilterModal
          open={true}
          title={values.stockBundle[openAddStockModal]?.name || "Configure"}
          handleClose={() => setOpenAddStockModal(null)}
          viewStockList={viewStockList}
          setViewStockList={setViewStockList}
          handleNewStockFilter={handleSaveCreatedStock}
        />
      )}

      {openConfigIndex !== null && (
        <StockConfigModal
          open={true}
          isView={isView}
          onClose={() => setOpenConfigIndex(null)}
          title={values.stockBundle[openConfigIndex]?.name || "Configure"}
          subTitle={STOCK_BUNDLE_CONFIG_TITLE}
          adesc={values.stockBundle[openConfigIndex]?.adesc || []}
          args={values.stockBundle[openConfigIndex]?.args || []}
          onSave={(updatedData) => {
            const updated = [...values.stockBundle];

            updated[openConfigIndex] = {
              ...updated[openConfigIndex],
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("stockBundle", updated);

            setTimeout(() => {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            }, 0); // prevent race condition

            setOpenConfigIndex(null);
          }}
        />
      )}

      <Box className="flex flex-col max-md:max-w-full p-5">
        <Box className="w-full max-md:max-w-full space-y-6">
          <TradeHEader
            title={STOCK_BUNDLE_TITLE}
            description={STOCK_BUNDLE_DESCRIPTION}
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
            {STOCK_SUB_TITLE}
          </Typography>

          {(values?.stockBundle || []).map((filter, index) => {
            const type = stockBundleOptions?.find(
              (item) => item.shortFuncName === filter?.name
            )?.stockList;
            return (
              <Box
                key={index}
                className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3"
              >
                {/* Left group: AND + Filter Select */}
                <Box className="flex flex-col sm:flex-row gap-2 flex-1">
                  {index > 0 && (
                    <Select
                      value={filter.fieldName || "AND"}
                      onChange={(e) =>
                        handleChangeStockBundle(
                          index,
                          "fieldName",
                          e.target.value
                        )
                      }
                      size="small"
                      disabled={isView}
                      // className="custom-select max-md:w-full"
                      style={{ "--custom-width": "w-[80px]", height: "80%" }}
                    >
                      <MenuItem value="AND">AND</MenuItem>
                    </Select>
                  )}

                  <FormGroup className="w-full flex-1">
                    <Autocomplete
                      options={stockBundleOptions}
                      value={filter?.name || ""}
                      onChange={(e, newValue) =>
                        handleChangeStockBundle(index, "name", newValue || "")
                      }
                      onBlur={() =>
                        setFieldTouched(`stockBundle[${index}].name`, true)
                      }
                      filterOptions={customFilterOptions}
                      disabled={isView}
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
                      disableClearable
                      selectOnFocus
                      getOptionLabel={(option) =>
                        // option can be string *or* object depending on where MUI calls it from
                        typeof option === "string" ? option : option?.func || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.func ===
                        (typeof value === "string" ? value : value?.func)
                      }
                      renderInput={(params) => {
                        const selectedOption =
                          typeof filter?.name === "string"
                            ? stockBundleOptions.find(
                                (opt) => opt.func === filter.name
                              )
                            : filter?.name;

                        // const tooltipTitle = selectedOption?.desc || "";

                        return (
                          <Tooltip
                            // title={tooltipTitle}
                            title={
                              <Box>
                                <Typography
                                  sx={{ fontWeight: 500, fontFamily: "Inter" }}
                                >
                                  {selectedOption?.func}
                                </Typography>
                                <Typography variant="string">
                                  {selectedOption?.desc}
                                </Typography>
                              </Box>
                            }
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
                                  visibility: filter.name
                                    ? "visible"
                                    : "hidden",
                                },
                              },
                            }}
                          >
                            <TextField
                              {...params}
                              error={
                                !!errors.stockBundle?.[index]?.name &&
                                touched.stockBundle?.[index]?.name
                              }
                              helperText={
                                !!errors.stockBundle?.[index]?.name &&
                                touched.stockBundle?.[index]?.name
                                  ? errors.stockBundle?.[index]?.name
                                  : ""
                              }
                              placeholder="Select Stock Filter"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <Box className="flex items-center gap-2 pl-2">
                                    {filter?.name && (
                                      <Typography
                                        variant="caption"
                                        className="px-2 py-0.5 text-xs text-indigo-700 bg-indigo-50 rounded-2xl border border-indigo-200"
                                      >
                                        {type
                                          ? "Static"
                                          : filter?.type || "Dynamic"}
                                      </Typography>
                                    )}
                                  </Box>
                                ),
                              }}
                            />
                          </Tooltip>
                        );
                      }}
                      renderOption={(props, option) => {
                        return (
                          <li {...props} key={option?.func}>
                            <Tooltip
                              // title={option?.desc}
                              title={
                                <Box>
                                  <Typography
                                    sx={{
                                      fontWeight: 500,
                                      fontFamily: "Inter",
                                    }}
                                  >
                                    {option?.func}
                                  </Typography>
                                  <Typography variant="string">
                                    {option?.desc}
                                  </Typography>
                                </Box>
                              }
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
                                <Typography variant="body2">
                                  {option?.func}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="px-2 py-0.5 text-xs text-indigo-700 bg-indigo-50 rounded-2xl border border-indigo-200 ml-2"
                                >
                                  {option?.static ? "Static" : "Dynamic"}
                                </Typography>
                              </Box>
                            </Tooltip>
                          </li>
                        );
                      }}
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
                              onClick={() => {
                                setActiveStockIndex(index);
                                setIsCreateStock(true);
                              }}
                              className="button px-2 py-1 text-xs text-[#3D69D3] border border-indigo-200 rounded-2xl"
                              style={{
                                background: "none",
                                justifyContent: "flex-start",
                              }}
                            >
                              {STOCK_BUNDLE_BUTTON_TITLE}
                              <CallMadeIcon fontSize="small" />
                            </Button>
                          </Box>
                        </Paper>
                      )}
                    />
                  </FormGroup>
                </Box>

                {filter.name && (
                  <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
                    {!isView && (
                      <Box
                        onClick={() => handleDelete(index)}
                        sx={{
                          color: "red",
                          cursor: "pointer",
                          opacity: 0.4,
                          "&:hover": {
                            color: "red",
                            opacity: 1,
                          },
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </Box>
                    )}
                    <div
                      className="text-sm font-medium px-5 py-3 border-blue-600 text-blue-600 rounded-sm min-h-10 cursor-pointer"
                      onClick={() =>
                        type || filter?.type === "Static"
                          ? handleAddEditStock(index)
                          : handleConfigure(index)
                      }
                    >
                      {isView
                        ? "View Argument"
                        : type || filter?.type === "Static"
                        ? "View/Add Stocks to Static Filter "
                        : "Configure Argument"}
                    </div>
                  </Box>
                )}
              </Box>
            );
          })}

          {!isView && values.stockBundle[0]?.name && (
            <div
              className="text-sm font-medium p-10px text-blue-600 cursor-pointer"
              onClick={addFilter}
              disabled={!values.stockBundle[0].name}
              size="small"
            >
              Add another Stock Filter
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default StockBundleStep;
