/* eslint-disable react/prop-types */
import { Box, Typography, Card, CardContent, CardActions } from "@mui/material";

import ActionButton from "../ActionButton";
import Badge from "../Badge";

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

const FunctionCard = ({
  row,
  onCardClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onDuplicate = () => {},
}) => {
  const { func, userDefined, desc, createdOn = "" } = row;

  // Build Type badges based on your FunctionTable logic
  const typeBadges = [];
  if (row.filter) typeBadges.push("Stock Filter");
  if (row.buysell) typeBadges.push("Trade Rule");
  if (row.entry || row.exit) typeBadges.push("Stock Entry & Exit");
  if (row.gentry || row.gexit) typeBadges.push("Global Entry & Exit");
  if (row.sort) typeBadges.push("Trade Sequence");
  if (row.psizing) typeBadges.push("Portfolio Sizing");
  if (row.utility) typeBadges.push("Utility");

  // Build Sub Type badges
  const subTypeBadges = [];
  if (row.filter && row.stockList) {
    subTypeBadges.push("Static");
  } else {
    subTypeBadges.push("Dynamic");
  }
  if (row.buysell) {
    subTypeBadges.push("Buy");
    subTypeBadges.push("Sell");
  }
  if (row.accountRule) subTypeBadges.push("Account");
  if (row.gentry) subTypeBadges.push("Global Entry");
  if (row.gexit) subTypeBadges.push("Global Exit");
  if (row.entry) subTypeBadges.push("Stock Entry");
  if (row.exit) subTypeBadges.push("Stock Exit");

  // Format createdOn date string
  const formattedCreatedOn = createdOn
    ? new Date(createdOn).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "-";

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
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            fontWeight={600}
            sx={{ cursor: "pointer" }}
            onClick={onCardClick}
            title={func}
          >
            {func}
          </Typography>
        </Box>

        {/* Details */}
        <Box className="space-y-2 p-2 overflow-auto">
          <Row
            label="Type:"
            value={
              <Box sx={{ display: "flex", gap: 1 }}>
                {!!typeBadges.length &&
                  typeBadges.map((label, idx) => (
                    <Badge key={`type-${idx}`} variant="version">
                      {label}
                    </Badge>
                  ))}
              </Box>
            }
          />
          <Row
            label="Sub Type:"
            value={
              <Box sx={{ display: "flex", gap: 1 }}>
                {!!subTypeBadges.length &&
                  subTypeBadges.map((label, idx) => (
                    <Badge key={`subtype-${idx}`} variant="version">
                      {label}
                    </Badge>
                  ))}
              </Box>
            }
          />
          <Row label="Created On:" value={formattedCreatedOn} />
          <Row label="Created By:" value={userDefined ? "User" : "System"} />
          <Row
            label="Description:"
            value={
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0px",
                  color: "#666666",
                }}
              >
                {desc}
              </Typography>
            }
          />
        </Box>
      </CardContent>

      {/* Actions Section */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box sx={{ display: "flex", gap: 1, marginBottom: 2, marginLeft: 1 }}>
          <ActionButton
            action="Duplicate"
            label="Duplicate"
            iconClass="ri-file-copy-line"
            textColor="#3D69D3"
            onClick={(e) => {
              e.preventDefault();
              onDuplicate(row);
            }}
          />

          {!!userDefined && (
            <>
              <ActionButton
                action="Edit"
                label="Edit Function"
                iconClass="ri-edit-line"
                textColor="#3D69D3"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(row);
                }}
              />
              <ActionButton
                action="Delete"
                label="Delete"
                iconClass="ri-delete-bin-line"
                textColor="red"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(row);
                }}
              />
            </>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default FunctionCard;
