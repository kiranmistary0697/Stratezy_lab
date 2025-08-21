/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

import ActionButton from "../ActionButton";
import ActionMenu from "../DropDownButton";
import Badge from "../Badge";
import useDateTime from "../../hooks/useDateTime";

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
            variant="h6"
            fontWeight={600}
            sx={{ cursor: "pointer" }}
            onClick={() => onCardClick({ row })}
            title={strategy?.name || name}
          >
            {strategy?.name || name}
          </Typography>
          {!demo && (
            <IconButton
              onClick={() => onToggleFavorite(id)}
              size="small"
              aria-label="Toggle favorite"
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
        <Box className="space-y-4 p-3 sm:p-4 overflow-auto">
          <Row label="Created On:" value={useDateTime(timestamp)} />
          <Row
            label="Summary:"
            value={strategy?.description || "No description available"}
          />
        </Box>
      </CardContent>

      {/* Actions Section */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
      >
        <Box display="flex" gap={1}>
          <ActionButton
            action="Backtest"
            label="Run Backtest"
            disabled={isDraft}
            iconClass="ri-play-line"
            textColor="#3D69D3"
            onClick={(e) => {
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
              e.preventDefault();
              onDeploy();
            }}
          />
        </Box>

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
