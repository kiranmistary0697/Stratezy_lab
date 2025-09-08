import { useEffect, useState } from "react";
import { Box, Button, Popover, Tooltip } from "@mui/material";
import Badge from "./Badge";
import { DropdownIcon } from "./Icons";
import RunBacktest from "../Modal/RunBacktest";
import HeaderButton from "../../../common/Table/HeaderButton";
import CreateDeploy from "../../Deploy/DeployModal/CreateDeploy";
import SuccessModal from "../../../common/SuccessModal";
import CustomizedDialogs from "../Modal/DuplicateStrategyModal";
import _ from "lodash";
import { STRATEGY_DEPLOY_BTN_TOOLTIP } from "../../../../constants/CommonText";

const VersionDropdown = ({ anchorEl, onClose, onSelect, versionData }) => {
  const open = Boolean(anchorEl);
  const allVersionsData = [...versionData, "All Versions"];
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        className: "p-4 bg-white shadow-md rounded-md border border-gray-200",
      }}
    >
      <Box className="flex flex-col gap-2 items-start ">
        {allVersionsData.map((version) => (
          <Button
            key={version}
            onClick={() => {
              onSelect(version);
              onClose();
            }}
            className="justify-start text-gray-700 normal-case"
          >
            <Badge>{version}</Badge>
          </Button>
        ))}
      </Box>
    </Popover>
  );
};

const StrategyHeader = ({
  strategyName,
  onVersionChange,
  runBacktest,
  filterData,
  id,
  status,
  formik,
  defaultVersion,
  demoStrategy,
  disableDeploy,
  version,
  setIsDirty = () => {},
  handleViewData = () => {},
  versionList = [],
  tabIndex = 0,
  selectedVersion = "",
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenBacktest, setIsOpenBacktest] = useState(false);
  const [isOpenDeploy, setIsOpenDeploy] = useState(false);
  const [isOpenSaveDraft, setIsOpenSaveDraft] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const excludedKeys = [
    "id",
    "version",
    "createdOn",
    "status",
    "isDemo",
    "summary",
    "name",
    "description",
    // "tradeRules",
    "marketEntryExit",
    "stockEntryExit",
    "tradeSequence",
  ];

  const hasAllValues = (obj) => {
    return _.every(obj, (value, key) => {
      if (excludedKeys.includes(key)) return true;

      if (_.isArray(value)) {
        return (
          value.length > 0 &&
          value.every((item) => {
            return _.isObject(item) ? hasAllValues(item) : !_.isEmpty(item);
          })
        );
      }

      if (_.isObject(value)) {
        return hasAllValues(value);
      }

      return !_.isEmpty(value);
    });
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectVersion = (version) => {
    setAnchorEl(null);
    onVersionChange(version);
  };

  useEffect(() => {
    if (runBacktest === "true") {
      setIsOpenBacktest(true);
    }
  }, [runBacktest]);

  return (
    <>
      <CustomizedDialogs
        formik={formik}
        title={
          id
            ? "Update Strategy"
            : hasAllValues(!formik.values)
            ? "Save Strategy"
            : "Save as Draft"
        }
        textButton={"Update"}
        isOpen={isOpenSaveDraft}
        handleClose={() => setIsOpenSaveDraft(false)}
        id={strategyName}
        // step
        onSave={() => setIsOpenSaveDraft(true)}
        setIsDirty={setIsDirty}
        isNameDisabled={!!id}
        version={selectedVersion}
      />
      {successModalOpen && (
        <SuccessModal
          isOpen={successModalOpen}
          handleClose={() => setSuccessModalOpen(false)}
          title="Backtest Run"
          name={strategyName}
          description={"Your Backtest has been initiated"}
        />
      )}
      {isOpenBacktest && (
        <RunBacktest
          strategyName={strategyName}
          isOpen={isOpenBacktest}
          setSuccessModalOpen={() => setSuccessModalOpen(true)}
          handleClose={() => {
            setIsOpenBacktest(false), setSuccessModalOpen(false);
          }}
          title="Run Backtest"
          isNavigate={tabIndex === 0 ? true : false}
          status={status}
          defaultVersion={selectedVersion ?? defaultVersion}
          demoStrategy={demoStrategy}
          handleViewData={handleViewData}
        />
      )}

      {isOpenDeploy && (
        <CreateDeploy
          isOpen={isOpenDeploy}
          handleClose={() => setIsOpenDeploy(false)}
          title="Deploy Strategy"
          buttonText="Deploy Strategy"
          deployStrategy={{
            name: filterData?.name,
            reqId: filterData?.backtestSummaryRes?.requestId,
            version: filterData?.version,
          }}
          setSuccessModalOpen={setSuccessModalOpen}
        />
      )}
      <Box className="flex flex-col md:flex-row gap-6 md:gap-10 w-full justify-between p-4 md:items-start">
        <Box className="flex flex-col gap-1">
          <div className="flex gap-2.5 items-center">
            <div className="text-xl font-semibold leading-tight text-neutral-950">
              {strategyName}
            </div>
            <Button
              className="flex gap-2 items-center"
              onClick={handleDropdownClick}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
            >
              <Badge>{selectedVersion}</Badge>
              <DropdownIcon />
            </Button>

            <VersionDropdown
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              onSelect={handleSelectVersion}
              versionData={versionList}
            />
          </div>

          {/* Description below */}
          <div className="text-sm font-semibold leading-tight text-stone-500">
            {filterData?.description}
          </div>
        </Box>

        {/* Right Section: Action Buttons */}
        <nav className="flex flex-col md:flex-row gap-3 text-sm font-medium text-blue-600 w-full md:w-auto">
          <HeaderButton
            variant="primary"
            onClick={() => setIsOpenSaveDraft(true)}
            disabled={demoStrategy === "true"}
          >
            {id ? "Update" : "Save as Draft"}
          </HeaderButton>
          {selectedVersion !== "All Versions" && (
            <HeaderButton
              variant="primary"
              onClick={() => setIsOpenBacktest(true)}
            >
              Run Backtest
            </HeaderButton>
          )}
          <Tooltip
            title={disableDeploy ? STRATEGY_DEPLOY_BTN_TOOLTIP : ""}
            disableHoverListener={!disableDeploy}
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
                onClick={() => setIsOpenDeploy(true)}
                disabled={disableDeploy}
                className="w-full"
              >
                Deploy
              </HeaderButton>
            </span>
          </Tooltip>
        </nav>
      </Box>
    </>
  );
};

export default StrategyHeader;
