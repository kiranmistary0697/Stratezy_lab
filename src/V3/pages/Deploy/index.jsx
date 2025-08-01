import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [isAnyInProgress, setIsAnyInProgress] = useState(false);

  const intervalRef = useRef(null);
  const isFetching = useRef(false);

  const fetchAllData = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const { data } = await getDeployData({
        endpoint: "deploy/strategy/findall",
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();

      const sortedData = [...(data || [])].sort(
        (a, b) => new Date(b.deployedDate || 0) - new Date(a.deployedDate || 0)
      );
      setRows(sortedData);

      const anyInProgress = sortedData.some(
        (item) => item.state === "IN_PROGRESS"
      );
      setIsAnyInProgress(anyInProgress);
      if (!anyInProgress) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (error) {
      console.error("Failed to fetch deploy data:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [getDeployData]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling
    intervalRef.current = setInterval(() => {
      setTimeout(() => {
        fetchAllData();
      }, 200);
    }, 10000); // Poll every 10 seconds
  }, [fetchAllData]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (isAnyInProgress) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [isAnyInProgress]);

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
            startPolling={startPolling} // pass polling controls to child, unchanged for child
            stopPolling={stopPolling}
            rows={rows}
            setRows={setRows}
            loading={loading}
            setLoading={setLoading}
          />
        </Box>
      </div>
    </div>
  );
};

export default Deploy;
