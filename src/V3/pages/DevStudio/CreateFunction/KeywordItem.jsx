import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ViewColumnIcon from "../../../../assets/view-column.png";
import ViewFunctionModal from "./ViewFunctionModal";

const KeywordItem = ({ name, description, isDefault, caption, usage }) => {
  const [isView, setIsView] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {isView && (
        <ViewFunctionModal
          title={name}
          isOpen={isView}
          handleClose={() => setIsView(false)}
          code={usage}
          buttonText="Close"
        />
      )}
      <ListItem
        // divider
        secondaryAction={
          <>
            <IconButton edge="end" onClick={handleMenuClick}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              className="border !border-none text-[#666666]"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                sx={{
                  color: "#666666",
                  fontSize: "14px",
                  padding: "8px 12px",
                  marginBottom: "5px",
                  fontFamily: "Inter",
                  height: "20px"
                }}
                onClick={() => {
                  setIsView(true);
                  handleClose();
                }}
              >
                View Details
              </MenuItem>
            </Menu>
          </>
        }
      >
        <Box className="flex flex-col w-full">
          <Tooltip
            title={
              <div className="flex flex-col gap-2 text-sm ">
                <div>{description}</div>
                <div
                  onClick={() => {
                    setIsView(true);
                    handleClose();
                  }}
                  className="text-sm font-medium text-blue-700 cursor-pointer"
                >
                  View Details
                </div>
              </div>
            }
            placement="right-start"
            componentsProps={{
              tooltip: {
                sx: {
                  padding: "12px 16px",
                  width: "202px",
                  background: "#FFFFFF",
                  color: "#666666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                },
              },
            }}
          >
            <Box className="flex gap-2 items-center space-x-4">
              <img
                src={ViewColumnIcon}
                alt="Info"
                className="object-contain shrink-0 aspect-square w-[17px]"
              />
              <Box className="flex flex-col">
                <Box className="flex gap-2 items-center">
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#0A0A0A",
                    }}
                  >
                    {name}
                  </Typography>
                  {isDefault && (
                    <Chip
                      label="Default"
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "#666666",
                  }}
                >
                  {caption}
                </Typography>
              </Box>
            </Box>
          </Tooltip>
        </Box>
      </ListItem>
    </>
  );
};

export default KeywordItem;
