import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import ModalButton from "../../../common/Table/ModalButton";
import CustomizedDialogs from "./DuplicateStrategyModal";

const CancelStrategyModal = ({
  isOpen,
  handleClose = () => {},
  isCancel = false,
}) => {
  const [openDraftModal, setOpenDraftModal] = useState(false);
  return (
    <>
      <CustomizedDialogs
        title={"Save Draft"}
        textButton="Save"
        isOpen={openDraftModal}
        handleClose={() => setOpenDraftModal(false)} // FIX: Pass function
        isCancel={isCancel}
      />
      <div>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              padding: "30px 30px 10px 30px",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#0A0A0A",
            }}
          >
            {"Are you Sure?"}
          </DialogTitle>
          <DialogContent sx={{ padding: "0px 30px" }}>
            <DialogContentText id="alert-dialog-description">
              Cancelling now will discard all your progress on this strategy. To
              avoid losing your work, you can save it as a draft and continue
              later
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className="items-center"
            sx={{ padding: "20px 30px 30px" }}
          >
            <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-md:py-0 max-sm:flex-col max-sm:px-4 max-sm:py-0">
              <ModalButton variant="error" onClick={handleClose}>
                Cancel
              </ModalButton>
              <ModalButton
                onClick={() => {
                  setOpenDraftModal(true);
                  handleClose();
                }}
                variant="primary"
              >
                Save as Draft
              </ModalButton>
            </div>
          </DialogActions>
        </Dialog>{" "}
      </div>
    </>
  );
};

export default CancelStrategyModal;
