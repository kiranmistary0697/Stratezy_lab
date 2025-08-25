/* eslint-disable react/prop-types */
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
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

const DeployCard = ({
  row = {},
  handleActivate = () => {},
  handleDelete = () => {},
  onCardClick = () => {},
  onNameClick = () => {},
}) => {
  const {
    name,
    version = "v1",
    deployedDate,
    dataDate,
    state,
    brokerage,
    initialCapital,
    currentCapital,
    avgAnProfit,
    avgProfitPerTrade,
    maxDrawdown,
    netProfit,
    exchange,
    active,
  } = row;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            onClick={(e) => {
              e.preventDefault();
              onNameClick();
            }}
            title={name}
            sx={{ cursor: "pointer" }}
          >
            {name || "-"}
          </Typography>
          <Badge variant="version">{version}</Badge>
        </Box>

        <Box
          className="space-y-2 p-3 sm:p-4 overflow-auto"
          onClick={(e) => {
            e.preventDefault();
            onCardClick();
          }}
          sx={{ cursor: "pointer" }}
        >
          <Row label="Strategy Name:" value={name} />
          <Row label="Deployed On:" value={deployedDate} />
          <Row label="Date:" value={dataDate} />
          <Row
            label="Status:"
            value={
              <Badge variant={state?.toLowerCase() || "default"}>
                {state || "-"}
              </Badge>
            }
          />
          <Row label="Brokerage:" value={brokerage} />
          <Row label="Initial Capital:" value={initialCapital} />
          <Row label="Current Capital:" value={currentCapital} />
          <Row label="Avg Annual Profit:" value={avgAnProfit} />
          <Row label="Average Profit Per Trade:" value={avgProfitPerTrade} />
          <Row label="Max Drawdown:" value={maxDrawdown} />
          <Row label="Net Profit:" value={netProfit} />
          <Row label="Exchange:" value={exchange} />
        </Box>
      </CardContent>

      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box sx={{ display: "flex", gap: 1, m: 1 }}>
          <ActionButton
            action="Backtest"
            label={active === "Yes" ? "De-activate" : "Activate"}
            textColor={active === "Yes" ? "#CD3D64" : "#3D69D3"}
            iconClass="ri-play-line"
            onClick={(e) => {
              e.stopPropagation();
              handleActivate();
            }}
          />

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
    </div>
  );
};

export default DeployCard;
