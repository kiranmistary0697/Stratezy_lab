import { useState } from "react";
import { Menu, MenuItem, IconButton, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomizedDialogs from "../pages/Strategies/Modal/DuplicateStrategyModal";
import { Formik } from "formik";
import * as Yup from "yup";

const ActionMenu = ({
  isDuplicateButton = false,
  isEditButton = false,
  isDeleteButton = false,
  handleEdit = () => {},
  formik,
  id,
  handleDelete,
  isDeployStrategy,
  name = "",
  desc = "",
  ver = "",
  fetchAllData,
  demoStrategy,
  demoData,
}) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [isId, setIsId] = useState();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const initialValues = {
    name: name || "",
    description: desc || "",
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize // refresh when you load data
        validationSchema={Yup.object({
          name: Yup.string().required("Strategy name is required"),
          description: Yup.string().required("Description is required"),
        })}
        onSubmit={() => {}} // you already save manually inside the dialog
      >
        {(formik) => (
          <CustomizedDialogs
            title={"Duplicate Strategy"}
            textButton={"Save"}
            isOpen={openDuplicateModal}
            name={name}
            description={desc}
            version={ver}
            handleClose={() => setOpenDuplicateModal(false)}
            isDuplicate
            id={isId}
            fetchAllData={fetchAllData}
            demoStrategy={demoStrategy}
            demoData={demoData}
            formik={formik} // ✅ This time it's real
          />
        )}
      </Formik>

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
            fontFamily:"Inter",
            borderRadius: "2px",
            border: "1px solid #E0E0E0",
            padding: "0px 5px",
            boxShadow:"0px 0px 0px 0px",
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
              // marginBottom: "1px",
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
            {formik?.status === "drafts" ? "Edit Draft" : "Edit"}
          </MenuItem>
        )}

        {isDeployStrategy && (
          <MenuItem
            sx={{
              color: "#666666",
              fontSize: "14px",
              padding: "8px 12px",
              fontFamily: "Inter",
              marginBottom: isDeleteButton ? "5px" : 0,
            }}
            onClick={handleEdit}
          >
            Deploy Strategy
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

export default ActionMenu;
