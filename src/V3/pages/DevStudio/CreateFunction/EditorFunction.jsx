import React, { useState } from "react";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import MonacoEditor from "react-monaco-editor";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const StyledLabel = ({ children }) => (
  <>
    <Typography
      sx={{
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {children}
    </Typography>
    {/* <Tooltip
      title={PrimaryAxis}
      placement="right-end"
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
        sx={{
          color: "#666666",
          width: "17px",
          height: "17px",
          cursor: "pointer",
        }}
      />
    </Tooltip> */}
  </>
);

const EditorFunction = ({ stockData }) => {
  const [code, setCode] = useState(stockData?.rule || "");
  const [showArgs, setShowArgs] = useState(false); // toggles the side panel

  const handleEditorDidMount = (editor, monaco) => {
    editor.focus();
  };

  const handleChange = (newValue, e) => {
    setCode(newValue);
  };

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
  };

  return (
    <Box className="m-2" sx={{ display: "flex", position: "relative" }}>
      {/* Monaco Editor */}
      <Box
        sx={{
          width: showArgs ? "60%" : "100%",
          transition: "width 0.3s",
        }}
      >
        <MonacoEditor
          width="100%"
          height="500"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={options}
          onChange={handleChange}
          editorDidMount={handleEditorDidMount}
        />
      </Box>

      {/* Arguments Panel */}
      {showArgs && (
        <Box
          sx={{
            width: "40%",
            padding: 2,
            // backgroundColor: "#f5f5f5",
            borderLeft: "1px solid #ddd",
          }}
        >
          <Typography className="subheader">Arguments</Typography>

          <Box className="flex gap-4 mt-4" sx={{ alignItems: "center" }}>
            <Box sx={{ minWidth: "150px" }}>
              {stockData?.adesc.map((item, index) => {
                const labelIndex = `@@${index + 1} Name`;
                return (
                  <Box
                    key={index}
                    className="flex gap-4 mt-4"
                    sx={{ alignItems: "center" }}
                  >
                    <Box sx={{ minWidth: "150px" }}>
                      <StyledLabel>{labelIndex}</StyledLabel>
                      <TextField
                        defaultValue=""
                        value={item}
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ minWidth: "150px" }}>
              {stockData?.args.map((item, index) => {
                return (
                  <Box
                    key={index}
                    className="flex gap-4 mt-4"
                    sx={{ alignItems: "center" }}
                  >
                    <Box sx={{ minWidth: "150px" }}>
                      <StyledLabel>Default Value</StyledLabel>
                      <TextField
                        defaultValue=""
                        value={item}
                        fullWidth
                        margin="normal"
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Row 2 */}
        </Box>
      )}

      {/* View Button */}
      <Typography
        variant="contained"
        size="small"
        onClick={() => setShowArgs(!showArgs)}
        className={
          showArgs
            ? "text-[#3D69D3] absolute top-3 right-10 z-10 cursor-pointer "
            : "text-white absolute top-3 right-10 z-10 cursor-pointer "
        }
      >
        {showArgs ? "Hide Arguments" : "View Arguments"}
      </Typography>
    </Box>
  );
};

export default EditorFunction;
