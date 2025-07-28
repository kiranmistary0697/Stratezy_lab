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
import { useLazyGetQuery } from "../../../../slices/api";
import { useEffect, useState } from "react";
const ViewFunctionModal = ({
  title,
  isOpen,
  handleClose,
  code,
  buttonText,
  isFunction = false,
}) => {
  const theme = useTheme();
  const [funcRule, setFuncRule] = useState(null);

  const [getFunctionDetails] = useLazyGetQuery();

  const retrieveFuncDetails = async (shortFuncName) => {
    try {
      const { data } = await getFunctionDetails({
        endpoint: `stock-analysis-function/${shortFuncName}`,
      }).unwrap();

      setFuncRule(data?.rule);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFunction) {
      retrieveFuncDetails(title);
    }
  }, [isFunction, title]);

  const handleCopyClick = () => {
    if (funcRule) {
      navigator.clipboard.writeText(funcRule).catch((e) => {
        console.error("Copy failed", e);
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="space-y-4 !p-[30px]">
        <Box display="flex" flexDirection="column" gap={1}>
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
          {isFunction && (
            <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
              <Button
                variant="outlined"
                onClick={handleCopyClick}
                size="small"
                sx={{ alignSelf: "flex-start", mt: 1, textTransform: "none" }}
              >
                Copy
              </Button>
            </Box>
          )}

          <SyntaxHighlighter
            language={isFunction ? "c" : "javascript"}
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
            {isFunction ? funcRule : code}
          </SyntaxHighlighter>

          <ModalButton variant="primaryOutlined" onClick={handleClose}>
            {buttonText}
          </ModalButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFunctionModal;
