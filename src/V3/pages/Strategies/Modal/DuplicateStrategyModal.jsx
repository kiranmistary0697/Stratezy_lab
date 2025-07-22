import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import ModalButton from "../../../common/Table/ModalButton";
import SuccessModal from "../../../common/SuccessModal";

import _ from "lodash";

import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";
import { useLocation, useNavigate } from "react-router-dom";

const CustomizedDialogs = ({
  title,
  isOpen,
  handleClose = () => {},
  setIsDirty = () => {},
  formik = {},
  isDuplicate = false,
  id,
  name = "",
  description = "",
  version = "",
  demoStrategy,
  fetchAllData,
  demoData,
  textButton = "",
}) => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategy = queryParams.get("name");
  const defaultVersion = queryParams.get("version");
  const demo = queryParams.get("demo");
  const navigate = useNavigate();
  const [getStrategyData] = useLazyGetQuery();
  const [createStock] = usePostMutation();
  const [editStock] = usePostMutation();

  const [strategyName, setStrategyName] = useState("");
  const [descriptionName, setDescriptionName] = useState("");
  const [versionName, setVersionName] = useState("v1");
  const [buttonText, setButtonText] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formatStrategyData, setFormatStrategyData] = useState("");

  const canSave = strategyName.trim() !== "" && descriptionName.trim() !== "";

  const {
    values,
    touched,
    errors,
    setFieldValue = () => {},
    setFieldTouched = () => {},
  } = formik;

  const hasAllValues = (obj) => {
    const stockBundleValid =
      Array.isArray(obj?.stockBundle) &&
      obj.stockBundle.every((item) => !_.isEmpty(item?.name));

    const tradeRuleValid = !_.isEmpty(obj?.tradeRules?.buyRule?.ruleName);

    const p = obj?.portfolioSizing || {};
    const portfolioValid =
      !_.isEmpty(p?.selectedPortfolio) &&
      !_.isEmpty(p?.portfolioRisk) &&
      !_.isEmpty(p?.maxInvestment) &&
      !_.isEmpty(p?.minInvestment);

    return stockBundleValid && tradeRuleValid && portfolioValid;
  };

  const fetchStrategy = async () => {
    let endpointApi = "";

    if (isDuplicate && demoStrategy) {
      endpointApi = `strategystore/get/name/${name}?demo=true&version=${version}`;
    } else if (isDuplicate) {
      endpointApi = `strategystore/get/name/${name}?version=${version}`;
    } else if (demo === "true" || demoStrategy === "true") {
      endpointApi = `strategystore/get/name/${id}?demo=true&version=${defaultVersion}`;
    } else {
      endpointApi = `strategystore/get/name/${id}?version=${defaultVersion}`;
    }
    try {
      const { data } = await getStrategyData({
        endpoint: endpointApi,
        tags: [tagTypes.GET_ALLDATA],
      }).unwrap();

      setFormatStrategyData(data);

      setStrategyName(data?.name || "");
      setDescriptionName(data?.strategy?.description || "");
      setVersionName(data?.version || "v1");

      setFieldValue("name", data?.name || "", true);
      setFieldValue("description", data?.strategy?.description || "", true);
    } catch (error) {
      console.error("Fetch strategy error:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStrategy();
    }
  }, [id, demoStrategy]);

  useEffect(() => {
    if (demoStrategy) {
      const newName = demoData?.name || "";
      const newDesc = demoData?.strategy?.description || "";

      setStrategyName(newName);
      setDescriptionName(newDesc);
      setVersionName(version || "v1");
      setFormatStrategyData(demoData);

      // Sync with Formik
      setFieldValue("name", newName, true);
      setFieldValue("description", newDesc, true);
    }
  }, [demoStrategy]);

  useEffect(() => {
    setButtonText(textButton);
  }, [values]);

  const handleSave = async () => {
    const {
      stockBundle = [],
      portfolioSizing = {},
      tradeRules = {},
      tradeSequence = [],
      stockEntryExit = {},
      marketEntryExit = {},
    } = values || {};

    const strategy = {
      exchange: "",
      name: strategyName,
      initialCapital: 0,
      portfolioRisk: parseFloat(portfolioSizing?.portfolioRisk || 0),
      maxInvestmentPerTrade: parseFloat(portfolioSizing?.maxInvestment || 0),
      minInvestmentPerTrade: parseFloat(portfolioSizing?.minInvestment || 0),
      zeroDate: "",
      nDate: "",
      ...(stockBundle.filter(({ name }) => name)?.length > 0 && {
        filterRule: stockBundle.map(({ name, args, adesc, type }) => ({
          ruleType: "TRADE_FILTER_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: name,
          stockList: type === "Static" ? true : false,
          funcArgs: args || [],
          argDesc: adesc || [],
        })),
      }),

      ...(tradeSequence[0]?.name && {
        orderRule: [
          // {
          //   ruleType: "TRADE_ORDER_RULE",
          //   ruleSubType: "PREDEF_RULE",
          //   predefRule: "asc",
          // },
          ...tradeSequence.map((seq) => ({
            ruleType: "TRADE_ORDER_RULE",
            ruleSubType: "LIB_FUNC_RULE",
            funcName: seq.name,
            funcArgs: seq.args || [],
            argDesc: seq.adesc || [],
          })),
        ],
      }),

      ...(tradeRules?.buyRule?.ruleName && {
        tradeRule: {
          ruleType: "TRADE_STRATEGY_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: tradeRules?.buyRule?.ruleName || "",
          funcArgs: tradeRules?.buyRule?.args || [],
          argDesc: tradeRules?.buyRule?.adesc || [],
        },
      }),
      ...(marketEntryExit?.entry?.name && {
        globalEntryRule: {
          symbol: "nifty",
          ruleType: "TRADE_GLOBAL_ENTRY_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: marketEntryExit?.entry?.name,
          funcArgs: marketEntryExit?.entry?.args || [],
          argDesc: marketEntryExit?.entry?.adesc || [],
        },
      }),
      ...(marketEntryExit?.exit?.name && {
        globalExitRule: {
          symbol: "nifty",
          ruleType: "TRADE_GLOBAL_EXIT_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: marketEntryExit?.exit?.name,
          funcArgs: marketEntryExit?.exit?.args || [],
          argDesc: marketEntryExit?.exit?.adesc || [],
        },
      }),

      ...(stockEntryExit?.entry?.filter(({ name }) => name)?.length > 0 && {
        entryRule: stockEntryExit.entry.map(({ name, args, adesc }) => ({
          ruleType: "TRADE_ENTRY_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: name,
          funcArgs: args,
          argDesc: adesc,
        })),
      }),

      ...(stockEntryExit?.exit?.filter(({ name }) => name)?.length > 0 && {
        exitRule: stockEntryExit.exit.map(({ name, args, adesc }) => ({
          ruleType: "TRADE_EXIT_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: name,
          funcArgs: args,
          argDesc: adesc,
        })),
      }),

      ...(portfolioSizing?.selectedPortfolio && {
        psizingRule: {
          ruleType: "TRADE_PSIZING_RULE",
          ruleSubType: "LIB_FUNC_RULE",
          funcName: portfolioSizing?.selectedPortfolio || "",
          funcArgs: portfolioSizing?.args || [],
          argDesc: portfolioSizing?.adesc || [],
        },
      }),
    };

    const duplicateStrategy = {
      name: strategyName,
      version: versionName || "v1",
      description: descriptionName || "",
      strategy: {
        exchange: formatStrategyData?.strategy?.exchange || "",
        name: strategyName || "",
        initialCapital: formatStrategyData?.strategy?.initialCapital || 0,
        portfolioRisk: formatStrategyData?.strategy?.portfolioRisk || 0,
        maxInvestmentPerTrade:
          formatStrategyData?.strategy?.maxInvestmentPerTrade || 0,
        minInvestmentPerTrade:
          formatStrategyData?.strategy?.minInvestmentPerTrade || 0,

        zeroDate: formatStrategyData?.strategy?.zeroDate || "",
        nDate: formatStrategyData?.strategy?.ndate || "",

        filterRule: (formatStrategyData?.strategy?.filterRule || []).map(
          (rule) => ({
            ruleType: rule.ruleType,
            ruleSubType: rule.ruleSubType,
            funcName: rule.funcName,
            funcArgs: rule.funcArgs || [],
            argDesc: rule.argDesc || [],
          })
        ),

        orderRule: (formatStrategyData?.strategy?.orderRule || []).map(
          (rule) => ({
            ruleType: rule.ruleType,
            ruleSubType: rule.ruleSubType,
            funcName: rule.funcName,
            predefRule: rule.predefRule || "",
            funcArgs: rule.funcArgs || [],
            argDesc: rule.argDesc || [],
          })
        ),

        tradeRule: formatStrategyData?.strategy?.tradeRule
          ? {
              ruleType: "TRADE_STRATEGY_RULE",
              ruleSubType: "LIB_FUNC_RULE",
              funcName: formatStrategyData.strategy.tradeRule?.funcName,
              funcArgs: formatStrategyData.strategy.tradeRule?.funcArgs || [],
              argDesc: formatStrategyData.strategy.tradeRule?.argDesc || [],
            }
          : null,

        ...(formatStrategyData?.strategy?.globalEntryRule?.funcName && {
          globalEntryRule: {
            symbol: "nifty",
            ruleType: "TRADE_GLOBAL_ENTRY_RULE",
            ruleSubType: "LIB_FUNC_RULE",
            funcName: formatStrategyData.strategy?.globalEntryRule.funcName,
            funcArgs:
              formatStrategyData.strategy?.globalEntryRule.funcArgs || [],
            argDesc: formatStrategyData.strategy?.globalEntryRule.argDesc || [],
          },
        }),

        ...(formatStrategyData?.strategy?.globalExitRule?.funcName && {
          globalExitRule: {
            symbol: "nifty",
            ruleType: "TRADE_GLOBAL_EXIT_RULE",
            ruleSubType: "LIB_FUNC_RULE",
            funcName: formatStrategyData.strategy?.globalExitRule.funcName,
            funcArgs:
              formatStrategyData.strategy?.globalExitRule.funcArgs || [],
            argDesc: formatStrategyData.strategy?.globalExitRule.argDesc || [],
          },
        }),
        entryRule: (formatStrategyData?.strategy?.entryRule || []).map(
          (rule) => ({
            ruleType: rule.ruleType,
            ruleSubType: rule.ruleSubType,
            predefRule: rule.predefRule || "",
            funcName: rule.funcName,
            funcArgs: rule.funcArgs || [],
            argDesc: rule.argDesc || [],
          })
        ),

        exitRule: (formatStrategyData?.strategy?.exitRule || []).map(
          (rule) => ({
            ruleType: rule.ruleType,
            ruleSubType: rule.ruleSubType,
            predefRule: rule.predefRule || "",
            funcName: rule.funcName,
            funcArgs: rule.funcArgs || [],
            argDesc: rule.argDesc || [],
          })
        ),

        underlyingRule: formatStrategyData?.strategy?.underlyingRule
          ? {
              ruleType: formatStrategyData.strategy.underlyingRule.ruleType,
              ruleSubType:
                formatStrategyData.strategy.underlyingRule.ruleSubType,
              predefRule:
                formatStrategyData.strategy.underlyingRule.predefRule || "",
            }
          : null,

        psizingRule: formatStrategyData?.strategy?.psizingRule
          ? {
              ruleType: formatStrategyData.strategy.psizingRule.ruleType,
              ruleSubType: formatStrategyData.strategy.psizingRule.ruleSubType,
              funcName: formatStrategyData.strategy.psizingRule.funcName || "",
              funcArgs: formatStrategyData.strategy.psizingRule.funcArgs || [],
              argDesc: formatStrategyData.strategy.psizingRule.argDesc || [],
            }
          : null,
      },
    };
    const newEntry = {
      name: strategyName,
      isDemo: false,
      version: versionName || "v1",
      description: descriptionName,
      ...(id && !isDuplicate && { id: values.id }),
      strategy,
    };

    try {
      setIsDirty(false);
      if (defaultVersion !== versionName) {
        await createStock({
          endpoint: `strategystore/save`,
          payload: isDuplicate ? duplicateStrategy : newEntry,
          tags: [tagTypes.STRATEGY],
        }).unwrap();
      } else if (id && !isDuplicate) {
        await editStock({
          endpoint: `strategystore/update`,
          payload: newEntry,
          tags: [tagTypes.STRATEGY],
        }).unwrap();
      } else {
        await createStock({
          endpoint: `strategystore/save`,
          payload: isDuplicate ? duplicateStrategy : newEntry,
          tags: [tagTypes.STRATEGY],
        }).unwrap();
      }
      {
        isDuplicate && fetchAllData();
      }
      setSuccessModalOpen(true);
      handleClose();
      localStorage.removeItem("stockFilters");
      localStorage.removeItem("marketEntryExit.entry");
      localStorage.removeItem("marketEntryExit.exit");
      localStorage.removeItem("tradeRules.buyRule");
      localStorage.removeItem("stockEntry");
      localStorage.removeItem("stockExit");
      localStorage.removeItem("portfolioSizing-saved");
      localStorage.removeItem("tradeSequence");

      setTimeout(() => {
        navigate("/Strategies");
      }, 2000);
    } catch (error) {
      console.error("❌ Save failed:", error);
    }
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    // if (!canSave) return;
    try {
      await setFieldValue("name", strategyName);
      await setFieldValue("description", descriptionName);

      await setFieldTouched("name", true, true);
      await setFieldTouched("description", true, true);

      // ✅ If demo or duplicate, skip rest and save
      // if (demoStrategy || isDuplicate) {
      //   await handleSave();
      //   return;
      // }
      if (canSave) {
        await handleSave();
      }
      // await handleSave(); // Save if both required fields are non-empty
    } catch (error) {
      console.error("Error in handleButtonClick:", error);
      // Optional: show user-friendly error (toast/snackbar)
    }
  };

  return (
    <>
      <SuccessModal
        isOpen={successModalOpen}
        handleClose={() => setSuccessModalOpen(false)}
        title={
          hasAllValues(values)
            ? "Strategy Saved"
            : id
            ? "Update Strategy"
            : "Draft Strategy Saved"
        }
        description={
          hasAllValues(values)
            ? "Your strategy has been successfully saved and is ready for use"
            : id
            ? "Your strategy has been successfully updated"
            : "Your strategy draft has been saved. It is not ready to use until it is complete."
        }
        name={strategyName}
        version={versionName}
      />
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="space-y-4 !p-[30px]">
          <Box display="flex" flexDirection="column" sx={{ gap: "14px" }}>
            <Typography
              className="subheader"
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#0A0A0A",
              }}
            >
              {title}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#0A0A0A",
                }}
              >
                Name
              </label>
              <TextField
                fullWidth
                name="name"
                value={strategyName}
                onChange={(e) => {
                  const value = e.target.value;
                  setStrategyName(value);
                  setFieldTouched("name", true, true); // ensure it's touched
                  setFieldValue("name", value, true); // update value in formik for live validation
                }}
                error={touched?.name && Boolean(errors?.name)}
                helperText={touched?.name && errors?.name}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#0A0A0A",
                }}
              >
                Description
              </label>
              <TextField
                fullWidth
                name="description"
                value={descriptionName}
                onChange={(e) => {
                  const value = e.target.value;
                  setDescriptionName(value);
                  setFieldTouched("description", true, true);
                  setFieldValue("description", value, true);
                }}
                error={touched?.description && Boolean(errors?.description)}
                helperText={touched?.description && errors?.description}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  color: "#0A0A0A",
                }}
              >
                Version
              </label>
              <TextField
                fullWidth
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
              />
            </Box>
          </Box>

          <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-sm:flex-col">
            <ModalButton
              variant="secondary"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </ModalButton>
            <ModalButton
              variant="primary"
              type="button"
              // disabled={!canSave}
              onClick={handleButtonClick}
            >
              {buttonText}
            </ModalButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomizedDialogs;
