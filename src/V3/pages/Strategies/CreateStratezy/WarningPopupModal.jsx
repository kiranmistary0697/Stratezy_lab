import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import React from "react";
import ModalButton from "../../../common/Table/ModalButton";

const WarningPopupModal = ({
  isOpen,
  handleClose = () => {},
  title,
  name,
  description,
  buttonText,

  handleConfirm = () => {},
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="space-y-2 !p-[30px]">
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            <Typography variant="body1" className="text-blue-600 font-semibold">
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

          <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-md:py-0 max-sm:flex-col max-sm:px-4 max-sm:py-0">
            <ModalButton variant="primary" onClick={handleClose}>
              Cancel
            </ModalButton>
            <ModalButton onClick={handleConfirm} variant={"greenOutlined"}>
              Save
            </ModalButton>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WarningPopupModal;
