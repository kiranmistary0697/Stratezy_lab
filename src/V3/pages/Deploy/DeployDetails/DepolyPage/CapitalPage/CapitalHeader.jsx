import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import HeaderButton from "../../../../../common/Table/HeaderButton";
import AddCapital from "./AddCapital";
import moment from "moment";
import { tagTypes } from "../../../../../tagTypes";
import { useLazyGetQuery } from "../../../../../../slices/api";

const CapitalHeader = ({ data = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openCapital, setOpenCapital] = useState(false);
  const {
    name,
    exchange,
    brokerage,
    currentCapital,
    netProfit,
    initialCapital,
    avgAnProfit,
    version,
  } = data;

  const [addCapital] = useLazyGetQuery();
  const [getCapital] = useLazyGetQuery();

  const [capitalAmount, setCapitalAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));
  const [loading, setLoading] = useState(false);
  const formattedDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");

  const StatItem = ({ label, value }) => (
    <div className="flex flex-col gap-1.5 min-w-[120px]">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-semibold text-neutral-950">{value}</p>
    </div>
  );

  const stats = [
    {
      label: "Invested Capital",
      value: capitalAmount?.toLocaleString("en-IN"),
    },
    {
      label: "Current Capital",
      value: currentCapital?.toLocaleString("en-IN"),
    },
    { label: "Profit", value: netProfit?.toLocaleString("en-IN") },
    { label: "Profit %", value: `${avgAnProfit} %` },
  ];

  const fetchAllData = async () => {
    try {
      const { data } = await getCapital({
        endpoint: `deploy/strategy/viewcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
        tags: [tagTypes.GET_CAPITAL],
      }).unwrap();

      const formattedRows = [];
      if (data.applied) {
        for (const [date, amount] of Object.entries(data.applied)) {
          formattedRows.push({
            id: `${date}-applied`,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
          });
        }
      }

      if (data.planned) {
        for (const [date, amount] of Object.entries(data.planned)) {
          formattedRows.push({
            id: `${date}-planned`,
            Amount: `₹${amount.toLocaleString("en-IN")}`,
          });
        }
      }

      const totalAmount = formattedRows.reduce((sum, item) => {
        const cleanAmount = item.Amount.replace(/[₹,]/g, "");
        return sum + parseFloat(cleanAmount);
      }, 0);

      setCapitalAmount(totalAmount + +initialCapital);
    } catch (error) {
      console.error("Failed to fetch capital data:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveCapital = async () => {
    setLoading(true);
    try {
      const { error } = await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${formattedDate}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      setAmount("");

      if (!error) fetchAllData();
    } catch (error) {
      console.log(error);
    } finally {
      setOpenCapital(false);
      fetchAllData();
      setLoading(false);
    }
  };

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

      <Box className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-5 sm:gap-8 md:gap-10">
          {stats.map((stat, index) => (
            <StatItem key={index} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="mt-2 md:mt-0">
          <HeaderButton
            variant="contained"
            onClick={() => setOpenCapital(true)}
          >
            Add Capital
          </HeaderButton>
        </div>
      </Box>
    </>
  );
};

export default CapitalHeader;
