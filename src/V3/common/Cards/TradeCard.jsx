/* eslint-disable react/prop-types */
import { Box, Card, CardContent } from "@mui/material";

const Row = ({ label, value }) => (
  <div
    className="flex gap-2 items-start"
    style={{ fontFamily: "Inter, sans-serif" }}
  >
    <span className="font-semibold text-gray-900 whitespace-nowrap">
      {label}
    </span>
    <span className="text-[#666666] break-words">{value ?? "-"}</span>
  </div>
);

const TradeCard = ({ row }) => {
  const {
    symbol,
    buyTime,
    buyPrice,
    sellTime,
    sellPrice,
    number,
    investment,
    risk1R,
    principal,
    duration,
    annualPrf,
    netProfit,
    profit,
    maxPrf,
    closeReason,
  } = row;

  return (
    <Card
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: 2,
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Box className="space-y-2 p-2 overflow-auto">
          <Row label="Symbol:" value={symbol || "-"} />
          <Row label="Buy Time:" value={buyTime || "-"} />
          <Row label="Buy Price:" value={buyPrice || "-"} />
          <Row label="Sell Time:" value={sellTime || "-"} />
          <Row label="Sell Price:" value={sellPrice || "-"} />
          <Row label="Quantity:" value={number || "-"} />
          <Row label="Investment:" value={investment || "-"} />
          <Row label="Risk1R:" value={risk1R || "-"} />
          <Row label="Principal:" value={principal || "-"} />
          <Row label="Duration:" value={duration || "-"} />
          <Row label="Annual Profit:" value={annualPrf || "-"} />
          <Row label="Net Profit:" value={netProfit || "-"} />
          <Row label="Profit %:" value={profit || "-"} />
          <Row label="Max Profit:" value={maxPrf || "-"} />
          <Row label="Close Reason:" value={closeReason || "-"} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TradeCard;
