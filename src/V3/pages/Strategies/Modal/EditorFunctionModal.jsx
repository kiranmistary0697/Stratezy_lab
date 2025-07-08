/* eslint-disable react/prop-types */
import { useState } from "react";
import AceEditor from "react-ace";
import {
  Box,
  Dialog,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

import HeaderButton from "../../../common/Table/HeaderButton";

import {
  FUNCTION_SUB_TITLE,
  FUNCTION_SUB_TITLE_TOOLTIP,
} from "../../../../constants/CommonText";
import KeywordSearch from "../../DevStudio/CreateFunction/KeywordSearch";

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

const EditorFunctionModal = ({
  isOpen,
  handleClose,
  code,
  setCode = () => {},
  editUserData = false,
  argsData,
  handleAddArgsData,
  handleDeleteArgsData,
  handleArgsDataChange,
  keywordData,
  stockData,
  isNewFuncOrDuplicate,
}) => {
  const [showArgs, setShowArgs] = useState(true); // toggles the side panel

  const handleChange = (newValue, e) => {
    setCode(newValue);
  };
  return (
    <Dialog fullScreen open={isOpen}>
      <DialogTitle
        sx={{ m: 0, p: 2, paddingX: "20px" }}
        className="flex flex-col md:flex-row items-center justify-between w-full p-6 gap-4 md:gap-10"
      >
        <Box className={`flex items-center gap-2.5 ${" w-full"}`}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "120%",
              letterSpacing: "0%",
              color: "#0A0A0A",
            }}
          >
            {FUNCTION_SUB_TITLE}
          </Typography>

          <Tooltip
            title={FUNCTION_SUB_TITLE_TOOLTIP}
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
        </Box>
        <HeaderButton variant="primary" onClick={handleClose}>
          Close
        </HeaderButton>
      </DialogTitle>
      <Box>
        <Box
          sx={{
            display: "flex",
            position: "relative",
            height: "92.5vh",
            paddingX: "20px",
          }}
        >
          <Box sx={{ width: 800 }}>
            <KeywordSearch keywordData={keywordData} fullHeight={true} />
          </Box>

          <Box className="flex w-full">
            {/* Monaco Editor */}
            <AceEditor
              mode="c_cpp"
              theme="monokai"
              name="code-editor"
              value={code}
              onChange={handleChange}
              width={showArgs ? "60%" : "100%"}
              height="99%"
              fontSize={16}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              readOnly={editUserData}
            />

            {/* Arguments Panel */}
            {showArgs && (
              <Box
                sx={{
                  // width: "40%",
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
                            sx={{
                              minWidth: "150px",
                              display: "flex",
                              gap: "1rem",
                            }}
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
                                disabled={editUserData}
                                onChange={(e) =>
                                  handleArgsDataChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
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
                                          boxShadow:
                                            "0px 8px 16px 0px #7B7F8229",
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

                                {index > 0 &&
                                  (stockData?.userDefined ||
                                    isNewFuncOrDuplicate) && (
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
                                        onClick={() => {
                                          if (!editUserData) {
                                            handleDeleteArgsData(index);
                                          }
                                        }}
                                      />
                                    </Box>
                                  )}
                              </Box>
                              <TextField
                                value={item.value}
                                fullWidth
                                margin="normal"
                                disabled={editUserData}
                                onChange={(e) =>
                                  handleArgsDataChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                {(stockData?.userDefined || isNewFuncOrDuplicate) && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "8px",
                    }}
                  >
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
                    <CloseFullscreenIcon
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={handleClose}
                    />
                  </span>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditorFunctionModal;
