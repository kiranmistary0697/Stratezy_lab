import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import HeaderButton from "../../../common/Table/HeaderButton";

const CommonModal = ({
  isOpen = false,
  handleClose = () => {},
  title = "",
  children,
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullScreen>
      <DialogContent className="space-y-1 !p-[20px]">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: { xs: "16px", sm: "18px" }, // Responsive font size
              lineHeight: "120%",
              color: "#0A0A0A",
            }}
          >
            {title}
          </Typography>

          <HeaderButton variant="secondary" onClick={handleClose}>
            Close
          </HeaderButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "95%",
            // padding:"12px",
          }}
        >
          {children || <Typography>Nothing to show...</Typography>}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommonModal;
