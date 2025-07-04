import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePostMutation } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";

import { useFormik } from "formik";
import * as Yup from "yup";

import ModalButton from "../../../common/Table/ModalButton";

const AddFunctionModal = ({
  isOpen,
  handleClose,
  title,
  selectedFunction,
  stockData,
  code,
  isDuplicate = false,
  argsData,
}) => {
  const navigate = useNavigate();
  const [verifyNewStock] = usePostMutation();
  const [saveNewStock] = usePostMutation();

  const [isSaving, setIsSaving] = useState(false);

  const formik = useFormik({
    initialValues: {
      functionName: isDuplicate
        ? `${stockData?.shortFuncName}_duplicate`
        : stockData?.shortFuncName || "",
      descriptionName: stockData?.desc || "",
    },
    validationSchema: Yup.object({
      functionName: Yup.string()
        .required("Function Name is required")
        .matches(/^[a-zA-Z0-9_]+$/, "Whitespace is not permitted"),
      descriptionName: Yup.string().required("Description is required"),
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
      const payload = {
        func: values.functionName,
        rule: code,
        exchange: "nse",
        num_arg: receivedArgs.length || 0,
        equation: `/config/library/${values.functionName}`,
        desc: values.descriptionName,
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
        ulying: selectedFunction?.utility || false,
        candle_stick: false,
        future_rule: false,
        cacheable: false,
        static: false,
        stockList: selectedFunction?.stockList || false,
      };

      try {
        const verifyResponse = await verifyNewStock({
          endpoint: "stock-analysis-function/verify",
          payload,
          tags: [tagTypes.GET_FILTERTYPE],
        }).unwrap();

        if (!verifyResponse?.data?.success) {
          return;
        }
        // Save only if verification succeeded
        await saveNewStock({
          endpoint: "stock-analysis-function/save",
          payload,
          tags: [tagTypes.GET_FILTERTYPE],
        }).unwrap();

        localStorage.removeItem("argsData");
        localStorage.removeItem("editorFunctionCode");
        localStorage.removeItem("selectedValues");
        localStorage.removeItem("selectedTypes");

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
          {title}
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
              onChange={formik.handleChange}
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
              Create Function
            </ModalButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFunctionModal;
