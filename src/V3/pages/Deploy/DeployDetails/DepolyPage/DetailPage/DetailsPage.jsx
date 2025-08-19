import React, { useState } from "react";
import { Box } from "@mui/material";
import DetailsSecation from "./DetailsSecation";
import { useLazyGetQuery } from "../../../../../../slices/api";
import moment from "moment";
import { tagTypes } from "../../../../../tagTypes";
import AddCapital from "../CapitalPage/AddCapital";

const DetailsPage = ({ data = {}, fetchDeployData = () => {} }) => {
  const [openCapital, setOpenCapital] = useState(false);

  const { name, exchange, brokerage, version } = data;

  const [addCapital] = useLazyGetQuery();

  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY")); // init as string
  const [loading, setLoading] = useState(false);
  const formattedDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");

  const handleSaveCapital = async () => {
    setLoading(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${formattedDate}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      setAmount("");
    } catch (error) {
      console.log(error);
    } finally {
      setOpenCapital(false);
      setLoading(false);
      fetchDeployData();
    }
  };

  const basicInfo = [
    {
      label: "Strategy Name",
      value: data.name,
    },
    {
      label: "Start Capital",
      value: data.initialCapital,
      action: (
        <div
          className="text-sm font-medium p-10px text-blue-600 cursor-pointer"
          onClick={() => setOpenCapital(true)}
          size="small"
        >
          Add Capital ?
        </div>
      ),
    },
    {
      label: "Brokerage",
      value: data.brokerage,
    },
  ];

  const performanceMetrics = [
    {
      label: "Tenure",
      value: "3 months 4 days",
    },
    {
      label: "Net Profit",
      value: data.netProfit,
    },
    {
      label: "Current Account Value",
      value: data.currentCapital,
    },
    {
      label: "Max Drawdown",
      value: data.maxDrawdown,
    },
    {
      label: "Aveage Profit",
      value: data.avgAnProfit,
    },
    {
      label: "Aveage Profit Per Trade",
      value: data.avgProfitPerTrade,
    },
  ];

  const executionDetails = [
    {
      label: "Deployed on",
      value: data.deployedDate,
    },
    // {
    //   label: "Execution Time",
    //   value: "2 hours, 34 minutes",
    // },
    {
      label: "Tested Markets",
      value: data.exchange,
    },
    // {
    //   label: "Executed On",
    //   value: "2024-11-27 09:04:34",
    // },
  ];

  return (
    <>
      {openCapital && (
        <AddCapital
          title="Add Capital"
          isOpen={openCapital}
          handleClose={() => setOpenCapital(false)}
          setAmount={setAmount}
          setSelectedType={setSelectedType}
          setStartDate={setStartDate}
          amount={amount}
          selectedType={selectedType}
          startDate={startDate}
          loading={loading}
          onSave={handleSaveCapital}
        />
      )}

      <Box className="flex flex-col gap-3.5 p-5 w-full max-w-[630px] max-md:gap-3 max-md:p-4 max-md:max-w-[991px] max-sm:gap-2.5 max-sm:p-2.5 max-sm:max-w-screen-sm">
        <DetailsSecation rows={basicInfo} addSpacing={true} />
        <DetailsSecation rows={performanceMetrics} addSpacing={true} />
        <DetailsSecation rows={executionDetails} />
      </Box>
    </>
  );
};

export default DetailsPage;
