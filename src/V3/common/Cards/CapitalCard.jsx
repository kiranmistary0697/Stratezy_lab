/* eslint-disable react/prop-types */
import { Box, Card, CardActions, CardContent } from "@mui/material";
import Badge from "../../common/Badge";
import ActionButton from "../ActionButton";

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

const CapitalCard = ({ row = {}, handleDelete = () => {} }) => {
  const { Date, status, Amount, Type, Schedule } = row;

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
        <Box className="space-y-2 p-3 sm:p-4 overflow-auto">
          <Row label={"Date:"} value={Date} />
          <Row
            label={"Status:"}
            value={<Badge variant={status?.toLowerCase()}>{status}</Badge>}
          />
          <Row label={"Amount:"} value={Amount} />
          <Row label={"Type:"} value={Type} />
          <Row label={"Schedule:"} value={Schedule} />
        </Box>
      </CardContent>

      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box sx={{ display: "flex", gap: 1, m: 1 }}>
          <ActionButton
            action="Delete"
            label="Delete"
            textColor="red"
            iconClass="ri-play-line"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />
        </Box>
      </CardActions>
    </Card>
  );
};

export default CapitalCard;
