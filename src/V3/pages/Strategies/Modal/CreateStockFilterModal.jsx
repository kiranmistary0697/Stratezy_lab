import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import ModalButton from "../../../common/Table/ModalButton";
import SuccessModal from "../../../common/SuccessModal";
import { tagTypes } from "../../../tagTypes";
import { usePostMutation } from "../../../../slices/api";
import { setAllData } from "../../../../slices/page/reducer";

const validationSchema = Yup.object({
  strategyName: Yup.string()
    .trim()
    .required("Name is required")
    .matches(/^[a-zA-Z0-9_]+$/, "Whitespace is not permitted"),

  descriptionName: Yup.string().trim().required("Description is required"),
  identifier: Yup.string().matches(
    /^[a-zA-Z0-9_]+$/,
    "Only letters, numbers, and underscores are permitted"
  ),
});

const CreateStockFilterModal = ({
  title,
  isOpen,
  handleClose,
  onSave = () => {},
  description,
  selectedStock,
  closeCreatStock,
}) => {
  /* ---------------- local state ---------------- */
  const [isSaving, setIsSaving] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const replaceSpaceWithUnderscore = (str) => {
    return str.replace(/ /g, "_");
  };

  /* ---------------- hooks ---------------- */
  const dispatch = useDispatch();
  const [verifyNewStock] = usePostMutation();
  const [saveNewStock] = usePostMutation();

  /* ---------------- helpers ---------------- */
  const symbols = selectedStock
    .map((item) => item.symbol.toUpperCase())
    .join(",\r\n");

  /* ---------------- formik ---------------- */
  const formik = useFormik({
    initialValues: {
      strategyName: "",
      descriptionName: "",
      identifier: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSaving(true);

      const payload = {
        func: values.strategyName,
        rule: `{\r\ns = stocklist(fltr =\r\n${symbols}\r\n);\r\nreturn s;\r\n}\r\n`,
        exchange: "nse",
        num_arg: 0,
        equation: `/config/library/${values.strategyName}`,
        desc: values.descriptionName,
        shortFuncName:
          values.identifier || replaceSpaceWithUnderscore(values.functionName),
        args: [],
        adesc: [],
        filter: true,
        buysell: false,
        entry: false,
        exit: false,
        psizing: false,
        gentry: false,
        gexit: false,
        sort: false,
        utility: false,
        candle_stick: false,
        future_rule: false,
        cacheable: false,
        static: true,
        stockList: true,
      };

      try {
        /* ---- 1 Verify ---- */
        const { data: verifyData } = await verifyNewStock({
          endpoint: "stock-analysis-function/verify",
          payload,
          tags: [tagTypes.CREATE_STRATEGY, tagTypes.GET_FILTERTYPE],
        }).unwrap();

        if (!verifyData?.success) {
          return;
        }

        /* ---- 2 Save on server ---- */
        await saveNewStock({
          endpoint: "stock-analysis-function/create",
          payload,
          tags: [tagTypes.CREATE_STRATEGY, tagTypes.GET_FILTERTYPE],
        }).unwrap();

        dispatch(setAllData({ key: "stockBundle", data: [] }));

        /* ---- 5 Notify parent & UI ---- */
        setSuccessModalOpen(true);
        handleClose();
        closeCreatStock();
        onSave({
          name: values.strategyName,
          type: "Static",
          selectedStock,
        });
      } catch (err) {
        console.error("Error during verification or saving:", err);
      } finally {
        setIsSaving(false);
      }
    },
  });

  return (
    <>
      {/* ---------- success modal ---------- */}
      <SuccessModal
        isOpen={successModalOpen}
        handleClose={() => setSuccessModalOpen(false)}
        title="Stock Filter Created"
        name={formik.values.strategyName}
        description="Your Stock Filter has been successfully created and added."
      />

      {/* ---------- dialog ---------- */}
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
              <label className="text-xs font-semibold text-neutral-950">
                Name
              </label>
              <TextField
                fullWidth
                name="strategyName"
                value={formik.values.strategyName}
                onChange={(e) => {
                  formik.setFieldValue("strategyName", e.target.value);
                  if (!formik.touched.strategyName) {
                    formik.setFieldTouched("strategyName", true, false);
                  }
                }}
                error={
                  formik.touched.strategyName &&
                  Boolean(formik.errors.strategyName)
                }
                helperText={
                  formik.touched.strategyName && formik.errors.strategyName
                }
              />

              {/* Description */}
              <label className="text-xs font-semibold text-neutral-950">
                Description
              </label>
              <TextField
                fullWidth
                {...formik.getFieldProps("descriptionName")}
                error={
                  formik.touched.descriptionName &&
                  Boolean(formik.errors.descriptionName)
                }
                helperText={
                  formik.touched.descriptionName &&
                  formik.errors.descriptionName
                }
              />
              {/* Identifier */}
              <label className="text-xs font-semibold text-neutral-950">
                Identifier
              </label>
              <TextField
                fullWidth
                name="identifier"
                value={formik.values.identifier}
                onChange={(e) => {
                  formik.setFieldValue("identifier", e.target.value);
                  if (!formik.touched.identifier) {
                    formik.setFieldTouched("identifier", true, false);
                  }
                }}
                error={
                  formik.touched.identifier && Boolean(formik.errors.identifier)
                }
                helperText={
                  formik.touched.identifier && formik.errors.identifier
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
                Back
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
                Save Stock Filter
              </ModalButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateStockFilterModal;
