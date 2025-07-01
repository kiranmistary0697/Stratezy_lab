import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import DeployTable from "./DeployTable";
import DeployHeader from "./DeployHeader";

import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

const Deploy = () => {
  const [getDeployData] = useLazyGetQuery();
  const { search, state } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategyName = queryParams.get("name");
  const id = queryParams.get("id");
  const requestId = queryParams.get("requestId");
  const createdeploy = queryParams.get("createdeploy");
  const version = queryParams.get("version");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data } = await getDeployData({
        endpoint: "deploy/strategy/findall",
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();
      setRows(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="sm:h-[calc(100vh-100px)] overflow-auto">
      <div className="h-full space-y-4 p-8">
        <DeployHeader
          createdeploy={createdeploy}
          className="my-[-30px]"
          strategyName={strategyName}
          requestId={requestId}
          version={version}
          fetchAllData={fetchAllData}
        />{" "}
        {/* <div className="flex gap-8 justify-center px-5 max-md:flex-col">
          <Box className="flex flex-col gap-5 items-center px-5  max-w-[584px]">
            <Box className="w-full flex justify-center">
              <img
                src={Deployimg}
                alt="Deploy Strategy Illustration"
                className="max-w-[769] h-auto bg-[#3D69D30A]"
              />
            </Box>
            <Box className="subheader !text-[20px] !font-[600] ">
              Deploy your Strategy
            </Box>
            <p className="text-sm text-center text-stone-500">
              When you deploy your strategy, the system executes your strategy
              rules at the close of each trading day, generating buy and sell
              trade signals for you to manually execute in your brokerage
              account. Alternatively, you can use the "Rebalance" feature to
              automate these trades directly within your brokerage account
            </p>
            <HeaderButton variant="contained">Deploy Strategy</HeaderButton>
          </Box>
        </div> */}
        <Box>
          <DeployTable
            fetchAllData={fetchAllData}
            setRows={setRows}
            rows={rows}
            loading={loading}
            setLoading={setLoading}
          />
        </Box>
      </div>
    </div>
  );
};

export default Deploy;
