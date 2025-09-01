/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme, useMediaQuery, IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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

    <Grid sx={{ flex: 1, minWidth: 0, }}>
      {React.isValidElement(value) ? (
        <Box sx={{ marginLeft: "8px" }}>{value}</Box>
      ) : (
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
  onCardClick = () => { },
  onEdit = () => { },
  onDelete = () => { },
  onDuplicate = () => { },
}) => {
  const { func, userDefined, desc, createdOn = "" } = row;
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
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

  // make whole card clickable + accessible
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCardClick?.();
    }
  };
  const stop = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-x-3 gap-y-1 sm:gap-y-2 text-sm text-gray-900">
      <Card
        onClick={onCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Open ${func} definition`}
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: 2,
          width: "100%",
          maxWidth: { xs: "100%", sm: 400 },
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Inter",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <CardContent>
          {/* Header Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600} sx={{ fontFamily: "Inter" }} title={func}>
              {func}
            </Typography>
          </Box>

          {/* Details */}
          <Box className="space-y-2 p-2 overflow-auto" sx={{ fontFamily: "Inter" }}>
            <Row
              label="Type:"
              value={
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                <Box
                  onClick={(e) => e.stopPropagation()} // don't trigger card navigation
                  sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "0px",
                      color: "#666666",
                      ...(isMobile && !expanded
                        ? {
                          display: "-webkit-box",
                          WebkitLineClamp: 4,        // tweak to 3/5/etc as you like
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }
                        : {}),
                    }}
                  >
                    {desc}
                  </Typography>
                  {isMobile && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded((v) => !v);
                      }}
                      sx={{ alignSelf: "flex-start", p: 0.25 }}
                      aria-label={expanded ? "Show less" : "Show more"}
                    >
                      {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  )}
                </Box>
              }
            />
          </Box>
        </CardContent>

        {/* Actions Section (do NOT trigger card click) */}
        <CardActions
          onClick={stop}
          onMouseDown={stop}
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 2, ml: 1 }}>
            <ActionButton
              action="Duplicate"
              label="Duplicate"
              iconClass="ri-file-copy-line"
              textColor="#3D69D3"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // <-- important
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
                    e.stopPropagation(); // <-- important
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
                    e.stopPropagation(); // <-- important
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
