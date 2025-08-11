import { useState } from "react";
import { Box, TextField, Tooltip, Typography } from "@mui/material";
import KeywordItem from "./KeywordItem";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  FUNCTION_TOOLTIP_TITLE,
  PRIMITIVES_TOOLTIP,
} from "../../../../constants/CommonText";

const KeywordSearch = ({
  keywordData = [],
  fullHeight = false,
  isFunction = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredKeywords = keywordData.filter((keyword) => {
    const searchValue = searchTerm.toLowerCase();

    const name = (keyword.name || "").toLowerCase();
    const caption = (keyword.caption || "").toLowerCase();
    const func = (keyword.func || "").toLowerCase();
    const shortFuncName = (keyword.shortFuncName || "").toLowerCase();
    const desc = (keyword.desc || "").toLowerCase();

    return (
      name.includes(searchValue) ||
      caption.includes(searchValue) ||
      func.includes(searchValue) ||
      shortFuncName.includes(searchValue) ||
      desc.includes(searchValue)
    );
  });

  return (
    <Box className="flex flex-col py-5 border-t border-b border-l border-zinc-200 mb-2">
      <Box className="flex gap-2.5 justify-center items-center">
        <div className="text-[16px] font-semibold leading-tight text-neutral-950">
          {isFunction ? "Functions" : "Primitives"}
        </div>
        <Tooltip
          title={isFunction ? FUNCTION_TOOLTIP_TITLE : PRIMITIVES_TOOLTIP}
          placement="right-end"
          componentsProps={{
            tooltip: {
              sx: {
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
        >
          <InfoOutlinedIcon
            sx={{
              color: "#666666",
              width: "17px",
              height: "17px",
              cursor: "pointer",
            }}
          />
        </Tooltip>
      </Box>

      <Box className="flex flex-col w-full text-sm leading-none text-stone-500">
        <TextField
          variant="outlined"
          placeholder={isFunction ? "Search Function" : "Search Primitives"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className="w-full"
          sx={{ px: 2, py: 1, borderRadius: 1, backgroundColor: "white" }}
        />
      </Box>

      <Box
        className="flex flex-col w-full pl-2 mt-3"
        sx={{ height: fullHeight ? 650 : 400 }}
      >
        <Box
          className="flex-1 min-w-[240px]"
          sx={{
            overflowY: "auto",
            cursor: "pointer",
          }}
        >
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map((keyword, index) => (
              <KeywordItem key={index} {...keyword} isFunction={isFunction} />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No keywords found.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default KeywordSearch;
