import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Grid, Divider } from "@mui/material";
import * as Yup from "yup";

import StockBundleStep from "../CreateStratezy/StockBundleStep";
import TradeRule from "../TradeRule/TradeRule";
import MarketEntryExit from "../MarketEntryExit/MarketEntryExit";
import StockEntryExit from "../StockEntryExit/StockEntryExit";
import TraderSequence from "../TraderSequence/TraderSequence";
import PortfolioSizing from "../PortfolioSizing/PortfolioSizing";

import TimeLineStock from "../CreateStratezy/TimeLineStock";
import CreateStrategyHeader from "../CreateStratezy/CreateStrategyHeader";
import useLabTitle from "../../../hooks/useLabTitle";
import { useDeleteMutation, useLazyGetQuery } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";
import NavigationTabs from "../ViewStrategy/NavigationTabs";
import StrategyHeader from "../ViewStrategy/StrategyHeader";
import ViewOtherVersion from "../ViewStrategy/ViewModal/ViewOtherVersion";
import ViewBacktestResult from "../ViewStrategy/ViewModal/ViewBacktestResult";
import { useDispatch } from "react-redux";
import { setBacktestData } from "../../../../slices/page/reducer";
import WarningPopupModal from "../CreateStratezy/WarningPopupModal";
import { useRouterBlocker } from "../../../hooks/useRouterBlocker";

const EditStrategy = () => {
  useLabTitle("Edit Strategy");

  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategyName = queryParams.get("name");
  const id = queryParams.get("id");
  const view = queryParams.get("action");
  const defaultVersion = queryParams.get("version");
  const runBacktest = queryParams.get("runbacktest");
  const demoStrategy = queryParams.get("demo");
  const dispatch = useDispatch();

  const [getStrategyData] = useLazyGetQuery();
  const [getBackTestData] = useLazyGetQuery();
  const [getVersionData] = useLazyGetQuery();
  const [deleteBacktest] = useLazyGetQuery();
  const [deleteData, { isLoading: isDeleting }] = useDeleteMutation();

  const [filterData, setFilterData] = useState({});
  const [rows, setRows] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [step, setStep] = useState(0);
  const [version, setVersion] = useState([]);
  const [isDeleteCase, setIsDeleteCase] = useState(false);
  const [deleteRow, setDeleteRow] = useState({});

  const [isDelete, setIsDelete] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeployCreate, setIsDeployCreate] = useState(false);
  const [deployName, setDeployName] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const { showPrompt, confirmNavigation, cancelNavigation } = useRouterBlocker({
    when: isDirty,
  });
  const title =
    tabIndex === 0
      ? "View Strategy"
      : tabIndex === 1
      ? "Backtests"
      : "Other Versions";

  useLabTitle(title);

  const handleLocation = async (version) => {
    const endpointApi =
      demoStrategy === "true"
        ? `strategystore/get/name/${strategyName}?demo=true&version=${defaultVersion}`
        : `strategystore/get/name/${strategyName}?version=${version}`;
    try {
      const { data } = await getStrategyData({
        endpoint: endpointApi,
        tags: [tagTypes.GET_ALLDATA],
      }).unwrap();

      setFilterData(data);
      setSelectedVersion(data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleVersionData = async (versionInput) => {
    const resolvedVersion = versionInput || defaultVersion;

    const baseUrl = `strategystore/getall?name=${strategyName}`;

    const endpoint = `${baseUrl}`;

    try {
      const { data } = await getVersionData({
        endpoint,
        tags: [tagTypes.GET_VERSION],
      }).unwrap();

      const filterData = data.filter(
        ({ version }) => version !== resolvedVersion
      );
      setVersion(filterData);
    } catch (error) {
      console.error("Failed to fetch version data:", error);
    }
  };

  const handleViewData = async (versionInput) => {
    const resolvedVersion = versionInput || defaultVersion;

    const baseUrl = `command/backtest/findall?name=${strategyName}`;
    const versionParam =
      resolvedVersion === "All Versions" ? "" : `&version=${resolvedVersion}`;
    const endpoint = `${baseUrl}${versionParam}`;
    try {
      const { data } = await getBackTestData({
        endpoint,
        tags: [tagTypes.BACKTEST],
      }).unwrap();
      setRows(data);
      dispatch(setBacktestData({ data }));
    } catch (error) {
      console.error("Failed to fetch backtest data:", error);
    }
  };

  useEffect(() => {
    if (defaultVersion) {
      handleVersionData(defaultVersion);
      handleViewData(defaultVersion);
      handleLocation(defaultVersion);
    }
  }, [defaultVersion]);

  useEffect(() => {
    if (strategyName && !selectedVersion) {
      handleLocation(defaultVersion);
    }
  }, [strategyName, demoStrategy, tabIndex]);

  useEffect(() => {
    if (view) {
      handleViewData();
    }
  }, [view]);

  const handleTabChange = (event, newIndex) => {
    if (selectedVersion === "All Versions" && newIndex === 0) return;
    setTabIndex(newIndex);
  };

  const handleVersionChange = async (version) => {
    setSelectedVersion(version);
    handleVersionData(version);
    handleViewData(version);
    if (version !== "All Versions") {
      handleLocation(version);
    }
    if (version === "All Versions" && tabIndex === 0) {
      setTabIndex(2); // Jump to "Other Versions"
    }
  };

  const handleDelete = async () => {
    try {
      await deleteData({
        endpoint: `strategystore/delete?name=${deleteRow.name}&version=${deleteRow.version}`,
        tags: [tagTypes.GET_STRATEGY, tagTypes.GET_VERSION],
      }).unwrap();
    } catch (error) {
    } finally {
      handleVersionData(defaultVersion), setIsDeleteCase(false);
    }
  };
  const confirmDelete = async () => {
    try {
      await deleteBacktest({
        endpoint: `command/backtest/delete/${rowToDelete}`,
        tags: [tagTypes.BACKTEST],
      }).unwrap();
      setIsDelete(false);
      handleViewData(defaultVersion), setIsDelete(false);
      // fetchAllData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const validationByStep = [
    {
      stockBundle: Yup.array(
        Yup.object().shape({
          name: Yup.string().required("Stock bundle name is required"),
        })
      ),
    },
    {
      tradeRules: Yup.object().shape({
        buyRule: Yup.object().shape({
          ruleName: Yup.string().required("Rule name is required"),
        }),
      }),
    },
    {},
    {},
    {},
    {
      portfolioSizing: Yup.object().shape({
        selectedPortfolio: Yup.string().required(
          "Please select portfolio sizing"
        ),
        portfolioRisk: Yup.number()
          .typeError("Portfolio risk must be a number")
          .min(0, "Portfolio risk must be a number between 0 and 1")
          .max(1, "Portfolio risk must be a number between 0 and 1")
          .required("Portfolio risk is required"),
        maxInvestment: Yup.number()
          .typeError("Max investment per trade must be a number")
          .min(0, "Max investment per trade must be a number between 0 and 1")
          .max(1, "Max investment per trade must be a number between 0 and 1")
          .required("Max investment per trade is required"),
        minInvestment: Yup.number()
          .typeError("Min investment per trade must be a number")
          .min(
            0.0001,
            "Min investment per trade must be a number between 0 and 1"
          )
          .max(0.5, "Min investment per trade must be a number between 0 and 1")
          .required("Min investment per trade risk is required"),
      }),
    },
  ];
  const commonValidation = {
    name: Yup.string().required("Strategy name is required"),
    description: Yup.string().required("Description is required"),
  };
  const stratezyFormValidations = Yup.object().shape({
    ...commonValidation,
    ...validationByStep[step],
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      version: "",
      createdOn: "",
      status: "",
      summary: "",
      isDemo: false,

      stockBundle: [
        {
          name: "",
          type: "",
          shortFuncValue: "",
          adesc: [],
          args: [],
        },
      ],

      tradeRules: {
        buyRule: {
          ruleName: "",
        },
        // sellRule: {
        //   ruleName: "",
        // },
      },

      marketEntryExit: {
        entry: {
          name: "",
          adesc: [],
          args: [],
        },
        exit: {
          name: "",
          adesc: [],
          args: [],
        },
      },

      stockEntryExit: {
        entry: [{ name: "", adesc: [], args: [] }],
        exit: [
          {
            name: "",
            adesc: [],
            args: [],
          },
        ],
      },

      tradeSequence: [{ name: "", adesc: [], args: [] }],

      portfolioSizing: {
        selectedPortfolio: "",
        portfolioRisk: "",
        maxInvestment: "",
        minInvestment: "",
      },
    },
    enableReinitialize: true,
    validationSchema: stratezyFormValidations,
    onSubmit: (values) => {
      // handleCreateStrategy(values);
    },
  });

  useEffect(() => {
    const strategy = filterData?.strategy;

    formik.setValues({
      name: filterData?.name || "",
      description: strategy?.description || "",
      summary: filterData?.summary || "",
      isDemo: filterData?.demo || false,
      version: filterData?.version || "v1",

      stockBundle:
        strategy?.filterRule?.length > 0
          ? strategy?.filterRule?.map(({ funcName, funcArgs, argDesc }) => ({
              name: funcName,
              adesc: argDesc || [],
              args: funcArgs || [],
              shortFuncValue: "",
            }))
          : [
              {
                name: "",
                type: "",
                adesc: [],
                args: [],
                shortFuncValue: "",
              },
            ],
      tradeRules: {
        buyRule: {
          ruleName: strategy?.tradeRule?.funcName || "",
          args: strategy?.tradeRule?.funcArgs || [],
          adesc: strategy?.tradeRule?.argDesc || [],
        },
        sellRule: {
          ruleName: strategy?.orderRule?.[0]?.predefRule || "",
        },
      },

      marketEntryExit: {
        entry: {
          name: strategy?.globalEntryRule?.funcName || "",
          args: strategy?.globalEntryRule?.funcArgs || [],
          adesc: strategy?.globalEntryRule?.argDesc || [],
        },
        exit: {
          name: strategy?.globalExitRule?.funcName || "",
          args: strategy?.globalExitRule?.funcArgs || [],
          adesc: strategy?.globalExitRule?.argDesc || [],
        },
      },

      stockEntryExit: {
        entry:
          strategy?.entryRule?.length > 0
            ? strategy?.entryRule?.map(({ funcName, funcArgs, argDesc }) => ({
                name: funcName,
                adesc: argDesc || [],
                args: funcArgs || [],
              }))
            : [
                {
                  name: "",
                  adesc: [],
                  args: [],
                },
              ],

        exit:
          strategy?.exitRule?.length > 0
            ? strategy?.exitRule?.map(({ funcName, funcArgs, argDesc }) => ({
                name: funcName,
                adesc: argDesc || [],
                args: funcArgs || [],
              }))
            : [{ name: "", adesc: [], args: [] }],
      },

      tradeSequence:
        strategy?.orderRule?.length > 0
          ? strategy.orderRule
              .filter(
                ({ funcName, predefRule }) =>
                  (funcName && funcName.trim() !== "") ||
                  (predefRule && predefRule.trim() !== "")
              )
              .map(({ predefRule, argDesc, funcArgs, funcName }) => ({
                name: funcName || "", // fallback to empty string if null
                predefRule: predefRule || "",
                args: funcArgs || [],
                adesc: argDesc || [],
              }))
          : [
              {
                name: "",
                predefRule: "",
                adesc: [],
                args: [],
              },
            ],

      portfolioSizing: {
        selectedPortfolio: strategy?.psizingRule?.funcName || "",
        args: strategy?.psizingRule?.funcArgs || [],
        adesc: strategy?.psizingRule?.argDesc || [],
        portfolioRisk: strategy?.portfolioRisk || 0,
        maxInvestment: strategy?.maxInvestmentPerTrade || 0,
        minInvestment: strategy?.minInvestmentPerTrade || 0,
      },
    });
  }, [filterData]);

  const steps = [
    StockBundleStep,
    TradeRule,
    MarketEntryExit,
    StockEntryExit,
    TraderSequence,
    PortfolioSizing,
  ];

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const CurrentStepComponent = steps[step];

  const goToStep = (index) => {
    setStep(index);
  };
  return (
    <>
      {showPrompt && (
        <WarningPopupModal
          isOpen={showPrompt}
          handleClose={cancelNavigation}
          title="Unsaved Changes"
          description="You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost if you don’t save them."
          buttonText="Yes"
          handleConfirm={confirmNavigation}
        />
      )}

      <div className="sm:h-[calc(100vh-87px)]  overflow-auto p-8">
        <div className="bg-white border border-[#E0E1E4] h-full">
          {view ? (
            <StrategyHeader
              state={state}
              strategyName={strategyName}
              onVersionChange={handleVersionChange}
              runBacktest={runBacktest}
              formik={formik}
              defaultVersion={defaultVersion}
              id={id}
              filterData={filterData}
              demoStrategy={demoStrategy}
              disableDeploy={!rows.length}
              version={version}
              setIsDirty={setIsDirty}
            />
          ) : (
            <>
              <CreateStrategyHeader
                onNext={goNext}
                onBack={goBack}
                step={step}
                formik={formik}
                strategyName={strategyName}
                id={id}
                setIsDirty={setIsDirty}
              />
              <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
            </>
          )}

          {view && (
            <>
              <NavigationTabs
                tabs={["Definition", "Backtests", "Other Versions"]}
                value={tabIndex}
                onChange={handleTabChange}
                selectedVersion={selectedVersion}
              />
              <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
            </>
          )}

          {(tabIndex === 0 || !view) && (
            <Grid
              container
              spacing={2}
              className="w-full h-[calc(100%-201px)] overflow-auto px-4"
            >
              <Grid
                className="md:border-r md:border-r-zinc-200"
                item
                size={{ xs: 12, md: 6, lg: 4 }}
              >
                <TimeLineStock
                  isView={view}
                  values={formik.values}
                  step={step}
                  goToStep={goToStep}
                />
              </Grid>

              <Grid
                item
                size={{
                  xs: 12,
                  md: 6,
                  lg: 8,
                }}
              >
                {view ? (
                  <CurrentStepComponent
                    formik={formik}
                    id={id}
                    isView={demoStrategy === "true"}
                    setIsDirty={setIsDirty}
                  />
                ) : (
                  <CurrentStepComponent
                    formik={formik}
                    id={id}
                    setIsDirty={setIsDirty}
                  />
                )}
              </Grid>
            </Grid>
          )}

          {view && tabIndex === 1 && (
            <div className="p-8 space-y-4">
              <ViewBacktestResult
                rows={rows}
                setTabIndex={setTabIndex}
                setIsDelete={setIsDelete}
                isDelete={isDelete}
                setRowToDelete={setRowToDelete}
                setIsDeployCreate={setIsDeployCreate}
                setDeployName={setDeployName}
                confirmDelete={confirmDelete}
                isDeployCreate={isDeployCreate}
                deployName={deployName}
              />
            </div>
          )}

          {view && tabIndex === 2 && (
            <div className="p-8 space-y-4">
              <ViewOtherVersion
                setTabIndex={setTabIndex}
                selectedVersion={version}
                setDeleteRow={setDeleteRow}
                setIsDeleteCase={setIsDeleteCase}
                deleteRow={deleteRow}
                isDeleteCase={isDeleteCase}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditStrategy;
