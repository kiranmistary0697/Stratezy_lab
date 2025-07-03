import { useState } from "react";
import AceEditor from "react-ace";

import { Box, TextField, Tooltip, Typography } from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

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
  </>
);

const EditorFunction = ({
  stockData,
  code,
  setCode = () => {},
  editUserData = false,
  argsData,
  handleAddArgsData,
  handleDeleteArgsData,
  handleArgsDataChange,
  setIsFunctionDialogOpen,
}) => {
  const [showArgs, setShowArgs] = useState(false); // toggles the side panel

  const handleChange = (newValue, e) => {
    setCode(newValue);
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
        <AceEditor
          mode="c_cpp"
          theme="monokai"
          name="code-editor"
          value={code}
          onChange={handleChange}
          width="100%"
          height="600px"
          fontSize={16}
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
      {showArgs && (
        <Box
          sx={{
            width: "40%",
            padding: 2,
            // backgroundColor: "#f5f5f5",
            borderLeft: "1px solid #ddd",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              color: "#0A0A0A",
              fontFamily: "Inter",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Arguments
          </Typography>

          <Box className="flex gap-4 mt-4" sx={{ alignItems: "center" }}>
            <Box sx={{ minWidth: "150px" }}>
              {argsData.map((item, index) => {
                const labelIndex = `@@${index + 1} Name`;
                return (
                  <Box
                    key={index}
                    className="flex gap-4 mt-4"
                    sx={{ alignItems: "center", width: "max-content" }}
                  >
                    <Box
                      sx={{ minWidth: "150px", display: "flex", gap: "1rem" }}
                    >
                      <Box>
                        <Box className="flex gap-2.5 items-center">
                          <StyledLabel>{labelIndex}</StyledLabel>
                          <Tooltip
                            title={labelIndex}
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
                          </Tooltip>
                        </Box>

                        <TextField
                          value={item.name}
                          fullWidth
                          margin="normal"
                          onChange={(e) =>
                            handleArgsDataChange(index, "name", e.target.value)
                          }
                        />
                      </Box>

                      <Box>
                        <Box className="flex gap-2.5 items-center justify-between">
                          <Box className="flex gap-2.5 items-center">
                            <StyledLabel>Default Value</StyledLabel>
                            <Tooltip
                              title={"Default Value"}
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
                            </Tooltip>
                          </Box>

                          {index > 0 && (
                            <Box
                              sx={{
                                color: "transparent",
                                cursor: "pointer",
                                marginBottom: "0px",
                                display: "flex",
                                flexDirection: "row-reverse",
                              }}
                            >
                              <DeleteOutlineOutlinedIcon
                                sx={{
                                  color: "red",
                                  cursor: "pointer",
                                  height: "0.85em",
                                }}
                                onClick={() => handleDeleteArgsData(index)}
                              />
                            </Box>
                          )}
                        </Box>
                        <TextField
                          value={item.value}
                          fullWidth
                          margin="normal"
                          onChange={(e) =>
                            handleArgsDataChange(index, "value", e.target.value)
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
            }}
          >
            <Typography
              onClick={handleAddArgsData}
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

          {/* Row 2 */}
        </Box>
      )}

      {/* View Button */}
      <Box
        className={
          showArgs
            ? "text-[#3D69D3] absolute top-3 right-10 z-10 cursor-pointer "
            : "text-white absolute top-3 right-10 z-10 cursor-pointer "
        }
        sx={{ height: "28px", width: "129px" }}
      >
        {showArgs ? (
          <Typography
            onClick={() => setShowArgs(!showArgs)}
            sx={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Hide Arguments
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              onClick={() => setShowArgs(!showArgs)}
              sx={{
                fontFamily: "Inter",
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              View Arguments
            </Typography>
            <span>
              <OpenInFullIcon
                fontSize="small"
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => setIsFunctionDialogOpen(true)}
              />
            </span>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EditorFunction;
