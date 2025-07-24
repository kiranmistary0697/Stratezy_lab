/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Tooltip,
  Typography,
  Checkbox,
  FormControlLabel,
  DialogActions,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputField from "./InputField";
import ModalButton from "../../../common/Table/ModalButton";

const PortfolioVerificationModal = ({
  isOpen,
  onClose,
  formik,
  fields,
  isView,
}) => {
  const { values, setFieldValue } = formik;

  const [booleanParams, setBooleanParams] = useState({});
  const [textParams, setTextParams] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const advanceConfigFromFormik =
      values?.portfolioSizing?.advanceConfig || {};
    const booleanParamsFromFormik = advanceConfigFromFormik.booleanParams || {};
    const textParamsFromFormik = advanceConfigFromFormik.textParams || {};

    setBooleanParams({ ...booleanParamsFromFormik });
    setTextParams({ ...textParamsFromFormik });
  }, [isOpen, values?.portfolioSizing?.advanceConfig]);

  const handleBooleanChange = (key, checked) => {
    setBooleanParams((prev) => ({ ...prev, [key]: checked }));
  };

  const handleTextChange = (key, value) => {
    setTextParams((prev) => ({ ...prev, [key]: value }));
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    // Update Formik nested advanceConfig booleanParams
    Object.entries(booleanParams).forEach(([key, val]) => {
      setFieldValue(`portfolioSizing.advanceConfig.booleanParams.${key}`, val);
    });

    // Update Formik nested advanceConfig textParams
    Object.entries(textParams).forEach(([key, val]) => {
      setFieldValue(`portfolioSizing.advanceConfig.textParams.${key}`, val);
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="space-y-4 !p-[30px]">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "120%",
            color: "#0A0A0A",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Advance Configuration
          <Tooltip
            title="Advance Configuration"
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  padding: "12px 16px",
                  background: "#fff",
                  color: "#666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                },
              },
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 20, cursor: "pointer" }} />
          </Tooltip>
        </Typography>

        <Box sx={{ mt: 1 }}>
          {/* Text Fields Section */}
          {fields?.textParams && fields.textParams.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#0A0A0A",
                  fontFamily: "Inter",
                  mb: 2,
                }}
              >
                Parameters
              </Typography>

              {fields.textParams.map((key) => (
                <InputField
                  key={key}
                  label={key}
                  name={`portfolioSizing.advanceConfig.textParams.${key}`}
                  tooltip={fields.desc?.[key] ?? ""}
                  size="small"
                  value={textParams[key] ?? ""}
                  onChange={(e) => handleTextChange(key, e.target.value)}
                  onBlur={() => {}}
                  disable={isView}
                  error={false}
                  errorText={""}
                />
              ))}
            </Box>
          )}

          {/* Boolean Fields Section */}
          {fields?.booleanParams && fields.booleanParams.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: 600, color: "#0A0A0A" }}
              >
                Options
              </Typography>

              {fields.booleanParams.map((key) => (
                <FormControlLabel
                  key={key}
                  sx={{ display: "flex", mb: 1 }}
                  control={
                    <Checkbox
                      checked={!!booleanParams[key]}
                      onChange={(e) =>
                        handleBooleanChange(key, e.target.checked)
                      }
                      disabled={isView}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        userSelect: "none",
                      }}
                    >
                      {key}
                      <Tooltip
                        title={fields.desc?.[key] ?? ""}
                        placement="right"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              padding: "16px",
                              background: "#FFFFFF",
                              color: "#666666",
                              boxShadow: "0px 8px 16px 0px #7B7F8229",
                              fontFamily: "Inter",
                              fontWeight: 400,
                              fontSize: "14px",
                              lineHeight: "20px",
                            },
                          },
                        }}
                      >
                        <InfoOutlinedIcon
                          sx={{ fontSize: 16 }}
                          aria-label={`Info about ${key}`}
                        />
                      </Tooltip>
                    </Box>
                  }
                />
              ))}
            </Box>
          )}
        </Box>

        <DialogActions sx={{ px: 0, py: 2, justifyContent: "center" }}>
          <ModalButton variant="secondary" onClick={onClose}>
            Cancel
          </ModalButton>
          <ModalButton
            variant="primary"
            type="submit"
            style={{ minWidth: 160 }}
            onClick={onFormSubmit}
          >
            Save
          </ModalButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioVerificationModal;
