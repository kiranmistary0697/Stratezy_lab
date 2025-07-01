import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import ModalButton from "../../../common/Table/ModalButton";
import { tagTypes } from "../../../tagTypes";
import { usePostMutation } from "../../../../slices/api";
import SuccessModal from "../../../common/SuccessModal";

const ConfirmModal = ({
  isOpen,
  handleClose = () => {},
  onClose = () => {},
  title,
  name,
  description,
  strategyName,
  descriptionName,
  selectedStocks,
}) => {
  const [verifyNewStock] = usePostMutation();
  const [saveNewStock] = usePostMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const symbols = selectedStocks
    .map((item) => item.symbol.toUpperCase())
    .join(",\r\n");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!strategyName.trim()) {
      alert("Both name and description are required!");
      return;
    }

    setIsSaving(true); // Start loading

    const payload = {
      func: strategyName,
      rule: `{\r\ns = stocklist(fltr =\r\n${symbols}\r\n);\r\nreturn s;\r\n}\r\n`,
      exchange: "nse",
      num_arg: 0,
      equation: `/config/library/${strategyName}`,
      desc: descriptionName,
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
      const verifyResponse = await verifyNewStock({
        endpoint: `stock-analysis-function/verify`,
        payload,
        tags: [tagTypes.CREATE_STRATEGY, tagTypes.GET_FILTERTYPE],
      }).unwrap();

      if (verifyResponse?.data?.success) {
        await saveNewStock({
          endpoint: `stock-analysis-function/save`,
          payload,
          tags: [tagTypes.CREATE_STRATEGY, tagTypes.GET_FILTERTYPE],
        }).unwrap();

        // const newFilter = { name: strategyName, type: "Static", selectedStock };
        // onSave(newFilter);
        setSuccessModalOpen(true);
        handleClose();
        onClose();
      } else {
        // alert("Verification failed. Please check your strategy.");
      }
    } catch (error) {
      console.error("Error during verification or saving:", error);
      // alert("An error occurred while verifying or saving the strategy.");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <>
      <SuccessModal
        isOpen={successModalOpen}
        handleClose={() => setSuccessModalOpen(false)}
        title={"Stock Filter Updated"}
        name={strategyName}
        description="Your Stock Filter has been successfully updated and added."
      />
      <div>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className="space-y-2 !p-[30px]">
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography className="subheader">{title}</Typography>
              <Typography
                variant="body1"
                className="text-blue-600 font-semibold"
              >
                {name}
              </Typography>
              <Typography className=" !text-[14px] text-[#666666]">
                {description}
              </Typography>

              <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-md:py-0 max-sm:flex-col max-sm:px-4 max-sm:py-0">
                <ModalButton variant="primary" onClick={handleClose}>
                  Cancel
                </ModalButton>
                <ModalButton onClick={handleSave} variant="primaryOutlined">
                  {isSaving && (
                    <CircularProgress color="inherit" size={18} thickness={4} />
                  )}
                  Confirm
                </ModalButton>
              </div>
            </Box>
          </DialogContent>
        </Dialog>{" "}
      </div>
    </>
  );
};

export default ConfirmModal;
