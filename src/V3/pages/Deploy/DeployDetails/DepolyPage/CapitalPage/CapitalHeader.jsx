import { useState } from "react";
import { Box } from "@mui/material";
import HeaderButton from "../../../../../common/Table/HeaderButton";
import AddCapital from "./AddCapital";
import moment from "moment";
import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

const CapitalHeader = ({
  data = {},
  fetchAllData,
  fetchDeployData = () => {},
}) => {
  const [addCapital] = useLazyGetQuery();

  const {
    capitalAmount = 0,
    name,
    exchange,
    brokerage,
    version,
    currentCapital,
    netProfit,
    avgAnProfit,
  } = data;

  const [openCapital, setOpenCapital] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY"));
  const [saving, setSaving] = useState(false);
  const formattedDate = moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2, // optional: controls decimals
});

const stats = [
  {
    label: "Invested Capital",
    value: capitalAmount ? currencyFormatter.format(capitalAmount) : "₹0",
  },
  {
    label: "Current Capital",
    value: currentCapital ? currencyFormatter.format(currentCapital) : "₹0",
  },
  {
    label: "Net Profit",
    value: netProfit ? currencyFormatter.format(netProfit) : "₹0",
  },
  {
    label: "Avg Annual Profit (%)",
    value: avgAnProfit != null ? `${avgAnProfit.toFixed(2)} %` : "0.00 %",
  },
];


  const handleSaveCapital = async () => {
    if (!amount) return;
    setSaving(true);
    try {
      await addCapital({
        endpoint: `deploy/strategy/addcapital?name=${name}&exchange=${exchange}&brokerage=${brokerage}&type=${selectedType}&capitalValue=${amount}&version=${version}&date=${formattedDate}&months=`,
        tags: [tagTypes.ADDCAPITAL, tagTypes.GET_CAPITAL],
      }).unwrap();
      setAmount("");
      await fetchAllData();
      await fetchDeployData();
      setOpenCapital(false);
    } catch (error) {
      console.error("Add capital error:", error);
    } finally {
      setSaving(false);
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
          loading={saving}
          onSave={handleSaveCapital}
        />
      )}

      <Box className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-5 sm:gap-8 md:gap-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-1.5 min-w-[120px]">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-base font-semibold text-neutral-950">
                {stat.value}
              </p>
            </div>
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
