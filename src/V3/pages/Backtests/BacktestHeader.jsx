import { Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HeaderButton from "../../common/Table/HeaderButton";
import { BACKTEST_HEADER_TOOLTIP } from "../../../constants/CommonText";

const BacktestHeader = ({
  fetchAllData,
  handleCSVDownload = () => {},
  handleBacktestDelete = () => {},
  seletedRows = [],
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: { xs: 2, md: 0 },
        width: "100%",
        maxWidth: { xs: "100%", md: "100vw" },
      }}
    >
      {/* LEFT SIDE: Header + Tooltip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "flex-start", md: "flex-start" },
          mb: { xs: 2, md: 0 },
        }}
      >
        <Box component="div" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Backtests
        </Box>
        <Tooltip
          title={BACKTEST_HEADER_TOOLTIP}
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: 450,
                padding: "16px",
                background: "#FFFFFF",
                color: "#666666",
                boxShadow: "0px 8px 16px 0px #7B7F8229",
                fontFamily: "Inter",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
              },
            },
          }}
          placement="right-end"
        >
          <InfoOutlinedIcon
            sx={{
              color: "#666666",
              width: 17,
              height: 17,
              cursor: "pointer",
            }}
          />
        </Tooltip>
      </Box>

      {/* RIGHT SIDE: Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "flex-start", md: "flex-end" },
          flexWrap: "wrap",
        }}
      >
        {!!seletedRows.length && (
          <HeaderButton
            variant="error"
            onClick={handleBacktestDelete}
            sx={{
              width: { xs: "100%", sm: "auto" },
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            Delete Selected
          </HeaderButton>
        )}
        <HeaderButton
          variant="outlined"
          onClick={handleCSVDownload}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          Download CSV
        </HeaderButton>
        <HeaderButton
          variant="contained"
          onClick={fetchAllData}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          Refresh
        </HeaderButton>
      </Box>
    </Box>
  );
};

export default BacktestHeader;
