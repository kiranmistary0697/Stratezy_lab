import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import ModalButton from "../../../common/Table/ModalButton";

const LabelWithInput = ({ label, value, onChange }) => (
  <div>
    <label
      className="flex gap-2.5 items-center"
      style={{
        fontFamily: "Inter",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "120%",
        letterSpacing: "0px",
        color: "#0A0A0A",
      }}
    >
      {label}
    </label>
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      margin="normal"
      className="custom-select !w-full"
    />
  </div>
);

const StockConfigModal = ({
  open,
  onClose,
  title,
  adesc = [],
  args = [],
  onSave,
  subTitle,
  isView,
}) => {
  const [localArgs, setLocalArgs] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    setLocalArgs(args);
  }, [args]);

  const handleChange = (index, value) => {
    const updated = [...localArgs];
    updated[index] = value;
    setLocalArgs(updated);
  };

  // Determine if values have changed
  const hasChanged = useMemo(() => {
    return args?.some((arg, i) => arg !== localArgs[i]);
  }, [args, localArgs]);

  const handleSave = () => {
    if (hasChanged) {
      onSave({
        args: localArgs,
        adesc: adesc, // if adesc doesn't change, just pass it as-is
      });
    }
  };

  const handleReset = () => {
    setLocalArgs(args);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent
        sx={{
          px: isSmallScreen ? 2 : 4,
          py: isSmallScreen ? 2 : 3,
        }}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <div
            className="flex items-center gap-2"
            style={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#0A0A0A",
            }}
          >
            {title}
          </div>

          {(adesc || []).map((label, index) => (
            <LabelWithInput
              key={index}
              label={label}
              value={localArgs[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}

          <Box
            sx={{
              backgroundColor: "#FFF4E5",
              padding: "8px 16px",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body2"
              color="warning.main"
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                color: "#B45309",
              }}
            >
              Arguments are only updated for this Strategy
            </Typography>
          </Box>

          <Box className="flex gap-4 justify-center flex-wrap mt-4">
            <ModalButton
              variant="secondary"
              onClick={hasChanged ? handleReset : onClose}
            >
              {hasChanged ? "Reset To Default" : "Cancel"}
            </ModalButton>
            <ModalButton
              variant={hasChanged ? "primary" : "Grey"}
              disabled={!hasChanged}
              onClick={handleSave}
            >
              Update Args
            </ModalButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StockConfigModal;
