/* eslint-disable react/prop-types */
import { Box, Card, CardActions, CardContent } from "@mui/material";
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

const CommonCard = ({
  rows = {},
  showDelete = false,
  onDelete = () => {},
  onRowClick = () => {},
}) => {
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
          <Box
            className="space-y-2 p-2 overflow-auto"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick();
            }}
          >
            {Object.entries(rows).map(([key, value]) => {
              return <Row key={key} label={`${key}:`} value={value} />;
            })}
          </Box>
        </CardContent>
        {showDelete && (
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
          >
            <Box
              sx={{ display: "flex", gap: 1, marginBottom: 2, marginLeft: 1 }}
            >
              <ActionButton
                action="Delete"
                label="Delete"
                disabled={false}
                iconClass="ri-rocket-line"
                textColor="red"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
              />
            </Box>
          </CardActions>
        )}
      </Card>
    </div>
  );
};

export default CommonCard;
