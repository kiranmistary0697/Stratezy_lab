import { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import HeaderButton from "../../../common/Table/HeaderButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const EditHeader = ({
  stockData,
  handleChange = () => {},
  isDuplicate,
  handleDelete = () => {},
  handleDuplicate = () => {},
  setEditUserData = () => {},
  editUserData,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box className="flex md:flex-row gap-2.5 items-center justify-between text-center md:text-left p-4">
        <div className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Tooltip
              title={
                isDuplicate
                  ? `${stockData?.shortFuncName} duplicate`
                  : stockData?.shortFuncName
              }
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
              <div className="text-xl font-semibold leading-tight text-neutral-950">
                {isDuplicate ? `${stockData?.func} duplicate` : stockData?.func}
              </div>
            </Tooltip>
          </Box>
          <div className="text-[14px] font-normal leading-tight text-[#666666]">
            {stockData?.desc}
          </div>
        </div>

        <div className="flex justify-end">
          <Box className="flex flex-col items-center md:flex-row gap-3 text-sm font-medium text-blue-600 w-full md:w-auto">
            <IconButton
              sx={{
                "&:focus": {
                  outline: "none",
                },
              }} // Removes outline
              onClick={handleClick}
            >
              <MoreVertIcon className="border !border-none" />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              className="border !border-none text-[#666666]"
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(false)}
            >
              <MenuItem
                sx={{ color: "#666666" }}
                onClick={() => {
                  handleDuplicate();
                  handleClose();
                }}
              >
                Duplicate
              </MenuItem>

              <MenuItem
                sx={{ color: "#CD3D64" }} // Makes text red
                onClick={() => {
                  handleDelete();
                  handleClose();
                }}
                disabled={!stockData?.userDefined}
              >
                Delete
              </MenuItem>
            </Menu>

            <Box className="hidden sm:block">
              <HeaderButton
                variant="outlined"
                onClick={handleChange}
                disabled={isDuplicate ? false : !stockData?.userDefined}
              >
                Save
              </HeaderButton>
            </Box>
          </Box>
        </div>
      </Box>
      <Box className="sm:hidden flex justify-end pb-2 pe-2">
        <HeaderButton
          variant="outlined"
          onClick={handleChange}
          disabled={isDuplicate ? false : !stockData?.userDefined}
        >
          Save
        </HeaderButton>
      </Box>
    </Box>
  );
};

export default EditHeader;
