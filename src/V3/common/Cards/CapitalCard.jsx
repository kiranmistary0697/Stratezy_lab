/* eslint-disable react/prop-types */
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Badge from "../../common/Badge";
import ActionButton from "../ActionButton";

const Row = ({ label, value }) => (
  <Grid
    container
    alignItems="flex-start"
    sx={{ fontFamily: "Inter, sans-serif", mb: 1 }}
  >
    <Grid
      sx={{
        width: "90px",
        display: "flex",
        alignItems: "start",
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          flex: 1,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          textAlign: "left", // Right-align labels for better colon alignment
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          marginLeft: "4px", // Small space before colon
        }}
      >
        :
      </Typography>
    </Grid>

    <Grid
      sx={{
        width: "150px",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: "#666666",
          marginLeft: "8px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Grid>
  </Grid>
);

const CapitalCard = ({ row = {}, handleDelete = () => {} }) => {
  const { Date, status, Amount, Type, Schedule } = row;

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
        <CardContent sx={{ fontFamily: "Inter" }}>
          <Box
            className="space-y-2 p-3 sm:p-4 overflow-auto"
            sx={{ fontFamily: "Inter" }}
          >
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
    </div>
  );
};

export default CapitalCard;
