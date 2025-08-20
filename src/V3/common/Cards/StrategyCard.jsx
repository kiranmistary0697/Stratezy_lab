/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import ActionButton from "../ActionButton";
import ActionMenu from "../DropDownButton";
import StrategyTimeline from "../../pages/Strategies/TimeLine/StrategyTimeline";
import Badge from "../Badge";

const StrategyCard = ({
  row,
  onToggleFavorite,
  onEdit,
  onDeploy,
  onBacktest,
  onDelete,
}) => {
  const {
    id,
    name,
    version,
    timestamp,
    complete,
    demo,
    favorite,
    strategy = {},
    backtestSummaryRes,
  } = row;

  const date = timestamp ? new Date(timestamp) : "";
  const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const isDraft = !complete;
  const isDeployDisabled = !complete || !backtestSummaryRes;

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
          <Typography variant="h6" fontWeight="600">
            {strategy?.name || name}
          </Typography>
          {!demo && (
            <IconButton onClick={() => onToggleFavorite(id)} size="small">
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
          <Badge variant="version">{version || "v1"}</Badge>
          {demo && <Badge variant="demo">Demo</Badge>}
          <Badge variant={complete ? "complete" : "draft"}>
            {complete ? "Complete" : "Draft"}
          </Badge>
        </Box>

        {/* Date */}
        <Typography variant="body2" color="textSecondary" mt={1}>
          Created On: {formattedDate}
        </Typography>

        {/* Description with Timeline Popup */}
        <Tooltip
          title={<StrategyTimeline strategy={row} />}
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: "white",
                color: "#000",
                borderRadius: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            mt={1}
            noWrap
            sx={{ cursor: "pointer" }}
          >
            Summary: {strategy?.description || "No description available"}
          </Typography>
        </Tooltip>
      </CardContent>

      {/* Actions Section */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box display="flex" gap={1}>
          {/* Backtest Button */}
          <ActionButton
            action="Backtest"
            label="Run Backtest"
            disabled={isDraft}
            iconClass="ri-play-line"
            textColor="#3D69D3"
            onClick={() => onBacktest(row)}
          />

          {/* Deploy Button */}
          <ActionButton
            action="Deploy"
            label="Deploy"
            disabled={isDeployDisabled}
            iconClass="ri-rocket-line"
            textColor="#3D69D3"
            onClick={() => onDeploy(row)}
          />
        </Box>

        {/* More Actions Menu */}
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
      </CardActions>
    </Card>
  );
};

export default StrategyCard;
