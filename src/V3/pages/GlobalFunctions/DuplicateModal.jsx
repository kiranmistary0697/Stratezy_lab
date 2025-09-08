import {
  Box,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ModalButton from "../../common/Table/ModalButton";

const DuplicateModal = ({ isOpen, handleClose, title, buttonText }) => {
  const [strategyName, setStrategyName] = useState();
  const [descriptionName, setDescriptionName] = useState();
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              letterSpacing: "0%",
              color: "#0A0A0A",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#0A0A0A",
                }}
              >
                Name
              </Typography>
              <TextField
                fullWidth
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#0A0A0A",
                }}
              >
                Description
              </Typography>
              <TextField
                fullWidth
                value={descriptionName}
                onChange={(e) => setDescriptionName(e.target.value)}
              />
            </Box>
          </Box>
          <div className="flex gap-5 justify-center items-center w-full max-md:px-5 max-sm:flex-col">
            <ModalButton variant="secondary" onClick={handleClose}>
              Cancel
            </ModalButton>
            <ModalButton variant="primary">{buttonText}</ModalButton>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateModal;
