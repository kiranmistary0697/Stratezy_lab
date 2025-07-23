/* eslint-disable react/prop-types */
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
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = formik;

  const advancePortfolioSizeConfig = values?.advancePortfolioSizeConfig || {};

  // Form submission handler wrapped for modal
  const onFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
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
          {fields?.configTextParm &&
            Object.entries(fields.configTextParm).length > 0 && (
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
                {Object.entries(fields.configTextParm).map(([key, tooltip]) => (
                  <InputField
                    key={key}
                    label={key}
                    name={`advancePortfolioSizeConfig.${key}`}
                    tooltip={tooltip}
                    size="small"
                    value={advancePortfolioSizeConfig[key] ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disable={isView}
                    error={
                      !!(
                        errors.advancePortfolioSizeConfig &&
                        errors.advancePortfolioSizeConfig[key] &&
                        touched.advancePortfolioSizeConfig &&
                        touched.advancePortfolioSizeConfig[key]
                      )
                    }
                    errorText={
                      errors.advancePortfolioSizeConfig &&
                      errors.advancePortfolioSizeConfig[key]
                    }
                  />
                ))}
              </Box>
            )}

          {/* Boolean Fields Section */}
          {fields?.configBoolParm &&
            Object.entries(fields.configBoolParm).length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 600, color: "#0A0A0A" }}
                >
                  Options
                </Typography>
                {Object.entries(fields.configBoolParm).map(([key, tooltip]) => (
                  <FormControlLabel
                    key={key}
                    sx={{ display: "flex", mb: 1 }}
                    control={
                      <Checkbox
                        checked={!!advancePortfolioSizeConfig[key]}
                        onChange={(e) =>
                          setFieldValue(
                            `advancePortfolioSizeConfig.${key}`,
                            e.target.checked
                          )
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
                          title={tooltip}
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioVerificationModal;
