import { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";

import CapitalHeader from "./CapitalHeader";
import CapitalTable from "./CapitalTable";

import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

const CapitalPage = ({ data = {}, fetchDeployData = () => {} }) => {
  const [getCapital] = useLazyGetQuery();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capitalAmount, setCapitalAmount] = useState(0);

  const { name, exchange, brokerage, deployedDate, initialCapital, version } =
    data;

  const fetchAllData = useCallback(async () => {
    if (!name || !exchange || !brokerage || !version) return;
    setLoading(true);
    try {
      const { data: capitalData } = await getCapital({
        endpoint: `deploy/strategy/viewcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_CAPITAL],
      }).unwrap();

      const formattedRows = [];

      // Add initial capital row
      if (deployedDate && initialCapital !== undefined) {
        formattedRows.push({
          id: `${deployedDate}-planned`,
          Date: deployedDate,
          Amount: `₹${initialCapital.toLocaleString("en-IN")}`,
          status: "Completed",
          Type: "One Time",
          Schedule: "1/1",
        });
      }

      if (capitalData.applied) {
        for (const [date, amount] of Object.entries(capitalData.applied)) {
          formattedRows.push({
            id: `${date}-applied`,
            Date: date,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
            status: "Completed",
            Type: "One Time",
            Schedule: "1/1",
          });
        }
      }

      if (capitalData.planned) {
        for (const [date, amount] of Object.entries(capitalData.planned)) {
          formattedRows.push({
            id: `${date}-planned`,
            Date: date,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
            status: "Planned",
            Type: "One Time",
            Schedule: "1/1",
          });
        }
      }

      setRows(formattedRows);

      // Calculate total invested capital (sum of all amounts)
      // const totalAmount = formattedRows.reduce((sum, item) => {
      //   const cleanAmount = item.Amount.replace(/[₹,]/g, "");
      //   return sum + parseFloat(cleanAmount);
      // }, 0);

      // setCapitalAmount(totalAmount);

      // Calculate only planned + initial capital
      let totalAmount = 0;

      if (initialCapital !== undefined) {
        totalAmount += initialCapital;
      }

      if (capitalData.planned) {
        for (const amount of Object.values(capitalData.planned)) {
          totalAmount += amount;
        }
      }

      setCapitalAmount(Number(totalAmount).toFixed(2));
    } catch (error) {
      console.error("Failed to fetch capital data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    getCapital,
    name,
    exchange,
    brokerage,
    version,
    deployedDate,
    initialCapital,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <Box className="flex flex-col gap-3.5 space-y-6  w-full  max-md:gap-3 max-md:p-4 max-md:max-w-[991px] max-sm:gap-2.5 max-sm:p-2.5 max-sm:max-w-screen-sm">
      <CapitalHeader
        data={{ ...data, capitalAmount }}
        fetchAllData={fetchAllData}
        loading={loading}
        fetchDeployData={fetchDeployData}
      />
      <Box className="subheader space-y-8">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "120%",
            letterSpacing: "0px",
            color: "#0A0A0A",
          }}
        >
          Capital History
        </Typography>
        <CapitalTable
          data={data}
          rows={rows}
          loading={loading}
          fetchAllData={fetchAllData}
          fetchDeployData={fetchDeployData}
        />
      </Box>
    </Box>
  );
};

export default CapitalPage;
