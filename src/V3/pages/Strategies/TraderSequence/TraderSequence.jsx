import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TradeHEader from "../TradeRule/TradeHEader";
import {
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Autocomplete,
  TextField,
  Paper,
  Popper,
} from "@mui/material";

import CallMadeIcon from "@mui/icons-material/CallMade";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";
import { tagTypes } from "../../../tagTypes";
import { useNavigate } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StockConfigModal from "../CreateStratezy/StockConfigModal";
import {
  TRADE_SEQUENCE__DESCRIPTION,
  TRADE_SEQUENCE_BUTTON_TITLE,
  TRADE_SEQUENCE_CONFIG_TITLE,
  TRADE_SEQUENCE_SUB_TITLE,
  TRADE_SEQUENCE_TITLE,
} from "../../../../constants/CommonText";

const LOCAL_STORAGE_KEY = "tradeSequence";

const TraderSequence = ({ isView, formik, id, setIsDirty }) => {
  const CustomPopper = (props) => (
    <Popper
      {...props}
      placement="bottom-start"
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
    />
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getTradeRule] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const { traderSequence } = useSelector((state) => ({
    traderSequence: state.Stock.traderSequence,
  }));
  const { values, touched, errors, setFieldValue, setFieldTouched } = formik;

  const [traderSequenceOptions, setTraderSequenceOptions] = useState([]);
  const [openConfigIndex, setOpenConfigIndex] = useState(null);

  useEffect(() => {
    (async () => {
      if (traderSequence?.length) {
        setTraderSequenceOptions(traderSequence);
      } else {
        const { data: traderSequenceData } = await getTradeRule({
          endpoint: "stock-analysis-function/details",
          payload: {
            order: true,
          },
        });

        dispatch(
          setAllData({ data: traderSequenceData?.data, key: "traderSequence" })
        );
        setTraderSequenceOptions(traderSequenceData?.data);
      }
    })();
  }, []);

  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY);
    if (saved && saved !== "undefined") {
      const parsed = JSON?.parse(saved);
      setFieldValue("tradeSequence", parsed);
    }
  }, []);

  useEffect(() => {
    const filters = values.tradeSequence;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [values.tradeSequence]);

  const handleChange = async (index, key, value) => {
    const updated = [...values.tradeSequence];
    updated[index][key] = value?.shortFuncName;
    setIsDirty(true);

    // If a new filter name is selected, fetch args/adesc
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

    setFieldValue("tradeSequence", updated);
  };

  const addFilter = () => {
    const updated = [
      ...values.tradeSequence,
      {
        name: "",
        adesc: [],
        args: [],
      },
    ];
    setFieldValue("tradeSequence", updated);
  };

  const handleConfigure = (index) => {
    setOpenConfigIndex(index); // Open modal for this index
  };

  const handleDelete = (index) => {
    const updated = [...values.tradeSequence];

    if (index === 0) {
      // Just clear the first item instead of removing it
      updated[0] = {
        name: "",
        adesc: [],
        args: [],
      };
    } else {
      // Remove the selected index
      updated.splice(index, 1);
    }

    setFieldValue("tradeSequence", updated);

    setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }, 0);
  };

  return (
    <>
      {openConfigIndex !== null && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenConfigIndex(null)}
          title={values.tradeSequence[openConfigIndex]?.name || "Configure"}
          adesc={values.tradeSequence[openConfigIndex]?.adesc || []}
          args={values.tradeSequence[openConfigIndex]?.args || []}
          subTitle={TRADE_SEQUENCE_CONFIG_TITLE}
          onSave={(updatedData) => {
            const updated = [...values.tradeSequence];

            updated[openConfigIndex] = {
              ...updated[openConfigIndex],
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("tradeSequence", updated);

            setTimeout(() => {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            }, 0); // prevent race condition

            setOpenConfigIndex(null);
          }}
        />
      )}

      <Box className="flex flex-col max-md:max-w-full p-5   ">
        <Box className=" w-full max-md:max-w-full space-y-6">
          <TradeHEader
            title={TRADE_SEQUENCE_TITLE}
            description={TRADE_SEQUENCE__DESCRIPTION}
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
            {TRADE_SEQUENCE_SUB_TITLE}
          </Typography>

          {(values?.tradeSequence || []).map((filter, index) => (
            <Box
              key={index}
              className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3"
            >
              {/* Left group: AND + Filter Select */}
              <Box className="flex items-center gap-2">
                <Autocomplete
                  options={traderSequenceOptions}
                  value={
                    traderSequenceOptions.find(
                      (o) => o.shortFuncName === filter?.name
                    ) || null
                  }
                  // value={filter?.name || null}
                  onChange={(e, newValue) =>
                    handleChange(index, "name", newValue)
                  }
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
                  disabled={isView}
                  popupIcon={null}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    if (option && typeof option === "object") {
                      return option.shortFuncName || "";
                    }
                    return "";
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.shortFuncName ===
                    (typeof value === "string" ? value : value?.shortFuncName)
                  }
                  // className="custom-select max-md:w-full"
                  PopperComponent={CustomPopper}
                  ListboxProps={{ style: { maxHeight: 300 } }}
                  renderInput={(params) => {
                    const selectedOption =
                      traderSequenceOptions.find(
                        (opt) => opt.shortFuncName === filter?.name
                      ) || {}; // {} when nothing selected

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
                          placeholder="Select Trade Sequence"
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
                          <Typography
                            variant="body2"
                            className="text-neutral-950"
                          >
                            {option?.shortFuncName}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </li>
                  )}
                  PaperComponent={({ children, ...props }) => (
                    <Paper {...props}>
                      {children}
                      <Box px={2} py={1}>
                        <Button
                          fullWidth
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/Devstudio/create-function");
                          }}
                          className=" button px-2 py-1 text-xs text-[#3D69D3] border border-indigo-200 rounded-2xl"
                          style={{
                            background: "none",
                            justifyContent: "flex-start",
                          }}
                        >
                          {TRADE_SEQUENCE_BUTTON_TITLE}
                          <CallMadeIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Paper>
                  )}
                />
              </Box>

              {/* Right group: Delete + View Argument */}
              {filter?.name && (
                <Box className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-2">
                  {!isView && (
                    <Box
                      onClick={() => handleDelete(index)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "red")
                      }
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
                    onClick={() => handleConfigure(index)}
                  >
                    {isView ? "View Argument" : "Configure Argument"}
                  </div>
                </Box>
              )}
            </Box>
          ))}

          {!isView && (
            <div
              className="text-sm font-medium p-10px text-blue-600 cursor-pointer"
              onClick={addFilter}
              size="small"
            >
              Add another Trade Sequence
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TraderSequence;
