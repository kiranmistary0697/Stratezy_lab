import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllData } from "../../../../slices/page/reducer";
import { useNavigate } from "react-router-dom";

import { tagTypes } from "../../../tagTypes";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormGroup,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import InputField from "./InputField";

import StockConfigModal from "../CreateStratezy/StockConfigModal";
import TradeHEader from "../TradeRule/TradeHEader";
import {
  PSIZINING__DESCRIPTION,
  PSIZINING_BUTTON_TITLE,
  PSIZINING_CONFIG_TITLE,
  PSIZINING_SUB_TITLE,
  PSIZINING_SUBHEADER_DESC,
  PSIZINING_SUBHEADER_TITLE,
  PSIZINING_TITLE,
  PSIZINING_TOOLTIP_TITLE_1,
  PSIZINING_TOOLTIP_TITLE_2,
  PSIZINING_TOOLTIP_TITLE_3,
} from "../../../../constants/CommonText";

import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const LOCAL_STORAGE_KEY = "portfolioSizing-saved";
const PortfolioSizing = ({ isView, formik, id, setIsDirty }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getTradeRule] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();

  const { portfolioSizing } = useSelector((state) => ({
    portfolioSizing: state.Stock.portfolioSizing,
  }));
  //portfolioSizing-saved
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue = () => {},
    setFieldTouched = () => {},
  } = formik;

  const [portfolioSizingOptions, setPortfolioSizingOptions] = useState([]);
  const [openConfig, setOpenConfig] = useState(false);
  const [risk, setRisk] = useState("0.007");
  const [maxInvest, setMaxInvest] = useState("0.02");
  const [minInvest, setInvest] = useState("0.002");

  useEffect(() => {
    (async () => {
      if (portfolioSizing?.length) {
        setPortfolioSizingOptions(portfolioSizing);
      } else {
        const { data: portfolioSizingData } = await getTradeRule({
          endpoint: "stock-analysis-function/details",
          payload: {
            psizing: true,
          },
        });

        dispatch(
          setAllData({
            data: portfolioSizingData?.data,
            key: "portfolioSizing",
          })
        );
        setPortfolioSizingOptions(portfolioSizingData?.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (!values.portfolioSizing?.portfolioRisk) {
      setFieldValue("portfolioSizing.portfolioRisk", risk);
    }
    if (!values.portfolioSizing?.maxInvestment) {
      setFieldValue("portfolioSizing.maxInvestment", maxInvest);
    }
    if (!values.portfolioSizing?.minInvestment) {
      setFieldValue("portfolioSizing.minInvestment", minInvest);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage?.getItem(LOCAL_STORAGE_KEY);

    if (saved && saved !== "undefined") {
      const parsed = JSON?.parse(saved);
      setFieldValue("portfolioSizing", parsed);
    }
  }, []);

  useEffect(() => {
    const filters = values?.portfolioSizing;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filters));
  }, [values.portfolioSizing]);

  const handleChangeStockBundle = async (key, value) => {
    setIsDirty(true);
    if (key === "name") {
      try {
        const { data } = await getStrategyData({
          endpoint: `stock-analysis-function/${value?.shortFuncName}`,
          tags: [tagTypes.GET_SELECTDATA],
        }).unwrap();

        // Update all related fields from the API response
        setFieldValue(
          "portfolioSizing.selectedPortfolio",
          value?.shortFuncName
        );
        setFieldValue("portfolioSizing.adesc", data?.adesc || []);
        setFieldValue("portfolioSizing.args", data?.args || []);
      } catch (err) {
        console.error("Error fetching filter config", err);
      }
    } else {
      // For other keys
      setFieldValue(`portfolioSizing.${key}`, value?.shortFuncName);
    }
  };

  const handleConfigure = () => {
    setOpenConfig(true); // Open modal for this index
  };

  const handleDelete = () => {
    setFieldValue("portfolioSizing", {
      selectedPortfolio: "",
      adesc: [],
      args: [],
      portfolioRisk: risk,
      maxInvestment: maxInvest,
      minInvestment: minInvest,
    });
  };

  return (
    <>
      {openConfig && (
        <StockConfigModal
          open={true}
          onClose={() => setOpenConfig(false)}
          title={values.portfolioSizing?.selectedPortfolio || "Configure"}
          adesc={values.portfolioSizing?.adesc || []}
          args={values.portfolioSizing?.args || []}
          subTitle={PSIZINING_CONFIG_TITLE}
          onSave={(updatedData) => {
            const updatedBuyRule = {
              ...values.portfolioSizing,
              ...updatedData, // expects { args, adesc }
            };

            setFieldValue("portfolioSizing", updatedBuyRule);

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
      <Box className="flex flex-col max-md:max-w-full p-5   ">
        <Box className=" w-full max-md:max-w-full space-y-6">
          <TradeHEader
            title={PSIZINING_TITLE}
            description={PSIZINING__DESCRIPTION}
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
            {PSIZINING_SUB_TITLE}
          </Typography>

          <Box className="mt-2 w-full flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <FormGroup>
              <Autocomplete
                options={portfolioSizingOptions}
                value={
                  portfolioSizingOptions.find(
                    (opt) =>
                      opt?.shortFuncName ===
                      values.portfolioSizing?.selectedPortfolio
                  ) || null
                }
                // value={values.portfolioSizing?.selectedPortfolio || ""}
                onChange={(e, newValue) => {
                  handleChangeStockBundle("name", newValue || "");
                }}
                onBlur={() => {
                  setFieldTouched("portfolioSizing.name", true);
                }}
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
                isOptionEqualToValue={(option, value) =>
                  option?.shortFuncName === (value?.shortFuncName || value)
                }
                getOptionLabel={(option) => option?.shortFuncName || ""}
                renderInput={(params) => {
                  const selectedOption =
                    portfolioSizingOptions.find(
                      (opt) =>
                        opt.shortFuncName ===
                        values.portfolioSizing?.selectedPortfolio
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
                        placeholder="Select Portfolio Sizing Rule"
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
                        {PSIZINING_BUTTON_TITLE}
                        <CallMadeIcon fontSize="small" />
                      </Button>
                    </Box>
                  </Paper>
                )}
              />
            </FormGroup>

            {values.portfolioSizing?.selectedPortfolio && (
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
              title={PSIZINING_SUBHEADER_TITLE}
              description={PSIZINING_SUBHEADER_DESC}
            />
          </Box>

          <Box className="max-md:max-w-full">
            <InputField
              label="Portfolio Risk"
              name="portfolioSizing.portfolioRisk"
              tooltip={PSIZINING_TOOLTIP_TITLE_1}
              value={values.portfolioSizing?.portfolioRisk}
              onChange={handleChange}
              onBlur={handleBlur}
              disable={isView}
              error={
                !!errors.portfolioSizing?.portfolioRisk &&
                touched.portfolioSizing?.portfolioRisk
              }
              errorText={errors.portfolioSizing?.portfolioRisk}
            />
            <InputField
              label="Max Investment Per Trade"
              name="portfolioSizing.maxInvestment"
              tooltip={PSIZINING_TOOLTIP_TITLE_2}
              value={values.portfolioSizing?.maxInvestment}
              onChange={handleChange}
              onBlur={handleBlur}
              disable={isView}
              error={
                !!errors.portfolioSizing?.maxInvestment &&
                touched.portfolioSizing?.maxInvestment
              }
              errorText={errors.portfolioSizing?.maxInvestment}
            />
            <InputField
              label="Min Investment Per Trade"
              name="portfolioSizing.minInvestment"
              tooltip={PSIZINING_TOOLTIP_TITLE_3}
              value={values.portfolioSizing?.minInvestment}
              disable={isView}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                !!errors.portfolioSizing?.minInvestment &&
                touched.portfolioSizing?.minInvestment
              }
              errorText={errors.portfolioSizing?.minInvestment}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PortfolioSizing;
