import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TradeHEader from "../TradeRule/TradeHEader";
import {
  Typography,
  Box,
  Divider,
  Button,
  FormGroup,
  Autocomplete,
  TextField,
  Tooltip,
  Paper,
} from "@mui/material";

import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";
import {
  MARKET_ENTRY_BUTTON_TITLE,
  MARKET_ENTRY_CONFIG_TITLE,
  MARKET_ENTRY_DESCRIPTION,
  MARKET_ENTRY_SUB_TITLE,
  MARKET_ENTRY_TITLE,
  MARKET_EXIT_BUTTON_TITLE,
  MARKET_EXIT_CONFIG_TITLE,
  MARKET_EXIT_DESCRIPTION,
  MARKET_EXIT_SUB_TITLE,
  MARKET_EXIT_TITLE,
} from "../../../../constants/CommonText";
import { tagTypes } from "../../../tagTypes";
import { useNavigate } from "react-router-dom";
import StockConfigModal from "../CreateStratezy/StockConfigModal";

const LOCAL_STORAGE_KEY_ENTRY = "marketEntryExit.entry";
const LOCAL_STORAGE_KEY_EXIT = "marketEntryExit.exit";

const MarketEntryExit = ({ isView, formik, id, setIsDirty }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getMarketEntry] = usePostMutation();
  const [getMarketExit] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const { marketEntryExit } = useSelector((state) => ({
    marketEntryExit: state.Stock,
  }));
  const { values, touched, errors, setFieldValue, setFieldTouched } = formik;

  const [marketEntryOptions, setMarketEntryOptions] = useState([]);
  const [marketExitOptions, setMarketExitOptions] = useState([]);
  const [openConfig, setOpenConfig] = useState(false);
  const [openEntry, setOpenEntry] = useState(false);

  useEffect(() => {
    (async () => {
      if (marketEntryExit?.length) {
        setMarketEntryOptions(marketEntryExit);
        setMarketExitOptions(marketEntryExit);
      } else {
        const { data: marketEntry } = await getMarketEntry({
          endpoint: "stock-analysis-function/details",
          payload: {
            gentry: true,
          },
        });
        dispatch(
          setAllData({ data: marketEntry?.data, key: "marketEntryExitEntry" })
        );
        setMarketEntryOptions(marketEntry?.data);

        const { data: marketExit } = await getMarketExit({
          endpoint: "stock-analysis-function/details",
          payload: {
            gexit: true,
          },
        });

        dispatch(
          setAllData({ data: marketExit?.data, key: "marketEntryExitExit" })
        );
        setMarketExitOptions(marketExit?.data);
      }
    })();
  }, []);

  // Restore filters from localStorage
  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY_ENTRY);

    if (saved && saved !== "undefined") {
      const parsed = JSON?.parse(saved);
      setFieldValue("marketEntryExit.entry", parsed);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY_EXIT);

    if (saved && saved !== "undefined") {
      const parsed = JSON?.parse(saved);
      setFieldValue("marketEntryExit.exit", parsed);
    }
  }, []);

  useEffect(() => {
    const filters = values?.marketEntryExit?.entry;

    localStorage.setItem(LOCAL_STORAGE_KEY_ENTRY, JSON.stringify(filters));
  }, [values?.marketEntryExit?.entry]);

  useEffect(() => {
    const filters = values?.marketEntryExit?.exit;

    localStorage.setItem(LOCAL_STORAGE_KEY_EXIT, JSON.stringify(filters));
  }, [values?.marketEntryExit?.exit]);

  const handleChangeMarketEntry = async (key, value) => {
    setIsDirty(true);
    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value?.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        // Update all related fields from the API response
        setFieldValue("marketEntryExit.entry.name", value?.func);
        setFieldValue("marketEntryExit.entry.adesc", data?.adesc || []);
        setFieldValue("marketEntryExit.entry.args", data?.args || []);
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    } else {
      // For other keys
      setFieldValue(`marketEntryExit.entry.${key}`, value.func);
    }
  };
  const handleChangeMarketExit = async (key, value) => {
    setIsDirty(true);
    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value?.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        // Update all related fields from the API response
        setFieldValue("marketEntryExit.exit.name", value?.func);
        setFieldValue("marketEntryExit.exit.adesc", data?.adesc || []);
        setFieldValue("marketEntryExit.exit.args", data?.args || []);
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    } else {
      // For other keys
      setFieldValue(`marketEntryExit.exit.${key}`, value?.func);
    }
  };

  const handleConfigure = () => {
    setOpenConfig(true); // Open modal for this index
  };
  const handleExitConfigure = () => {
    setOpenEntry(true);
  };
  const handleDelete = () => {
    setFieldValue("marketEntryExit.entry", {
      adesc: [],
      args: [],
      name: "", // assuming you track `name`
    });
  };
  const handleDeleteExit = () => {
    setFieldValue("marketEntryExit.exit", {
      adesc: [],
      args: [],
      name: "", // assuming you track `name`
    });
  };

  return (
    <>
      {openConfig && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenConfig(false)}
          title={values.marketEntryExit.entry?.name || "Configure"}
          adesc={values.marketEntryExit.entry?.adesc || []}
          args={values.marketEntryExit.entry?.args || []}
          subTitle={MARKET_ENTRY_CONFIG_TITLE}
          onSave={(updatedData) => {
            const updatedBuyRule = {
              ...values.marketEntryExit.entry,
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("marketEntryExit.entry", updatedBuyRule);

            setTimeout(() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY_ENTRY,
                JSON.stringify(updatedBuyRule)
              );
            }, 0);

            setOpenConfig(false);
          }}
        />
      )}

      {openEntry && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenEntry(false)}
          title={values.marketEntryExit.exit?.name || "Configure"}
          adesc={values.marketEntryExit.exit?.adesc || []}
          args={values.marketEntryExit.exit?.args || []}
          subTitle={MARKET_EXIT_CONFIG_TITLE}
          onSave={(updatedData) => {
            const updatedBuyRule = {
              ...values.marketEntryExit.exit,
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("marketEntryExit.exit", updatedBuyRule);

            setTimeout(() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY_EXIT,
                JSON.stringify(updatedBuyRule)
              );
            }, 0);

            setOpenEntry(false);
          }}
        />
      )}

      <Box className="flex flex-col max-md:max-w-full p-5   ">
        <Box className=" w-full max-md:max-w-full space-y-6">
          <TradeHEader
            title={MARKET_ENTRY_TITLE}
            description={MARKET_ENTRY_DESCRIPTION}
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
            {MARKET_ENTRY_SUB_TITLE}
          </Typography>

          <Box className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <FormGroup>
              <Autocomplete
                options={marketEntryOptions}
                value={
                  marketEntryOptions.find(
                    (opt) =>
                      opt?.func === values.marketEntryExit.entry?.name
                  ) || null
                }
                // value={values.marketEntryExit.entry?.name || ""}
                onChange={(e, newValue) => {
                  handleChangeMarketEntry("name", newValue || "");
                }}
                onBlur={() => {
                  setFieldTouched("marketEntryExit.entry.name", true);
                }}
                disabled={isView}
                size="small"
                disableClearable
                selectOnFocus
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "368px",
                  },
                  maxWidth: "100%",
                  outline: "none",
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.func === (value?.func || value)
                }
                getOptionLabel={(option) => option?.func || ""}
                renderInput={(params) => {
                  const selectedOption =
                    marketEntryOptions.find(
                      (opt) =>
                        opt.func === values.marketEntryExit.entry?.name
                    ) || {}; // {} when nothing selected

                  return (
                    <Tooltip
                      // title={selectedOption.desc || ""}
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
                          },
                        },
                      }}
                    >
                      <TextField
                        {...params}
                        placeholder="Select Market Entry"
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
                  <li {...props} key={option?.func}>
                    <Tooltip
                      // title={option?.desc}
                      title={
                        <Box>
                          <Typography
                            sx={{ fontWeight: 500, fontFamily: "Inter" }}
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
                        <Typography
                          variant="body2"
                          className="text-neutral-950"
                        >
                          {option?.func}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </li>
                )}
                ListboxProps={{
                  style: { maxHeight: 300 },
                }}
                popupIcon={null}
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
                        style={{
                          background: "none",
                          justifyContent: "flex-start",
                        }}
                      >
                        {MARKET_ENTRY_BUTTON_TITLE}
                        <CallMadeIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Paper>
                )}
              />
            </FormGroup>

            {/* Right group: Delete + View Argument */}
            {values.marketEntryExit?.entry?.name && (
              <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
                {!isView && (
                  <Box
                    onClick={handleDelete} // adjust this function for single object
                    onMouseEnter={(e) => (e.currentTarget.style.color = "red")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "transparent")
                    }
                    style={{ color: "transparent", cursor: "pointer" }}
                  >
                    <DeleteOutlineOutlinedIcon
                      sx={{ "&:hover": { color: "red" } }}
                    />
                  </Box>
                )}
                <div
                  className="text-sm font-medium px-5 py-3 border-blue-600 text-blue-600 rounded-sm min-h-10 cursor-pointer"
                  onClick={() => handleConfigure()}
                >
                  {isView ? "View Argument" : "Configure Argument"}
                </div>
              </Box>
            )}
          </Box>

          <Box className="p-2 ">
            <Divider orientation="horizontal" sx={{ width: "100%" }} />
          </Box>

          <Box>
            <TradeHEader
              title={MARKET_EXIT_TITLE}
              description={MARKET_EXIT_DESCRIPTION}
            />
          </Box>

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
            {MARKET_EXIT_SUB_TITLE}
          </Typography>

          <Box className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <FormGroup>
              <Autocomplete
                options={marketExitOptions}
                value={
                  marketExitOptions.find(
                    (opt) =>
                      opt?.func === values.marketEntryExit.exit?.name
                  ) || null
                }
                // value={values.marketEntryExit.exit?.name || ""}
                onChange={(e, newValue) => {
                  handleChangeMarketExit("name", newValue || "");
                }}
                onBlur={() => {
                  setFieldTouched("marketEntryExit.exit.name", true);
                }}
                disabled={isView}
                size="small"
                disableClearable
                selectOnFocus
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "368px",
                  },
                  maxWidth: "100%",
                  outline: "none",
                }}
                isOptionEqualToValue={(option, value) =>
                  option?.func === (value?.func || value)
                }
                getOptionLabel={(option) => option?.func || ""}
                renderInput={(params) => {
                  const selectedOption =
                    marketExitOptions.find(
                      (opt) =>
                        opt.func === values.marketEntryExit.exit?.name
                    ) || {}; // {} when nothing selected

                  return (
                    <Tooltip
                      // title={selectedOption.desc || ""}
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
                          },
                        },
                      }}
                    >
                      <TextField
                        {...params}
                        placeholder="Select Market Entry"
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
                  <li {...props} key={option?.func}>
                    <Tooltip
                      // title={option?.desc}
                      title={
                        <Box>
                          <Typography
                            sx={{ fontWeight: 500, fontFamily: "Inter" }}
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
                        <Typography
                          variant="body2"
                          className="text-neutral-950"
                        >
                          {option?.func}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </li>
                )}
                ListboxProps={{
                  style: { maxHeight: 300 },
                }}
                popupIcon={null}
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
                        style={{
                          background: "none",
                          justifyContent: "flex-start",
                        }}
                      >
                        {MARKET_EXIT_BUTTON_TITLE}
                        <CallMadeIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Paper>
                )}
              />
            </FormGroup>

            {/* Right group: Delete + View Argument */}
            {values.marketEntryExit?.exit?.name && (
              <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
                {!isView && (
                  <Box
                    onClick={handleDeleteExit} // adjust this function for single object
                    onMouseEnter={(e) => (e.currentTarget.style.color = "red")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "transparent")
                    }
                    style={{ color: "transparent", cursor: "pointer" }}
                  >
                    <DeleteOutlineOutlinedIcon
                      sx={{ "&:hover": { color: "red" } }}
                    />
                  </Box>
                )}
                <div
                  className="text-sm font-medium px-5 py-3 border-blue-600 text-blue-600 rounded-sm min-h-10 cursor-pointer"
                  onClick={() => handleExitConfigure()}
                >
                  {isView ? "View Argument" : "Configure Argument"}
                </div>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MarketEntryExit;
