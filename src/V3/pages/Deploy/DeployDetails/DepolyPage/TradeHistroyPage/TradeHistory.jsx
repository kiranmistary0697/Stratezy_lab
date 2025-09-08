import { useRef, useState } from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TradeHistroyTable from "./TradeHistroyTable";
import HeaderButton from "../../../../../common/Table/HeaderButton";
import { CSVLink } from "react-csv";

const TradeHistory = ({ data = {} }) => {
  const csvLinkRef = useRef(null); // reference to CSVLink's internal link
  const tradeHistroyTableRef = useRef(null);
  const [csvData, setCsvData] = useState(null);
  const [query, setQuery] = useState("");

  const triggerDownload = () => {
    if (tradeHistroyTableRef.current) {
      const exportData = tradeHistroyTableRef.current.getCSVData();
      setCsvData(exportData);

      // Wait for state to update and render CSVLink
      setTimeout(() => {
        if (csvLinkRef.current && csvLinkRef.current.link) {
          csvLinkRef.current.link.click();
        }
      }, 0);
    }
  };

  return (
    <Box className="flex flex-col gap-6 w-full  max-md:gap-4 max-sm:gap-3 max-sm:p-2.5 max-sm:max-w-screen-sm">
      {/* Header Row */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Typography
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "120%",
            color: "#0A0A0A",
          }}
        >
          Trade History
        </Typography>

        {/* Search + Download */}
        <Box className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:items-center">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value || "")}
            fullWidth
            sx={{ maxWidth: { sm: 250 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <HeaderButton
            variant="outlined"
            onClick={triggerDownload}
            sx={{
              whiteSpace: "nowrap",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Download CSV
          </HeaderButton>

          {csvData && (
            <CSVLink
              data={csvData.datas}
              headers={csvData.visibleColumns?.map((col) => ({
                label: col.headerName,
                key: col.field,
              }))}
              filename={`${data?.name}_Trade_Histroy_data.csv`}
              separator={csvData.separator}
              enclosingCharacter={csvData.wrapColumnChar || '"'}
              className="hidden"
              target="_blank"
              ref={(r) => {
                if (r) csvLinkRef.current = r;
              }}
            />
          )}
        </Box>
      </Box>

      {/* Table Section */}
      <TradeHistroyTable
        ref={tradeHistroyTableRef}
        data={data}
        query={query}
        setCsvData={setCsvData}
      />
    </Box>
  );
};

export default TradeHistory;
