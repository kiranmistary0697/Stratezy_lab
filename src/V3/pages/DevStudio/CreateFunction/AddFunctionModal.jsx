import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePostMutation } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";

import { useFormik } from "formik";
import * as Yup from "yup";

import ModalButton from "../../../common/Table/ModalButton";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAllData } from "../../../../slices/page/reducer";
import { IDENTIFIER_TOOLTIP } from "../../../../constants/CommonText";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const AddFunctionModal = ({
  isOpen,
  handleClose,
  title,
  selectedFunction,
  stockData,
  code,
  isDuplicate = false,
  argsData,
  setIsDirty = () => {},
  isNewFunc = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [verifyNewStock] = usePostMutation();
  const [saveNewStock] = usePostMutation();

  const [isSaving, setIsSaving] = useState(false);

  const dispatchMap = [
    { key: "filterRule", stateKey: "stockBundle" },
    { key: "tradeRule", stateKey: "tradeRule" },
    { key: "tradeSequence", stateKey: "traderSequence" },
    { key: "entry", stateKey: "stockEntryExitEntry" },
    { key: "exit", stateKey: "stockEntryExitExit" },
    { key: "portfolioSizing", stateKey: "portfolioSizing" },
    { key: "gentry", stateKey: "marketEntryExitEntry" },
    { key: "gexit", stateKey: "marketEntryExitExit" },
  ];

  //replace Space with Underscore
  const replaceSpaceWithUnderscore = (str) => {
    return str.replace(/ /g, "_");
  };

  const formik = useFormik({
    initialValues: {
      functionName: isDuplicate
        ? `${stockData?.func} duplicate`
        : stockData?.func || "",
      descriptionName: stockData?.desc || "",
      identifier: replaceSpaceWithUnderscore(
        isDuplicate
          ? `${stockData?.func} duplicate`
          : stockData?.shortFuncName || ""
      ),
    },
    validationSchema: Yup.object({
      functionName: Yup.string()
        .required("Function Name is required")
        // .matches(/^[a-zA-Z0-9_]+$/, "Whitespace is not permitted"),
        .matches(
          /^[a-zA-Z0-9_\s]+$/,
          "Only letters, numbers, underscores, and spaces are permitted"
        ),
      descriptionName: Yup.string().required("Description is required"),
      identifier: Yup.string().matches(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores are permitted"
      ),
    }),
    //stock-analysis-function/verify
    onSubmit: async (values) => {
      const receivedArgs = argsData
        .filter((data) => data.value !== "")
        .map(({ value }) => `${value}`);

      const receivedAdesc = argsData
        .filter((data) => data.name !== "")
        .map(({ name }) => `${name}`);

      setIsSaving(true);
      setIsDirty(false);
      const payload = {
        func: values.functionName,
        rule: code,
        exchange: "nse",
        num_arg: receivedArgs.length || 0,
        equation: `/config/library/${values.identifier}`,
        desc: values.descriptionName,
        shortFuncName:
          values.identifier || replaceSpaceWithUnderscore(values.functionName),
        args: receivedArgs || [],
        adesc: receivedAdesc || [],
        filter: selectedFunction?.filterRule || false,
        buysell: selectedFunction?.tradeRule || false,
        entry: selectedFunction?.entry || false,
        exit: selectedFunction?.exit || false,
        psizing: selectedFunction?.portfolioSizing || false,
        gentry: selectedFunction?.gentry || false,
        gexit: selectedFunction?.gexit || false,
        sort: selectedFunction?.tradeSequence || false,
        utility: selectedFunction?.utility || false,
        stockList: selectedFunction?.stockList || false,
        accountRule: selectedFunction?.accountRule || false,
        candle_stick: false,
        future_rule: false,
        cacheable: false,
        static: false,
      };

      try {
        if (!isNewFunc) {
          const verifyResponse = await verifyNewStock({
            endpoint: "stock-analysis-function/verify",
            payload,
            tags: [tagTypes.GET_FILTERTYPE],
          }).unwrap();

          if (!verifyResponse?.data?.success) {
            handleClose();
            return;
          }
        }
        // Save only if verification succeeded
        const saveStockResponse = await saveNewStock({
          endpoint:
            isDuplicate || isNewFunc
              ? "stock-analysis-function/create"
              : "stock-analysis-function/save",
          payload,
          tags: [tagTypes.GET_FILTERTYPE],
        }).unwrap();

        if (saveStockResponse?.data?.success) {
          toast.success(saveStockResponse?.data?.message || "Function Saved");
        } else {
          toast.error(
            saveStockResponse?.data?.message || "Error Occured While Saving"
          );
        }

        localStorage.removeItem("argsData");
        localStorage.removeItem("editorFunctionCode");
        localStorage.removeItem("selectedValues");
        localStorage.removeItem("selectedTypes");

        dispatchMap.forEach(({ key, stateKey }) => {
          if (selectedFunction?.[key]) {
            dispatch(setAllData({ key: stateKey, data: [] }));
          }
        });

        handleClose();
        navigate("/Globalfunctions");
      } catch (error) {
        console.error("Failed to save stock:", error);
        // Optional: Show error feedback to the user
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleNameChange = (event) => {
    formik.handleChange(event);
    if (isNewFunc) {
      formik.setFieldValue(
        "identifier",
        replaceSpaceWithUnderscore(event.target.value)
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        {/* header */}
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "120%",
            color: "#0A0A0A",
          }}
        >
          {isDuplicate || isNewFunc ? title : "Save Function"}
        </Typography>

        {/* form */}
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Name */}
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "120%",
                color: "#0A0A0A",
              }}
            >
              Function Name
            </Typography>
            <TextField
              fullWidth
              name="functionName"
              value={formik.values.functionName}
              onChange={handleNameChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.functionName &&
                Boolean(formik.errors.functionName)
              }
              helperText={
                formik.touched.functionName && formik.errors.functionName
              }
            />

            {/* Description */}
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "120%",
                color: "#0A0A0A",
              }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              name="descriptionName"
              value={formik.values.descriptionName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.descriptionName &&
                Boolean(formik.errors.descriptionName)
              }
              helperText={
                formik.touched.descriptionName && formik.errors.descriptionName
              }
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "120%",
                  color: "#0A0A0A",
                }}
              >
                Identifier
              </Typography>
              <Tooltip
                title={IDENTIFIER_TOOLTIP}
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
                    },
                  },
                }}
                placement="right-end"
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#666666",
                    width: "1Tooltip7px",
                    height: "17px",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              name="identifier"
              disabled={!(isNewFunc || isDuplicate)}
              value={formik.values.identifier}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.identifier && Boolean(formik.errors.identifier)
              }
              helperText={formik.touched.identifier && formik.errors.identifier}
            />
          </Box>

          {/* buttons */}
          <div className="flex gap-5 justify-center mt-6">
            <ModalButton
              variant="secondary"
              disabled={isSaving}
              onClick={handleClose}
            >
              Cancel
            </ModalButton>

            <ModalButton
              variant="primary"
              type="submit"
              disabled={isSaving || !formik.isValid}
              style={{ position: "relative", minWidth: 160 }}
            >
              {isSaving && (
                <CircularProgress color="inherit" size={18} thickness={4} />
              )}
              {isDuplicate || isNewFunc ? title : "Save"}
            </ModalButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFunctionModal;
