import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, FormGroup, TextField } from "@mui/material";

import moment from "moment";
import * as Yup from "yup";

import { tagTypes } from "../../../tagTypes";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";

import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";

import ModalButton from "../../../common/Table/ModalButton";
import CustomDatePicker from "../../../common/CustomDatePicker";

const RunBacktest = ({
  title,
  isOpen,
  handleClose = () => {},
  strategyName,
  setSuccessModalOpen = () => {},
  defaultVersion,
  demoStrategy,
  isNavigate = false,
  handleViewData = () => {},
}) => {
  const navigate = useNavigate();
  const [createBackTest] = usePostMutation();
  const [getStrategyData] = useLazyGetQuery();
  const [backtestData, setBacktestData] = useState({});
  const [loading, setLoading] = useState(false);

  const today = moment().format("DD/MM/YYYY");
  const oneMonth = moment().subtract(30, "days").format("DD/MM/YYYY");
  const handleStrategyName = async () => {
    try {
      const { data } = await getStrategyData({
        endpoint:
          demoStrategy === "true"
            ? `strategystore/get/name/${strategyName}?demo=true&version=${defaultVersion}`
            : `strategystore/get/name/${strategyName}?version=${defaultVersion}`,
        tags: [tagTypes.GET_ALLDATA],
      }).unwrap();

      setBacktestData(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (strategyName) handleStrategyName();
  }, [strategyName]);

  const validationSchema = Yup.object().shape({
    initialCapital: Yup.number()
      .required("Initial capital is required")
      .typeError("Initial capital must be number")
      .positive("Initial capital must be positive"),
  });

  const handleSubmit = async (values) => {
    const { initialCapital, startDate, endDate } = values;

    if (!backtestData?.strategy) return;

    const omitKeys = (obj, keysToOmit) =>
      Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keysToOmit.includes(key))
      );

    const baseStrategy = {
      ...backtestData,
      ...backtestData.strategy,
    };

    const cleanedStrategy = omitKeys(baseStrategy, [
      "id",
      "strategy",
      "groupRisk",
      // "maxPrincipalToAccountRatio",
      // "maxOpenTrades",
      // "priortizeOrder",
      "incrementalCapital",
      "timestamp",
      "customRule",
      "predefRuleArgs",
      // "ndate",
      "backtestSummaryRes",
    ]);

    const payload = {
      ...cleanedStrategy,
      version: defaultVersion || "v1",
      initialCapital: Number(initialCapital),
      backtestType: "BACKTEST_TYPE_FULL",
      zeroDate: moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      nDate: moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      // tradeExecutionDate: moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      exchange: "nse",
      underlyingRule: {
        ruleType: "TRADE_UNDERLYING_RULE",
        ruleSubType: "PREDEF_RULE",
        predefRule: "cash",
      },
    };
    setLoading(true);
    try {
      await createBackTest({
        endpoint:
          demoStrategy === "true"
            ? `command/backtest/requestdemo`
            : `command/backtest/request`,
        payload,
        tags: [tagTypes.BACKTEST],
      }).unwrap();

      setSuccessModalOpen();
      handleClose();
      {
        !isNavigate && handleViewData(defaultVersion);
      }

      {
        isNavigate && setTimeout(() => navigate("/Backtest"), 1000);
      }
    } catch (error) {
      console.error("Backtest error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        <Formik
          initialValues={{
            initialCapital: "",
            startDate: oneMonth,
            endDate: today,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleBlur }) => {
            return (
              <Form>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
                >
                  <div className="text-xl font-semibold  leading-tight text-neutral-950">
                    {title}
                  </div>

                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <label className="text-sm font-semibold text-neutral-950">
                      Initial Capital
                    </label>
                    <Field
                      as={TextField}
                      name="initialCapital"
                      size="small"
                      fullWidth
                    />
                    <ErrorMessage
                      name="initialCapital"
                      component="div"
                      style={{ color: "red", fontSize: "12px" }}
                    />
                  </FormGroup>

                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <label className="text-sm font-semibold text-neutral-950">
                      Start Date
                    </label>
                    <CustomDatePicker
                      label="Start Date"
                      value={values.startDate}
                      onChange={(val) => setFieldValue("startDate", val)}
                      onBlur={handleBlur}
                      name="startDate"
                    />
                    {/* {touched?.startDate && !!errors?.startDate && (
                      <FormHelperText error>{errors?.startDate}</FormHelperText>
                    )} */}
                  </FormGroup>

                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <label className="text-sm font-semibold text-neutral-950">
                      End Date
                    </label>
                    <CustomDatePicker
                      label="End Date"
                      value={values.endDate}
                      onChange={(val) => setFieldValue("endDate", val)}
                      minDate={moment(values.startDate, "DD/MM/YYYY")
                        .add(1, "day")
                        .format("DD/MM/YYYY")}
                      onBlur={handleBlur}
                      name="endDate"
                    />

                    {/* {touched?.endDate && !!errors?.endDate && (
                      <FormHelperText error>{errors?.endDate}</FormHelperText>
                    )} */}
                  </FormGroup>

                  <div className="flex gap-5 justify-center items-center w-full  max-sm:flex-col">
                    <ModalButton
                      variant="secondary"
                      disabled={loading}
                      onClick={handleClose}
                    >
                      Cancel
                    </ModalButton>
                    <ModalButton
                      type="submit"
                      loading={loading}
                      variant={"primary"}
                      disabled={loading}
                    >
                      {loading && (
                        <CircularProgress
                          color="inherit"
                          size={18}
                          thickness={4}
                        />
                      )}
                      Run
                    </ModalButton>
                  </div>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default RunBacktest;
