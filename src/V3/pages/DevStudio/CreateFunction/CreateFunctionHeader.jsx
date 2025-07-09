import React, { useState } from "react";
import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HeaderButton from "../../../common/Table/HeaderButton";

const CreateFunctionHeader = ({
  title,
  buttonText,
  isFunction = false,
  handleChange = () => {},
  tooltip,
  id,
  systemDefine,
  isVerify = false,
  isSaving,
  handleVerify = () => {},
  showButtons = true,
  isShowSave = false
}) => {
  const [isCancelStrategy, setIsCancelStrategy] = useState(false);

  return (
    <Box className="flex flex-col md:flex-row items-center justify-between w-full p-6 gap-4 md:gap-10">
      {/* Title Section */}
      <Box
        className={`flex flex-col items-center md:items-start ${
          isFunction ? "w-full" : ""
        }`}
      >
        <Box
          className={`flex items-center justify-center gap-2.5 ${
            isFunction ? " w-full" : ""
          }`}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: isFunction || isVerify ? "16px" : "20px",
              lineHeight: "120%",
              letterSpacing: "0%",
              color: "#0A0A0A",
            }}
          >
            {title}
          </Typography>

          <Tooltip
            title={tooltip}
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
            placement="right-end"
          >
            <InfoOutlinedIcon
              sx={{
                color: "#666666",
                width: "17px",
                height: "17px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
          {systemDefine && (
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "120%",
                letterSpacing: "0%",
                color: "#3D69D3",
              }}
            >
              Learn writing custom Functions
            </Typography>
          )}
        </Box>
      </Box>

      {/* Button Section */}

      <nav className="flex flex-col md:flex-row gap-3 w-full md:w-auto md:ml-auto justify-end">
        {/* {isFunction && showButtons && (
          <HeaderButton
            variant="primary"
            onClick={() => {
              setIsCancelStrategy(true);
            }}
          >
            Cancel
          </HeaderButton>
        )} */}
        {isVerify && (
          <HeaderButton variant="contained" onClick={handleVerify}>
            {isSaving && (
              <CircularProgress color="inherit" size={18} thickness={4} />
            )}
            Verify
          </HeaderButton>
        )}
        { showButtons && isShowSave && (
          <HeaderButton variant="contained" onClick={handleChange}>
            {buttonText}
          </HeaderButton>
        )}
      </nav>
    </Box>
  );
};

export default CreateFunctionHeader;
