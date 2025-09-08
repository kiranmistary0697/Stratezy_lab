import { useEffect, useRef, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HoldingsTable from "./HoldingsTable";
import { CSVLink } from "react-csv";
import HeaderButton from "../../../../../common/Table/HeaderButton";
import { useLazyGetQuery } from "../../../../../../slices/api";
import { tagTypes } from "../../../../../tagTypes";

const Holdings = ({ data }) => {
  const { name, exchange, brokerage, version } = data;
  const [getHoldingsData] = useLazyGetQuery();
  const [csvData, setCsvData] = useState(null);
  const [query, setQuery] = useState("");
  const [holdData, setHoldData] = useState([]);
  const [loading, setLoading] = useState(false);

  const csvLink = useRef(null);
  const tradeTableRef = useRef(null);

  useEffect(() => {
    const fetchDeployData = async () => {
      setLoading(true);
      try {
        const { data } = await getHoldingsData({
          endpoint: `deploy/strategy/viewall?name=${name}&exchange=${exchange}&brokerage=${brokerage}&version=${version}`,
          tags: [tagTypes.GET_HOLDINGS],
        }).unwrap();
        setHoldData(data);
      } catch (error) {
        console.error("Failed to fetch deploy data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployData();
  }, []);

  const triggerDownload = () => {
    if (csvLink.current) {
      csvLink.current.link.click();
    }
  };

  useEffect(() => {
    if (tradeTableRef.current) {
      setCsvData(tradeTableRef.current.getCSVData());
    }
  }, [holdData, query]);

  return (
    <Box className="flex flex-col gap-6 w-full p-4 max-md:gap-4 max-sm:gap-3 max-sm:p-2.5 max-sm:max-w-screen-sm">
      {/* Header */}
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        {/* Title */}
        <Box
          sx={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "20px",
            color: "#0A0A0A",
          }}
        >
          Holdings
        </Box>

        {/* Controls */}
        <Box className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:items-center">
          {/* Search */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value || "")}
            sx={{ width: "100%", minWidth: { sm: 180 }, maxWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Download Button */}
          <HeaderButton
            variant="outlined"
            onClick={triggerDownload}
            sx={{
              width: { xs: "100%", sm: "auto" },
              whiteSpace: "nowrap",
            }}
          >
            Download CSV
          </HeaderButton>

          {/* Hidden CSV Link */}
          {csvData && (
            <CSVLink
              data={csvData?.datas}
              filename={`${name}_Holdings_data.csv`}
              // filename={{name} + ".csv"}
              separator={csvData?.separator}
              wrapcolumnchar={csvData?.wrapColumnChar}
              className="hidden"
              ref={csvLink}
              target="_blank"
            />
          )}
        </Box>
      </Box>

      {/* Table */}
      <HoldingsTable
        ref={tradeTableRef}
        data={data}
        query={query}
        rows={holdData}
        isLoading={loading}
      />
    </Box>
  );
};

export default Holdings;
