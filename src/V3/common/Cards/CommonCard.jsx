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

const CommonCard = ({ rows = {} }) => {
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
          {Object.entries(rows).map(([key, value]) => (
            <Row key={key} label={`${key}:`} value={value} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CommonCard;
