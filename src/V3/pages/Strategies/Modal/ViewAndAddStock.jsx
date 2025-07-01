import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
  Box,
  Divider,
} from "@mui/material";
import ModalButton from "../../../common/Table/ModalButton";

const ViewAndAddStock = ({
  isOpen,
  setOpenAddStockModal,
  setSelectedStocks,
  initialStockList,
}) => {
  const [newStockLabel, setNewStockLabel] = useState("");
  const [newStockDescription, setNewStockDescription] = useState("");

  const handleSaveNewStock = () => {
    if (newStockLabel && newStockDescription) {
      const newStockItem = {
        label: newStockLabel,
        value: newStockLabel.toLowerCase(), 
        description: newStockDescription,
      };
      initialStockList.push(newStockItem); // Direct mutation is not recommended
      setSelectedStocks((prev) => [...prev, newStockItem]);
      setNewStockLabel("");
      setNewStockDescription("");
      setOpenAddStockModal(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      onClose={() => setOpenAddStockModal(false)}
    >
      <DialogTitle className="text-xl font-semibold">Add New Stock</DialogTitle>
      <Divider />
      <DialogContent className="!p-6 space-y-4">
        <Box>
          <Typography variant="body2" color="primary" className="mb-1">
            Stock Name
          </Typography>
          <TextField
            placeholder="Enter stock name"
            fullWidth
            value={newStockLabel}
            onChange={(e) => setNewStockLabel(e.target.value)}
            className="custom-select"
          />
        </Box>

        <Box>
          <Typography variant="body2" color="primary" className="mb-1">
            Stock Description
          </Typography>
          <TextField
            placeholder="Enter stock description"
            fullWidth
            value={newStockDescription}
            onChange={(e) => setNewStockDescription(e.target.value)}
            className="custom-select"
          />
        </Box>

        <Box className="flex justify-end gap-4 pt-4 max-sm:flex-col max-sm:items-stretch">
          <ModalButton
            variant="secondary"
            onClick={() => setOpenAddStockModal(false)}
          >
            Cancel
          </ModalButton>
          <ModalButton
            variant="primary"
            onClick={handleSaveNewStock}
            disabled={!newStockLabel || !newStockDescription}
          >
            Save
          </ModalButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAndAddStock;
