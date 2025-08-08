import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TradeHEader from "./TradeHEader";
import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  FormGroup,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";
import {
  TRADE_RULE_BUTTON_TITLE,
  TRADE_RULE_CONFIG_TITLE,
  TRADE_RULE_DESCRIPTION,
  TRADE_RULE_SUB_TITLE,
  TRADE_RULE_TITLE,
} from "../../../../constants/CommonText";

import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { tagTypes } from "../../../tagTypes";
import StockConfigModal from "../CreateStratezy/StockConfigModal";
import { useNavigate } from "react-router-dom";

const LOCAL_STORAGE_KEY = "tradeRules.buyRule";

// Deduplicate helper by shortFuncName
const deduplicateTradeRules = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item?.shortFuncName || "";
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const TradeRule = ({ formik, isView, id, setIsDirty }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getTradeRule] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const tradeRule = useSelector((state) => state.Stock.tradeRule);

  const { values, touched, errors, setFieldValue, setFieldTouched } = formik;

  const [tradeRuleOptions, setTradeRuleOptions] = useState([]);

  const [openConfig, setOpenConfig] = useState(false);

  useEffect(() => {
    (async () => {
      if (tradeRule?.length) {
        setTradeRuleOptions(deduplicateTradeRules(tradeRule));
      } else {
        const { data: tradeRuleData } = await getTradeRule({
          endpoint: "stock-analysis-function/details",
          payload: {
            trade: true,
          },
        });

        const deduplicated = deduplicateTradeRules(tradeRuleData?.data || []);
        dispatch(setAllData({ data: deduplicated, key: "tradeRule" }));
        setTradeRuleOptions(deduplicated);
      }
    })();
  }, []);

  // Restore filters from localStorage
  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY);

    if (saved && saved !== "undefined") {
      const parsed = JSON?.parse(saved);
      setFieldValue("tradeRules.buyRule", parsed);
    }
  }, []);

  useEffect(() => {
    const filters = values?.tradeRules?.buyRule;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [values.tradeRules]);

  const handleChangeStockBundle = async (key, value) => {
    setIsDirty(true);
    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        // Update all related fields from the API response
        setFieldValue("tradeRules.buyRule.ruleName", value?.shortFuncName);
        setFieldValue("tradeRules.buyRule.adesc", data?.adesc || []);
        setFieldValue("tradeRules.buyRule.args", data?.args || []);
        // setFieldValue("tradeRules.buyRule.shortFuncValue", data?.args || []);
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    } else {
      // For other keys
      setFieldValue(`tradeRules.buyRule.${key}`, value.shortFuncName);
    }
  };

  const handleConfigure = () => {
    setOpenConfig(true); // Open modal for this index
  };

  const handleDelete = () => {
    setFieldValue("tradeRules.buyRule", {
      ruleName: "",
      adesc: [],
      args: [],
      name: "", // assuming you track `name`
    });
  };

  const customFilterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) => {
      return `${option?.func?.toLowerCase()} ${option?.shortFuncName?.toLowerCase()}`;
    },
  });

  // Final deduplicated list before rendering
  const deduplicatedOptions = useMemo(
    () => deduplicateTradeRules(tradeRuleOptions),
    [tradeRuleOptions]
  );

  return (
    <>
      {openConfig && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenConfig(false)}
          title={values.tradeRules.buyRule?.ruleName || "Configure"}
          subTitle={TRADE_RULE_CONFIG_TITLE}
          adesc={values.tradeRules.buyRule?.adesc || []}
          args={values.tradeRules.buyRule?.args || []}
          onSave={(updatedData) => {
            const updatedBuyRule = {
              ...values.tradeRules.buyRule,
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("tradeRules.buyRule", updatedBuyRule);

            setTimeout(() => {
              localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(updatedBuyRule)
              );
            }, 0);

            setOpenConfig(false);
          }}
        />
      )}

      <Box className="flex flex-col max-md:max-w-full p-5">
        <Box className=" w-full max-md:max-w-full space-y-6">
          <TradeHEader
            title={TRADE_RULE_TITLE}
            description={TRADE_RULE_DESCRIPTION}
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
            {TRADE_RULE_SUB_TITLE}
          </Typography>
          <Box className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            {/* <Box className="mt-2 w-full flex justify-between items-center gap-2"> */}
            <FormGroup>
              <Autocomplete
                options={deduplicatedOptions}
                filterOptions={customFilterOptions}
                value={
                  deduplicatedOptions.find(
                    (opt) =>
                      opt?.shortFuncName === values.tradeRules.buyRule?.ruleName
                  ) || null
                }
                // value={values.tradeRules.buyRule?.ruleName || ""}
                onChange={(e, newValue) => {
                  handleChangeStockBundle("name", newValue || "");
                }}
                onBlur={() => {
                  setFieldTouched("tradeRules.buyRule.name", true);
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
                  option?.shortFuncName === value?.shortFuncName
                }
                getOptionLabel={(option) => option?.func || ""}
                renderInput={(params) => {
                  const selectedOption =
                    deduplicatedOptions.find(
                      (opt) =>
                        opt.shortFuncName ===
                        values.tradeRules?.buyRule?.ruleName
                    ) || {};

                  return (
                    <Tooltip
                      title={
                        <Box>
                          <Typography
                            sx={{ fontWeight: 500, fontFamily: "Inter" }}
                          >
                            {selectedOption.func}
                          </Typography>
                          <Typography variant="string">
                            {selectedOption.desc}
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
                            visibility: values.tradeRules.buyRule?.ruleName
                              ? "visible"
                              : "hidden",
                          },
                        },
                      }}
                    >
                      <TextField
                        {...params}
                        placeholder="Select Trade Rule"
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
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option?.shortFuncName}>
                      <Tooltip
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
                              fontFamily: "Inter",
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
                  );
                }}
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
                        {TRADE_RULE_BUTTON_TITLE}
                        <CallMadeIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Paper>
                )}
              />
            </FormGroup>

            {/* Right group: Delete + View Argument */}
            {values.tradeRules.buyRule?.ruleName && (
              <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
                {!isView && (
                  <Box
                    onClick={handleDelete}
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
                  onClick={() => handleConfigure()}
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

export default TradeRule;
