import { useState } from "react";
import { Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLabTitle from "../../hooks/useLabTitle";

import HeaderButton from "../../common/Table/HeaderButton";
import FunctionTable from "./FunctionTable";
import { useNavigate } from "react-router";
import { FUNCTION_TOOLTIP_TITLE } from "../../../constants/CommonText";

const gobalFunction = () => {
  const navigate = useNavigate();

  useLabTitle("Global Functions");

  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4 h-full sm:h-[calc(100vh-100px)] overflow-auto p-4 sm:p-8">
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Title and tooltip */}
        <Grid display="flex" alignItems="center" gap={1}>
          <div className="font-semibold text-xl">Functions</div>
          <Tooltip
            title={FUNCTION_TOOLTIP_TITLE}
            componentsProps={{
              tooltip: {
                sx: {
                  width: "300px",
                  maxWidth: "90vw",
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#666666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0%",
                },
              },
            }}
            placement="right-end"
          >
            <InfoOutlinedIcon
              sx={{ color: "#666666", width: "17px", height: "17px" }}
            />
          </Tooltip>
        </Grid>

        {/* Search and Button */}
        <Grid>
          <div className="flex  gap-3 w-full">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search"
              className="w-full sm:w-auto"
              value={query}
              onChange={(e) => setQuery(e.target.value || "")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <HeaderButton
              variant="contained"
              className="w-full sm:w-auto"
              onClick={() => {
                localStorage.removeItem("argsData");
                localStorage.removeItem("editorFunctionCode");
                localStorage.removeItem("selectedValues");
                localStorage.removeItem("selectedTypes");

                navigate("/Devstudio/create-function");
              }}
            >
              Create Function
            </HeaderButton>
          </div>
        </Grid>
      </Grid>

      {/* Function table */}
      <FunctionTable query={query} />
    </div>
  );
};

export default gobalFunction;
