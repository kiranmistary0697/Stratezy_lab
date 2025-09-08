import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessModal = ({
  isOpen,
  handleClose = () => {},
  title,
  name,
  description,
  version,
}) => {
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="flex items-center justify-center">
          <CheckCircleIcon fontSize="large" sx={{ color: "#0A994A" }} />
        </DialogTitle>
        <DialogContent className="text-center">
          <Typography
            variant="h6"
            className="font-bold"
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              letterSpacing: "0px",
            }}
          >
            {title}
          </Typography>
          <div className="p-4 rounded-md space-y-2">
            <Typography
              variant="body1"
              className="flex justify-center gap-2 text-[#3D69D3] font-semibold"
            >
              {name}
              {version && (
                <span className="bg-blue-100 text-xs px-2 py-1 rounded-md">
                  {version}
                </span>
              )}
            </Typography>
            <Typography variant="body2" className="mt-2 text-gray-600">
              {description}
            </Typography>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuccessModal;
