import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import ModalButton from "../../../common/Table/ModalButton";
import { useNavigate } from "react-router-dom";
import { get } from "lodash";

const LabelWithInput = ({ label, value, onChange }) => (
  <div>
    <label className="flex gap-2.5 items-center text-[12px] font-semibold text-[#333]">
      {label}
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/210b8daf015b06103be81ff1712af0dbe8cd7159f8f97a1788ce3745ee166757"
        alt="Info"
        className="w-[17px]"
      />
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

const ConfigArgumentModal = ({
  isOpen,
  handleClose,
  subtitle,
  headertitle,
  selectArgs = {},
  name,
  formik = {},
  fieldName, // path to formik field, e.g., "rule.args"
  selectedFilter,
}) => {
  const navigate = useNavigate();
  const [localArgs, setLocalArgs] = useState([]);
  const [localAdesc, setLocalAdesc] = useState([]);

  // Load args and adesc from localStorage or fallback
  const saved = localStorage.getItem(`${fieldName}-saved`);
  
  useEffect(() => {
    if (isOpen || fieldName) {
      try {
        const parsed = JSON.parse(saved);
        setLocalArgs(parsed?.args ?? selectArgs.args ?? []);
        setLocalAdesc(parsed?.adesc ?? selectArgs.adesc ?? []);
      } catch (e) {
        setLocalArgs(selectArgs.args ?? []);
        setLocalAdesc(selectArgs.adesc ?? []);
      }
    }
  }, [isOpen, fieldName, selectArgs.args, selectArgs.adesc]);

  // Build label + form key pairs
  const labels = useMemo(
    () =>
      (localAdesc ?? []).map((label, index) => ({
        keyName: `arg_${index}`,
        title: label,
      })),
    [localAdesc]
  );

  // Build initial input state
  const getInitialValues = () =>
    labels.reduce((acc, label, index) => {
      acc[label.keyName] = localArgs?.[index] || "";
      return acc;
    }, {});

  const [period, setPeriod] = useState({});

  // Update input state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPeriod(getInitialValues());
    }
  }, [isOpen, localArgs, labels]);

  // Input change handler
  const handleChange = (key, value) => {
    setPeriod((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset to default (selectArgs)
  const handleReset = () => {
    const defaults = (selectArgs.adesc ?? []).map((label, index) => ({
      keyName: `arg_${index}`,
      title: label,
    }));
    setPeriod(
      defaults.reduce((acc, label, index) => {
        acc[label.keyName] = selectArgs.args?.[index] || "";
        return acc;
      }, {})
    );
  };

  // Check if any values have changed
  const hasChanged = useMemo(() => {
    return labels.some(
      (label, index) => (localArgs?.[index] || "") !== period[label.keyName]
    );
  }, [period, labels, localArgs]);

  // On Update button click
  const handleUpdate = () => {
    const adesc = labels.map((label) => label.title);
    const args = labels.map((label) => period[label.keyName] || "");

    // Save to Formik
    formik.setFieldValue(`${fieldName}.adesc`, adesc, false);
    formik.setFieldValue(`${fieldName}.args`, args, false);

    // Save to localStorage
    localStorage.setItem(`${fieldName}-saved`, JSON.stringify({ adesc, args }));

    handleClose();
  };

  const handleFilterNavigate = () => navigate("/Devstudio/create-function");

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        <Box display="flex" flexDirection="column" gap={2}>
          <div className="text-xl font-semibold flex items-center gap-2">
            {selectArgs?.shortFuncName || selectedFilter}
          </div>
          <div className="text-sm font-normal" color="textSecondary">
            {headertitle}
          </div>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mb: 2 }}
            onClick={handleFilterNavigate}
          >
            {subtitle}
          </Typography>

          {labels.map((label) => (
            <LabelWithInput
              key={label.keyName}
              label={label.title}
              value={period[label.keyName] || ""}
              onChange={(e) => handleChange(label.keyName, e.target.value)}
            />
          ))}

          <Box
            sx={{
              backgroundColor: "#FFF4E5",
              p: 1,
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="warning.main">
              Arguments are only updated for this Strategy
            </Typography>
          </Box>

          <Box className="flex gap-4 justify-center flex-wrap mt-4">
            <ModalButton
              variant="secondary"
              onClick={hasChanged ? handleReset : handleClose}
            >
              {hasChanged ? "Reset To Default" : "Cancel"}
            </ModalButton>
            <ModalButton
              variant={hasChanged ? "primary" : "Grey"}
              disabled={!hasChanged}
              onClick={handleUpdate}
            >
              Update Args
            </ModalButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigArgumentModal;
