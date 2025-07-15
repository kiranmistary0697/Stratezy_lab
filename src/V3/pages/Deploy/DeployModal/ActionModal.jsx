import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Box, Typography } from "@mui/material";
import ModalButton from "../../../common/Table/ModalButton";
import { useLazyGetQuery } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";
import { useNavigate } from "react-router-dom";

const ActionModal = ({
  isOpen,
  handleClose = () => {},
  title,
  name,
  description,
  buttonText,
  id,
  formik,
  setSuccessModalOpen = () => {},
  activeDeactive,
  onActionSuccess,
  close = () => {},
  isNavigate = false,
}) => {
  const navigate = useNavigate();
  const { strategyName, brokerage, exchange, version } = activeDeactive;

  const [activeData] = useLazyGetQuery();
  const [deactiveData] = useLazyGetQuery();

  const handleButtonClick = () => {
    try {
      if (buttonText === "Activate") {
        activeData({
          endpoint: `deploy/strategy/activate?name=${strategyName}&exchange=${exchange}&brokerage=${brokerage}&version=${version}&activate=true`,
          tags: [tagTypes.GET_DEPLOY],
        }).unwrap();
      } else {
        deactiveData({
          endpoint: `deploy/strategy/activate?name=${strategyName}&exchange=${exchange}&brokerage=${brokerage}&version=${version}&activate=false`,
          tags: [tagTypes.GET_DEPLOY],
        }).unwrap();
      }
      // assuming your action is setAllData
    } catch (error) {
      console.error("Failed to fetch all data:", error);
    }

    isNavigate && navigate("/Deploy");
    setSuccessModalOpen();
    close();
    onActionSuccess();
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="space-y-2 !p-[30px] md:min-w-[445px]">
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
              onClick={handleButtonClick}
              variant={buttonText === "De-activate" ? "error" : "greenOutlined"}
            >
              {buttonText}
            </ModalButton>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ActionModal;
