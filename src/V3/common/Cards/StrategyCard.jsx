/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  Grid,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import ActionButton from "../ActionButton";
import ActionMenu from "../DropDownButton";
import Badge from "../Badge";
import useDateTime from "../../hooks/useDateTime";

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
          whiteSpace: "nowrap",
          flex: 1,
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
        width: "200px",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "14px",
          color: "#666666",
          wordBreak: "break-word",
          marginLeft: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {value ?? "-"}
      </Typography>
    </Grid>
  </Grid>
);

const StrategyCard = ({
  row,
  onToggleFavorite,
  onCardClick,
  onEdit,
  onDeploy,
  onBacktest,
  onDelete,
}) => {
  const {
    id,
    name,
    version = "v1",
    timestamp,
    complete,
    demo,
    favorite,
    strategy = {},
    backtestSummaryRes,
  } = row;

  const isDraft = !complete;
  const isDeployDisabled = !complete || !backtestSummaryRes;

  // Precompute once per render
  const createdOn = useDateTime(timestamp);
  const title = strategy?.name || name;

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
        {/* Make the whole content area clickable; keep action buttons outside */}
        <CardActionArea
          component="div"
          onClick={() => onCardClick({ row })} // keep existing signature
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onCardClick({ row });
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <CardContent>
            {/* Header Section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ fontFamily: "Inter" }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                title={title}
                // clickable handled by CardActionArea
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  pr: 1,
                  fontFamily: "Inter",
                }}
              >
                {title}
              </Typography>

              {!demo && (
                <IconButton
                  size="small"
                  aria-label="Toggle favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleFavorite(id);
                  }}
                >
                  {favorite ? (
                    <StarIcon sx={{ color: "#FFD34E" }} />
                  ) : (
                    <StarBorderOutlinedIcon sx={{ color: "#666666" }} />
                  )}
                </IconButton>
              )}
            </Box>

            {/* Meta info */}
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
              <Badge variant="version">{version}</Badge>
              {demo && <Badge variant="demo">Demo</Badge>}
              <Badge variant={complete ? "complete" : "draft"}>
                {complete ? "Complete" : "Draft"}
              </Badge>
            </Box>

            {/* Details */}
            <Box className="space-y-4 p-3 sm:p-4">
              <Row label="Created On" value={createdOn} />
              <Row
                label="Summary"
                value={strategy?.description || "No description available"}
              />
            </Box>
          </CardContent>
        </CardActionArea>

        {/* Actions Section (NOT part of the clickable area) */}
        <CardActions
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
          onClick={(e) => e.stopPropagation()} // ensure clicks here don't bubble to card click
        >
          <Box display="flex" gap={1}>
            <ActionButton
              action="Backtest"
              label="Run Backtest"
              disabled={isDraft}
              iconClass="ri-play-line"
              textColor="#3D69D3"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onBacktest();
              }}
            />

            <ActionButton
              action="Deploy"
              label="Deploy"
              disabled={isDeployDisabled}
              iconClass="ri-rocket-line"
              textColor="#3D69D3"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDeploy();
              }}
            />
          </Box>

          {/* Wrap menu to prevent bubbling */}
          <Box onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              formik={row}
              id={name}
              name={name}
              desc={strategy.description}
              ver={version}
              isDeleteButton
              isDuplicateButton
              fetchAllData={() => {}}
              handleDelete={() => onDelete(row)}
              handleEdit={() => onEdit(row)}
              variant={complete ? "complete" : "draft"}
              demoStrategy={demo}
            />
          </Box>
        </CardActions>
      </Card>
    </div>
  );
};

export default StrategyCard;
