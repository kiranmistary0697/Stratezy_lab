import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import DeployTable from "./DeployTable";
import DeployHeader from "./DeployHeader";

import { useLazyGetQuery } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";

const Deploy = () => {
  const [getDeployData] = useLazyGetQuery();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const strategyName = queryParams.get("name");
  const requestId = queryParams.get("requestId");
  const createdeploy = queryParams.get("createdeploy");
  const version = queryParams.get("version");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoize fetchAllData to avoid unnecessary re-creation
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getDeployData({
        endpoint: "deploy/strategy/findall",
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();
      const abc = [...data];

      // Defensive copy & sort by deployedDate descending
      const sortedData = abc?.sort((a, b) => {
        return new Date(b.deployedDate || 0) - new Date(a.deployedDate || 0);
      });
      setRows(sortedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [getDeployData]);

  useEffect(() => {
    // Initial fetch
    fetchAllData();
    // Set up polling every 4 seconds
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 4000);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchAllData]);

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
        />
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
