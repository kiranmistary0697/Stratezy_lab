import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HeaderButton from "../../../common/Table/HeaderButton";
import Badge from "../../../common/Badge";

import CreateDeploy from "../DeployModal/CreateDeploy";
import SuccessModal from "../../../common/SuccessModal";
import DeleteModal from "../../../common/DeleteModal";
import ActionModal from "../DeployModal/ActionModal";

const DeployDetailHeader = ({ strategy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [isActiveStrategy, setIsActiveStrategy] = useState(false);
  const [actionType, setActionType] = useState("");

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {isOpen && (
        <CreateDeploy
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          title="Edit Deployment"
          buttonText="Save Deploy"
          setSelectedStock={setSelectedStock}
          selectedStock={selectedStock}
          setSuccessModalOpen={setSuccessModalOpen}
        />
      )}
      {successModalOpen && (
        <SuccessModal
          isOpen={successModalOpen}
          handleClose={() => setSuccessModalOpen(false)}
          title={"Deployment Updated"}
          name={selectedStock?.name}
          description={
            "Your strategy has been successfully deployed and is ready for use."
          }
          version={"v3"}
        />
      )}
      {isDelete && (
        <DeleteModal
          isOpen={isDelete}
          handleClose={() => setIsDelete(false)}
          title="Are you Sure?"
          description="This action is irreversible. Once deleted, the deployment and all its data cannot be recovered."
        />
      )}

      {isActiveStrategy && (
        <ActionModal
          isOpen={isActiveStrategy}
          handleClose={() => setIsActiveStrategy(false)}
          title={`Are you sure you want to ${actionType}?`}
          buttonText={actionType}
          description="This will update the strategy status."
          activeDeactive={{
            strategyName: strategy?.name,
            exchange: strategy?.exchange,
            brokerage: strategy?.brokerage,
            version: strategy?.version,
          }}
          setSuccessModalOpen={() => setSuccessModalOpen(true)}
          close={() => setSuccessModalOpen(false)}
          isNavigate
        />
      )}

      <Box className="flex flex-col md:flex-row flex-wrap gap-4 sm:gap-6 md:gap-10 w-full justify-between p-4">
        <Box className="flex gap-2.5 items-center text-center md:text-left">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#0A0A0A",
            }}
          >
            {strategy?.name}
          </Typography>
          <Badge variant="version">{strategy?.version}</Badge>
          {strategy?.active === "Yes" ? (
            <Badge isSquare variant="complete">
              Active
            </Badge>
          ) : (
            <Badge isSquare variant="disable">
              Not Active
            </Badge>
          )}
        </Box>

        <nav className="flex flex-col md:flex-row gap-3 text-sm font-medium text-blue-600 w-full md:w-auto">
          <IconButton
            sx={{
              "&:focus": {
                outline: "none",
              },
            }}
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
                setIsOpen(true);
                handleClose();
              }}
            >
              Edit
            </MenuItem>

            <MenuItem
              sx={{ color: "#CD3D64" }}
              onClick={() => {
                setIsDelete(true);
                handleClose();
              }}
            >
              Delete
            </MenuItem>
          </Menu>

          {strategy?.active === "Yes" && (
            <HeaderButton
              variant="error"
              onClick={(e) => {
                setActionType("De-activate");
                setIsActiveStrategy(true);
              }}
            >
              Deactivate
            </HeaderButton>
          )}

          <HeaderButton variant="contained">Rebalance</HeaderButton>
        </nav>
      </Box>
    </>
  );
};

export default DeployDetailHeader;
