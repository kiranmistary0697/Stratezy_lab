import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import DetailsSecation from "./DetailsSecation";
import { useLazyGetQuery } from "../../../../../../slices/api";
import moment from "moment";
import { tagTypes } from "../../../../../tagTypes";
import AddCapital from "../CapitalPage/AddCapital";

/** Parse "10300.85 K Rs.", "2.0E7", number → absolute INR */
function parseKRsToNumber(val) {
  if (val == null) return null;
  if (typeof val === "number" && !Number.isNaN(val)) return val;

  const s = String(val).trim();
  if (/^-?\d+(\.\d+)?e[+-]?\d+$/i.test(s)) return Number(s); // scientific

  const num = parseFloat(s.replace(/[,₹]/g, "").match(/-?\d+(\.\d+)?/)?.[0]);
  if (Number.isNaN(num)) return null;

  const hasStandaloneK = /\bK\b/i.test(s) || /\bK\s*Rs\.?/i.test(s);
  return hasStandaloneK ? num * 1000 : num;
}

/** INR formatter (no decimals for whole rupees) */
function formatINR(n) {
  if (n == null || Number.isNaN(n)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}
const toINR = (v) => formatINR(parseKRsToNumber(v));

/** Format percent to two decimals; accepts "11.8 %", "11.8%", 11.8 */
function formatPercent2(val) {
  if (val == null) return "-";
  const m = String(val).match(/-?\d+(\.\d+)?/);
  if (!m) return "-";
  const num = parseFloat(m[0]);
  if (Number.isNaN(num)) return "-";
  return `${num.toFixed(2)} %`;
}

/** Tenure from deployedDate → now (months + days) */
function calcTenure(deployedDate) {
  if (!deployedDate) return "-";
  const start = moment(
    deployedDate,
    ["YYYY-MM-DD", "DD/MM/YYYY", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601],
    true
  );
  if (!start.isValid()) return "-";
  const now = moment();
  const months = now.diff(start, "months");
  const anchor = start.clone().add(months, "months");
  const days = now.diff(anchor, "days");
  return `${months} month${months === 1 ? "" : "s"} ${days} day${
    days === 1 ? "" : "s"
  }`;
}

const DetailsPage = ({ data = {}, fetchDeployData = () => {} }) => {
  const [openCapital, setOpenCapital] = useState(false);
  const { name, exchange, brokerage, version } = data;
  const [addCapital] = useLazyGetQuery();

  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("ONETIME");
  const [startDate, setStartDate] = useState(moment().format("DD/MM/YYYY")); // string
  const [loading, setLoading] = useState(false);

  const formattedDate = useMemo(
    () => moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
    [startDate]
  );

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

  // Money (works for numbers, "K Rs.", scientific)
  const money = useMemo(
    () => ({
      startCapital: toINR(data.initialCapital),
      netProfit: toINR(data.netProfit),
      currentAccountValue: toINR(data.currentCapital),
    }),
    [data.initialCapital, data.netProfit, data.currentCapital]
  );

  const basicInfo = [
    {
      label: "Strategy Name",
      value: data.name,
    },
    {
      label: "Start Capital",
      value: money.startCapital,
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
    { label: "Tenure", value: calcTenure(data.deployedDate) },
    { label: "Net Profit", value: money.netProfit },
    { label: "Current Account Value", value: money.currentAccountValue },
    { label: "Max Drawdown", value: formatPercent2(data.maxDrawdown) },
    { label: "Aveage Profit", value: formatPercent2(data.avgAnProfit) },
    {
      label: "Aveage Profit Per Trade",
      value: formatPercent2(data.avgProfitPerTrade),
    },
  ];

  const executionDetails = [
    { label: "Deployed on", value: data.deployedDate },
    { label: "Tested Markets", value: data.exchange },
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

      {/* Mobile-first container: full width on small, comfy padding on larger */}
      <Box className="flex flex-col gap-4 w-full p-4 sm:p-5">
        <DetailsSecation
          rows={basicInfo}
          addSpacing={true}
          title="Basic Info"
          titleClassName="text-blue-600"
          stackOnMobile
        />
        <DetailsSecation
          rows={performanceMetrics}
          addSpacing={true}
          title="Performance"
          titleClassName="text-blue-600"
          stackOnMobile
        />
        <DetailsSecation
          rows={executionDetails}
          title="Execution"
          titleClassName="text-blue-600"
          stackOnMobile
        />
      </Box>
    </>
  );
};

export default DetailsPage;
