import React, { useEffect, useState } from "react";
import { Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CreateDeploy from "./DeployModal/CreateDeploy";

import SuccessModal from "../../common/SuccessModal";
import HeaderButton from "../../common/Table/HeaderButton";
import { DEPLOY_HEADER_TOOLTIP } from "../../../constants/CommonText";

const DeployHeader = ({
  createdeploy,
  strategyName,
  requestId,
  version,
  fetchAllData = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState([]);

  useEffect(() => {
    if (createdeploy === "true") {
      setIsOpen(true);
    }
  }, [createdeploy]);

  return (
    <>
      {isOpen && (
        <CreateDeploy
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          title="Deploy Strategy"
          buttonText="Deploy Strategy"
          setSuccessModalOpen={setSuccessModalOpen}
          deployStrategy={{
            name: strategyName,
            reqId: requestId,
            version: version,
          }}
          fetchAllData={fetchAllData}
        />
      )}
      {successModalOpen && (
        <SuccessModal
          isOpen={successModalOpen}
          handleClose={() => setSuccessModalOpen(false)}
          title={"Strategy Deployed"}
          name={selectedStock?.name}
          description={
            "Your strategy has been successfully deployed and currently being activated."
          }
          version={"v3"}
        />
      )}

      <Box className="flex md:flex-row gap-6 md:gap-10  w-full justify-between  ">
        <Box display="flex" alignItems="center" gap={1}>
          <div className=" flex items-center gap-2 font-semibold text-xl">
            Deploy
            <Tooltip
              title={DEPLOY_HEADER_TOOLTIP}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 450,
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
          </div>
        </Box>
        <HeaderButton variant="contained" onClick={() => setIsOpen(true)}>
          Deploy Strategy
        </HeaderButton>
      </Box>
    </>
  );
};

export default DeployHeader;
