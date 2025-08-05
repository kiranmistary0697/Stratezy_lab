import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools";
// import "ace-builds/src-noconflict/mode-java"; // For Java
import "ace-builds/src-noconflict/mode-c_cpp"; // For C/C++
import "ace-builds/src-noconflict/theme-monokai"; // Ensure the theme is imported as well
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import ace from "ace-builds/src-noconflict/ace";
ace.config.set(
  "basePath",
  "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.1/"
);
ace.config.set(
  "workerPath",
  "https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.1/"
);
const langTools = ace.require("ace/ext/language_tools"); // Initialize language tools

const StyledLabel = ({ children }) => (
  <Typography
    sx={{
      fontFamily: "Inter",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    {children}
  </Typography>
);

const EditorFunction = ({
  stockData,
  code,
  setCode = () => {},
  setIsDirty = () => {},
  editUserData = false,
  argsData,
  handleAddArgsData,
  handleDeleteArgsData,
  handleArgsDataChange,
  setIsFunctionDialogOpen,
  isNewFuncOrDuplicate,
  keywordData = [],
  functionData = [],
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1024)); // Breakpoint at 1024px
  const [showArgs, setShowArgs] = useState(false); // toggles the side panel

  const handleChange = (newValue, e) => {
    setIsDirty(true);
    setCode(newValue);
    localStorage.setItem("editorFunctionCode", JSON.stringify(newValue));
  };

  useEffect(() => {
    const previousEditorFunctionCode = JSON.parse(
      localStorage.getItem("editorFunctionCode")
    );
    if (previousEditorFunctionCode) {
      setCode(previousEditorFunctionCode);
    }
  }, []);

  const registerKeywords = (keywordList) => {
    const customCompleter = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        if (prefix.length === 0) return callback(null, []);
        const suggestions = keywordList.map((kw) => ({
          caption: kw,
          value: kw,
          meta: kw.meta || "keyword",
        }));
        callback(null, suggestions);
      },
    };
    langTools.addCompleter(customCompleter);
  };

  useEffect(() => {
    const keywordForSuggestion = keywordData.map((d) => (d.name, d.value));

    const functionForSuggestion = functionData.map(
      (d) => (d.func, d.shortFuncName)
    );
    const nonRep = Array.from(
      new Set([...keywordForSuggestion, ...functionForSuggestion])
    );

    if (nonRep.length) {
      registerKeywords(nonRep);
    }
  });

  return (
    <Box
      className="m-2"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: isSmallScreen ? "column" : "row" },
        position: "relative",
      }}
    >
      {/* Code Editor */}
      <Box
        sx={{
          width: {
            xs: "100%",
            lg: isSmallScreen ? "100%" : showArgs ? "60%" : "100%",
          },
          height: { xs: "75vh", lg: isSmallScreen ? "60vh" : "100%" },
          transition: isSmallScreen ? "none" : "width 0.3s",
        }}
      >
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          name="code-editor"
          value={code}
          onChange={handleChange}
          width="100%"
          height="600px"
          fontSize={16}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          readOnly={editUserData}
        />
      </Box>

      {/* Arguments Panel */}
      <Box
        sx={{
          width: { xs: "100%", lg: isSmallScreen ? "100%" : "40%" },
          padding: 2,
          borderLeft: {
            xs: "none",
            lg: isSmallScreen ? "none" : "1px solid #ddd",
          },
          borderTop: {
            xs: "1px solid #ddd",
            lg: isSmallScreen ? "1px solid #ddd" : "none",
          },
          display: {
            xs: "block",
            lg: isSmallScreen ? "block" : showArgs ? "block" : "none",
          }, // Always show on screens <= 1024px
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            color: "#0A0A0A",
            fontFamily: "Inter",
            fontWeight: 600,
          }}
        >
          Arguments
        </Typography>

        <Box sx={{ minWidth: "150px", mt: 2 }}>
          {argsData.map((item, index) => {
            const labelIndex = `ARG${index + 1} Name`;
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <StyledLabel>{labelIndex}</StyledLabel>
                  <TextField
                    value={item.name}
                    fullWidth
                    margin="normal"
                    disabled={editUserData}
                    onChange={(e) =>
                      handleArgsDataChange(index, "name", e.target.value)
                    }
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <StyledLabel>Default Value</StyledLabel>
                    {index > 0 &&
                      (stockData?.userDefined || isNewFuncOrDuplicate) && (
                        <DeleteOutlineOutlinedIcon
                          sx={{
                            color: "red",
                            cursor: "pointer",
                            height: "0.85em",
                          }}
                          onClick={() => {
                            if (!editUserData) {
                              handleDeleteArgsData(index);
                            }
                          }}
                        />
                      )}
                  </Box>
                  <TextField
                    value={item.value}
                    fullWidth
                    margin="normal"
                    disabled={editUserData}
                    onChange={(e) =>
                      handleArgsDataChange(index, "value", e.target.value)
                    }
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        {(stockData?.userDefined || isNewFuncOrDuplicate) && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Typography
              onClick={() => {
                if (!editUserData) {
                  handleAddArgsData();
                }
              }}
              sx={{
                fontSize: "14px",
                color: "#3D69D3",
                fontFamily: "Inter",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              + Add More
            </Typography>
          </Box>
        )}
      </Box>

      {/* Button Container */}
      <Box
        sx={{
          position: "absolute",
          top: 3,
          right: 10,
          zIndex: 10,
          height: "28px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {/* Show/Hide Arguments (Hidden on small screens) */}
        <Box
          sx={{ display: { xs: "none", lg: isSmallScreen ? "none" : "block" } }}
        >
          {showArgs ? (
            <Typography
              onClick={() => setShowArgs(!showArgs)}
              sx={{
                fontFamily: "Inter",
                fontSize: "14px",
                fontWeight: 500,
                color: "#3D69D3",
                cursor: "pointer",
              }}
            >
              Hide Arguments
            </Typography>
          ) : (
            <Typography
              onClick={() => setShowArgs(!showArgs)}
              sx={{
                fontFamily: "Inter",
                fontSize: "12px",
                fontWeight: 400,
                color: "white",
                cursor: "pointer",
              }}
            >
              View Arguments
            </Typography>
          )}
        </Box>
        {/* Fullscreen Icon (Always visible) */}
        <OpenInFullIcon
          fontSize="small"
          sx={{ cursor: "pointer", color: "white" }}
          onClick={() => setIsFunctionDialogOpen(true)}
        />
      </Box>
    </Box>
  );
};

export default EditorFunction;
