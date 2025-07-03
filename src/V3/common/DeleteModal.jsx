import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import ModalButton from "./Table/ModalButton";

const DeleteModal = ({
  isOpen,
  handleClose = () => {},
  title,
  name,
  description,
  handleConfirm = () => {},
  isLoading,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
    >
      <DialogContent className="space-y-2 !p-[30px]">
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#0A0A0A",
              }}
            >
              {title}
            </Typography>
            {name && (
              <Typography
                variant="body1"
                className="text-blue-600 font-semibold"
              >
                {name}
              </Typography>
            )}
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                color: "#666666",
              }}
            >
              {description}
            </Typography>
          </Box>

          <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-md:py-0 max-sm:flex-col max-sm:px-4 max-sm:py-0">
            <ModalButton variant="primary" onClick={handleClose}>
              Cancel
            </ModalButton>
            <ModalButton
              disabled={isLoading}
              onClick={handleConfirm}
              variant="error"
            >
              Delete
            </ModalButton>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
