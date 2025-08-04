import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Divider, Grid } from "@mui/material";
import * as Yup from "yup";

import useLabTitle from "../../../hooks/useLabTitle";
import StockBundleStep from "./StockBundleStep";
import TradeRule from "../TradeRule/TradeRule";
import MarketEntryExit from "../MarketEntryExit/MarketEntryExit";
import TimeLineStock from "./TimeLineStock";
import StockEntryExit from "../StockEntryExit/StockEntryExit";
import TraderSequence from "../TraderSequence/TraderSequence";
import PortfolioSizing from "../PortfolioSizing/PortfolioSizing";
import CreateStrategyHeader from "./CreateStrategyHeader";
import { useRouterBlocker } from "../../../hooks/useRouterBlocker";
import WarningPopupModal from "./WarningPopupModal";
import { useLazyGetQuery } from "../../../../slices/api";

const CreateStrategy = () => {
  useLabTitle("Create Strategies");
  const [getAdvanceConfig] = useLazyGetQuery();

  const [advancePortfolioSizeConfig, setAdvancePortfolioSizeConfig] = useState({
    booleanParams: [],
    textParams: [],
    desc: {},
  });
  const [step, setStep] = useState(0); // Start from step 0
  const [isDirty, setIsDirty] = useState(false);

  const { showPrompt, confirmNavigation, cancelNavigation } = useRouterBlocker({
    when: isDirty,
  });

  const transformConfig = (input) => {
    const booleanParams = Object.keys(input.configBoolParm || {});
    const textParams = Object.keys(input.configTextParm || {});

    const desc = {
      ...input.configTextParm,
      ...input.configBoolParm,
    };

    return {
      booleanParams,
      textParams,
      desc,
    };
  };

  const advanceBooleanDefaults =
    advancePortfolioSizeConfig.booleanParams.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

  const advanceTextDefaults = advancePortfolioSizeConfig.textParams.reduce(
    (acc, key) => {
      acc[key] = "";
      return acc;
    },
    {}
  );

  useEffect(() => {
    try {
      (async () => {
        const { data } = await getAdvanceConfig({
          endpoint: `command/backtest/configparm `,
        }).unwrap();
        const transformedData = transformConfig(data);
        // console.log("data", transformedData);

        setAdvancePortfolioSizeConfig(transformedData);
      })();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const validationByStep = [
    {
      stockBundle: Yup.array(
        Yup.object().shape({
          name: Yup.string().required("Stock Filter is required"),
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
          shortFuncValue: "",
          adesc: [],
          args: [],
        },
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
        entry: [{ name: "", adesc: [], args: [], shortFuncValue: "" }],
        exit: [
          {
            name: "",
            adesc: [],
            args: [],
            shortFuncValue: "",
          },
        ],
      },

      tradeSequence: [{ name: "", adesc: [], args: [] }],

      portfolioSizing: {
        selectedPortfolio: "",
        portfolioRisk: "",
        maxInvestment: "",
        minInvestment: "",
        advanceConfig: {
          booleanParams: advanceBooleanDefaults,
          textParams: advanceTextDefaults,
        },
      },
    },
    enableReinitialize: true,
    validationSchema: stratezyFormValidations,
    onSubmit: () => {
      // handleCreateStrategy(values);
    },
  });

  const steps = [
    StockBundleStep,
    TradeRule,
    MarketEntryExit,
    StockEntryExit,
    TraderSequence,
    PortfolioSizing,
  ];

  const cleanAndSet = (fieldPath, storageKey) => {
    const getValue = (obj, path) =>
      path.split(".").reduce((acc, key) => (acc ? acc[key] : []), obj);

    const currentValues = getValue(formik.values, fieldPath) || [];

    let cleaned;

    if (currentValues[0]?.name?.trim() === "") {
      // Leave the entire structure untouched
      cleaned = currentValues;
    } else {
      // Remove index 0 and filter out empty names
      cleaned = currentValues
        // .slice(1)
        .filter((item) => item.name && item.name.trim() !== "");
    }

    formik.setFieldValue(fieldPath, cleaned);
    localStorage.setItem(storageKey, JSON.stringify(cleaned));
  };

  const goNext = () => {
    cleanAndSet("stockBundle", "stockFilters");
    cleanAndSet("stockEntryExit.entry", "stockEntry");
    cleanAndSet("stockEntryExit.exit", "stockExit");
    cleanAndSet("tradeSequence", "tradeSequence");
    // Then move to the next step
    if (step < steps.length - 1) setStep(step + 1);
  };

  const goBack = () => {
    cleanAndSet("stockBundle", "stockFilters");
    cleanAndSet("stockEntryExit.entry", "stockEntry");
    cleanAndSet("stockEntryExit.exit", "stockExit");
    cleanAndSet("tradeSequence", "tradeSequence");
    if (step > 0) setStep(step - 1);
  };

  const CurrentStepComponent = steps[step];

  const goToStep = (index) => {
    cleanAndSet("stockBundle", "stockFilters");
    cleanAndSet("stockEntryExit.entry", "stockEntry");
    cleanAndSet("stockEntryExit.exit", "stockExit");
    cleanAndSet("tradeSequence", "tradeSequence");

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

      <div className="sm:h-[calc(100vh-100px)]  overflow-auto p-8">
        <div className="bg-white border border-[#E0E1E4] h-full">
          <CreateStrategyHeader
            onNext={goNext}
            onBack={goBack}
            step={step}
            formik={formik}
            setIsDirty={setIsDirty}
            confirmNavigation={confirmNavigation}
          />

          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />

          <Grid
            container
            spacing={2}
            className="w-full  h-[calc(100%-76px)] overflow-auto px-4"
          >
            <Grid
              className="p-5 md:border-r md:border-r-zinc-200"
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <TimeLineStock
                isView
                values={formik.values}
                step={step}
                goToStep={goToStep}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              <CurrentStepComponent
                setIsDirty={setIsDirty}
                formik={formik}
                advancePortfolioSizeConfig={advancePortfolioSizeConfig}
              />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default CreateStrategy;
