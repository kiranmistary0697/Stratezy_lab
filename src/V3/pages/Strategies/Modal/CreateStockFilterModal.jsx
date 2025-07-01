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
    .required("Name is required")
    .matches(/^[a-zA-Z0-9_]+$/, "Whitespace is not permitted"),

  descriptionName: Yup.string().trim().required("Description is required"),
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
        ulying: false,
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
          endpoint: "stock-analysis-function/save",
          payload,
          tags: [tagTypes.CREATE_STRATEGY, tagTypes.GET_FILTERTYPE],
        }).unwrap();

        /* ---- 3 Build the object you want in Redux ---- */
        const newStockData = {
          func: values.strategyName,
          shortFuncName: values.strategyName,
          num_arg: 0,
          desc: values.descriptionName,
          args: [],
          userDefined: false,
          filter: true,
          buysell: false,
          entry: false,
          exit: false,
          psizing: false,
          gentry: false,
          gexit: false,
          sort: false,
          ulying: false,
          recommended: false,
          candle_stick: false,
          future_rule: false,
          cacheable: false,
          static: true,
          stockList: true,
          adesc: [],
          graphFunction: {
            func: values.strategyName,
            shortFuncName: values.strategyName,
            exchange: null,
            rule: null,
            num_arg: 1,
            equation: null,
            desc: values.descriptionName,
            args: [null],
            argumentName: null,
            cache_path: null,
            filter: true,
            buysell: false,
            entry: false,
            exit: false,
            psizing: false,
            gentry: false,
            gexit: false,
            sort: false,
            ulying: false,
            recommended: false,
            candle_stick: false,
            future_rule: false,
            cacheable: false,
            static: false,
            stockList: false,
            adesc: [null],
          },
        };

        dispatch(setAllData({ key: "stockBundle", data: newStockData }));

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
