import { useEffect, useState } from "react";
import * as _ from "lodash";
import { Box, Tooltip, Typography } from "@mui/material";

import CancelStrategyModal from "../Modal/CancelStrategyModal";
import CustomizedDialogs from "../Modal/DuplicateStrategyModal";

import HeaderButton from "../../../common/Table/HeaderButton";
import Badge from "../../../common/Badge";
import { CREATE_STRATEGY_BTN_TOOLTIP } from "../../../../constants/CommonText";
import WarningPopupModal from "./WarningPopupModal";

const CreateStrategyHeader = ({
  onNext,
  step,
  formik,
  id,
  strategyName,
  setIsDirty = () => {},
}) => {
  const [isCancelStrategy, setIsCancelStrategy] = useState(false);
  const [isOpenSaveDraft, setIsOpenSaveDraft] = useState(false);
  const [saveActionType, setSaveActionType] = useState("draft"); // 'draft' | 'create'
  const [isWarning, setIsWarning] = useState(false);

  const { values } = formik;

  const hasAllValues = (obj) => {
    const stockBundleValid =
      Array.isArray(obj.stockBundle) &&
      obj.stockBundle.every((item) => !_.isEmpty(item?.name));

    const tradeRuleValid = !_.isEmpty(obj?.tradeRules?.buyRule?.ruleName);

    const p = obj.portfolioSizing || {};
    const portfolioValid =
      !_.isEmpty(p.selectedPortfolio) &&
      !_.isEmpty(p.portfolioRisk) &&
      !_.isEmpty(p.maxInvestment) &&
      !_.isEmpty(p.minInvestment);

    return stockBundleValid && tradeRuleValid && portfolioValid;
  };

  const handleSaveStrategy = () => {
    if (step === 5) {
      setIsOpenSaveDraft(true);
    } else {
      onNext();
    }
  };

  return (
    <>
      {/* Cancel Modal */}
      <CancelStrategyModal
        isOpen={isCancelStrategy}
        handleClose={() => setIsCancelStrategy(false)}
        isCancel
      />
      {isWarning && (
        <WarningPopupModal
          isOpen={isWarning}
          handleClose={() => {
            setIsWarning(false);
          }}
          title="Create New Strategy"
          name="Strategy"
          description="Do you want to create a new strategy?"
        />
      )}

      {/* Save/Update Dialog */}
      {isOpenSaveDraft && (
        <CustomizedDialogs
          formik={formik}
          title={
            saveActionType === "create"
              ? "Save Strategy"
              : id
              ? "Update Strategy"
              : "Save as Draft"
          }
          textButton={
            saveActionType === "create"
              ? "Save"
              : id
              ? "Update"
              : "Save as Draft"
          }
          isOpen={isOpenSaveDraft}
          handleClose={() => setIsOpenSaveDraft(false)}
          id={strategyName}
          step
          onSave={handleSaveStrategy}
        />
      )}

      {/* Header UI */}
      <Box className="flex flex-col md:flex-row flex-wrap gap-4 sm:gap-6 md:gap-10 w-full justify-between p-4">
        <Box className="flex gap-2.5 items-center text-center md:text-left">
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              color: "#0A0A0A",
            }}
          >
            {id ? `${strategyName}` : "Create Strategy"}
          </Typography>
          {id && <Badge variant="version">{values?.version}</Badge>}
        </Box>

        {/* Action Buttons */}
        <nav className="flex flex-col md:flex-row gap-3 text-sm font-medium text-blue-600 w-full md:w-auto">
          <HeaderButton
            variant="primary"
            onClick={() => setIsCancelStrategy(true)}
          >
            Cancel
          </HeaderButton>

          {id ? (
            <HeaderButton
              variant="primary"
              onClick={() => {
                setIsDirty(false);
                setSaveActionType("create");
                setIsOpenSaveDraft(true);
              }}
            >
              {"Update"}
            </HeaderButton>
          ) : (
            <HeaderButton
              variant="primary"
              onClick={() => {
                setIsDirty(false);
                setSaveActionType(!hasAllValues(values) ? "draft" : "create");
                setIsOpenSaveDraft(true);
              }}
            >
              {!hasAllValues(values) ? "Save as Draft" : "Save"}
            </HeaderButton>
          )}

          {id ? (
            <HeaderButton
              variant="contained"
              onClick={() => {
                setSaveActionType("create");
                handleSaveStrategy();
              }}
            >
              Next
            </HeaderButton>
          ) : (
            <Tooltip
              title={
                step === 5 && !hasAllValues(values) && step === 5
                  ? CREATE_STRATEGY_BTN_TOOLTIP
                  : ""
              }
              disableHoverListener={
                !(step === 5 && !hasAllValues(values)) || !step === 5
              }
              componentsProps={{
                tooltip: {
                  sx: {
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                    boxShadow: "0px 8px 16px 0px #7B7F8229",
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "0%",
                  },
                },
              }}
              placement="bottom-start"
            >
              <span>
                <HeaderButton
                  variant="contained"
                  className="!w-full"
                  disabled={step === 5 && !hasAllValues(values)}
                  onClick={() => {
                    setIsDirty(false);
                    setSaveActionType("create");
                    handleSaveStrategy();
                  }}
                >
                  {step === 5 ? "Create Strategy" : "Next"}
                </HeaderButton>
              </span>
            </Tooltip>
          )}
        </nav>
      </Box>
    </>
  );
};

export default CreateStrategyHeader;
