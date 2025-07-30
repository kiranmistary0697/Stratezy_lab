/* eslint-disable react/prop-types */
import { useState } from "react";
import AceEditor from "react-ace";
import {
  Box,
  Dialog,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
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
  setIsDirty = () => {},
  functionData = [],
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down(1180)); // Breakpoint at 1024px
  const [showArgs, setShowArgs] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (newValue, e) => {
    setIsDirty(true);
    setCode(newValue);
  };

  return (
    <Dialog fullScreen open={isOpen}>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          paddingX: "20px",
          display: "flex",
          flexDirection: "row",
        }}
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
      <Grid
        container
        spacing={2}
        className="w-full overflow-auto px-4 border border-zinc-200"
      >
        <Grid
          item
          size={{
            xs: 12,
            lg: isSmallScreen ? 12 : 4,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={(_, newVal) => {
                setCurrentTab(newVal);
              }}
              sx={{
                paddingLeft: 1,
              }}
            >
              <Tab
                label="Primitives"
                sx={{
                  outline: "none",
                  boxShadow: "none",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0px",
                  color: "#0A0A0A",
                  "&.Mui-selected": {
                    color: "#3D69D3",
                  },
                  "&:hover, &:active, &:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              />
              <Tab
                label="Functions"
                sx={{
                  outline: "none",
                  boxShadow: "none",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0px",
                  color: "#0A0A0A",
                  "&.Mui-selected": {
                    color: "#3D69D3",
                  },
                  "&:hover, &:active, &:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              />
            </Tabs>
            <Box>
              <KeywordSearch
                keywordData={currentTab == 0 ? keywordData : functionData}
                isFunction={currentTab == 0 ? false : true}
                fullHeight={isSmallScreen ? false : true}
              />
            </Box>
          </Box>
          {/* <KeywordSearch
            keywordData={keywordData}
            fullHeight={isSmallScreen ? false : true}
          /> */}
        </Grid>

        <Grid
          item
          size={{
            xs: 12,
            lg: isSmallScreen ? 12 : 8,
          }}
        >
          <Box
            className="m-2"
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                lg: isSmallScreen ? "column" : "row",
              },
              position: "relative",
            }}
          >
            {/* Monaco Editor */}
            <Box
              sx={{
                marginTop: "8px",
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
                height={isSmallScreen ? "600px" : "820px"}
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
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#0A0A0A",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  cursor: "default",
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
                            (stockData?.userDefined ||
                              isNewFuncOrDuplicate) && (
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

            {/* View Button */}
            <Box
              sx={{
                position: "absolute",
                top: 3,
                right: 10,
                zIndex: 10,
                display: "flex",
                gap: "8px",
                alignItems: "center",
                height: "28px",
                width: "129px",
              }}
            >
              <Box
                sx={{
                  display: {
                    xs: "none",
                    lg: isSmallScreen ? "none" : "block",
                  },
                }}
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
                      textWrap: "nowrap",
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
              <span>
                <CloseFullscreenIcon
                  fontSize="small"
                  sx={{
                    cursor: "pointer",
                    color: "white",
                    marginLeft: isSmallScreen ? "80px" : "",
                    // visibility: isSmallScreen ? "hidden" : "visible",
                  }}
                  onClick={handleClose}
                />
              </span>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default EditorFunctionModal;
