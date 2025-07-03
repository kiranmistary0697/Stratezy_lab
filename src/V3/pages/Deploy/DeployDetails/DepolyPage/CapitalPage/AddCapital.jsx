import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  MenuItem,
  TextField,
} from "@mui/material";
import ModalButton from "../../../../../common/Table/ModalButton";
import CustomDatePicker from "../../../../../common/CustomDatePicker";
import moment from "moment";

const AddCapital = ({
  isOpen,
  handleClose = () => {},
  title,
  setAmount = () => {},
  setSelectedType = () => {},
  setStartDate = () => {},
  amount,
  selectedType,
  startDate,
  onSave = () => {},
  capitalData = {},
  loading,
}) => {
  const { date, initialAmount, type } = capitalData;

  const normalized = type?.replace(/\s+/g, "").toUpperCase();
  const normalizedAmount = initialAmount?.replace(/[₹,]/g, "");

  useEffect(() => {
    if (initialAmount) {
      setAmount(normalizedAmount);
    }
  }, []);
  const formattedDate = moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");

  useEffect(() => {
    if (date) {
      setStartDate(formattedDate);
    }
  }, []);
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        <Box display="flex" flexDirection="column" gap={2}>
          <div className="font-semibold text-xl flex items-center gap-2">
            {title}
          </div>
          {/* Name Field */}
          <label className="flex gap-2.5 items-center text-[12px] font-semibold text-[#333]">
            Select Date
          </label>
          <CustomDatePicker
            value={startDate}
            onChange={(val) => setStartDate(val)}
            isFuture
            iDisable={!!capitalData?.date} // disable if date exists in capitalData
          />

          <label className="flex gap-2.5 items-center text-[12px] font-semibold text-[#333]">
            Amount
          </label>
          <TextField
            size="small"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label className="flex gap-2.5 items-center text-[12px] font-semibold text-[#333]">
            Type
          </label>
          <TextField
            size="small"
            select
            fullWidth
            value={normalized || selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={!!type} // Disable if type is passed
          >
            {!type && (
              <MenuItem value="ONETIME" disabled>
                Select Type
              </MenuItem>
            )}
            <MenuItem value="ONETIME">ONETIME</MenuItem>
          </TextField>
        </Box>
        <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-md:py-0 max-sm:flex-col max-sm:px-4 max-sm:py-0">
          <ModalButton
            variant="secondary"
            disabled={loading}
            onClick={handleClose}
          >
            Cancel
          </ModalButton>
          <ModalButton variant="primary" loading={loading} onClick={onSave}>
            {loading && (
              <CircularProgress color="inherit" size={18} thickness={4} />
            )}
            Save
          </ModalButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCapital;
