import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const GlobalFunctionActionMenu = ({
  isDuplicateButton = false,
  isEditButton = false,
  isDeleteButton = false,
  handleEdit = () => {},

  id,
  handleDelete,
  isDeployStrategy,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [isId, setIsId] = useState();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Three dots button */}
      <IconButton
        sx={{
          "&:focus": {
            outline: "none",
          },
        }} // Removes outline
        onClick={(event) => {
          event.stopPropagation(); // Prevents row click
          setAnchorEl(event.currentTarget);
        }}
      >
        <MoreVertIcon className="border !border-none" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(false)}
        PaperProps={{
          sx: {
            borderRadius: "2px",
            border: "1px solid #E0E0E0",
            padding: "5px",
            width: "auto",
            boxSizing: "border-box",
          },
        }}
      >
        {isDuplicateButton && (
          <MenuItem
            sx={{
              color: "#666666",
              fontSize: "14px",
              padding: "8px 12px",
              marginBottom: "5px",
              fontFamily: "Inter",
            }}
            onClick={() => {
              setOpenDuplicateModal(true);
              setIsId(id);
              handleClose();
            }}
          >
            Duplicate
          </MenuItem>
        )}

        {isEditButton && (
          <MenuItem
            sx={{
              color: "#666666",
              fontSize: "14px",
              padding: "8px 12px",
              fontFamily: "Inter",
              marginBottom: isDeployStrategy || isDeleteButton ? "5px" : 0,
            }}
            onClick={handleEdit}
          >
            Edit Function
          </MenuItem>
        )}

        {isDeleteButton && (
          <MenuItem
            sx={{
              color: "#CD3D64",
              fontSize: "14px",
              padding: "8px 12px",
              fontFamily: "Inter",
            }}
            onClick={() => {
              handleClose();
              if (handleDelete) handleDelete();
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default GlobalFunctionActionMenu;
