/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";

import ActionButton from "../ActionButton";
import Badge from "../Badge";

const Row = ({ label, value }) => (
  <Grid
    container
    alignItems="flex-start"
    sx={{ fontFamily: "Inter, sans-serif", mb: 1 }}
  >
    <Grid
      sx={{
        width: "100px",
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
          textAlign: "left",
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
          marginLeft: "4px",
        }}
      >
        :
      </Typography>
    </Grid>

    <Grid
      sx={{
        width: "230px",
      }}
    >
      {/* Check if value is a React element/JSX */}
      {React.isValidElement(value) ? (
        // If it's JSX, render it directly without wrapping in Typography
        <Box sx={{ marginLeft: "8px" }}>{value}</Box>
      ) : (
        // If it's a string, wrap it in Typography
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
      )}
    </Grid>
  </Grid>
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
          fontFamily: "Inter",
        }}
      >
        <CardContent>
          {/* Header Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontWeight={600}
              sx={{ cursor: "pointer", fontFamily: "Inter" }}
              onClick={onCardClick}
              title={func}
            >
              {func}
            </Typography>
          </Box>

          {/* Details */}
          <Box
            className="space-y-2 p-2 overflow-auto"
            sx={{ fontFamily: "Inter" }}
          >
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
    </div>
  );
};

export default FunctionCard;
