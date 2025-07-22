import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";

import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ModalButton from "../../../common/Table/ModalButton";
const ViewFunctionModal = ({
  title,
  isOpen,
  handleClose,
  code,
  buttonText,
  isFunction = false,
}) => {
  const theme = useTheme();
  return (
    <Box className="p-5">
      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="space-y-4 !p-[30px]">
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#0A0A0A",
              }}
            >
              {title}
            </Typography>

            {isFunction ? (
              <Box>{code}</Box>
            ) : (
              <SyntaxHighlighter
                language="javascript"
                customStyle={{
                  backgroundColor: theme.palette.background.default,
                  padding: theme.spacing(2),
                  borderRadius: theme.shape.borderRadius,
                  fontSize: "14px",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  lineHeight: "20px",
                }}
              >
                {code}
              </SyntaxHighlighter>
            )}

            <ModalButton variant="primaryOutlined" onClick={handleClose}>
              {buttonText}
            </ModalButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewFunctionModal;
