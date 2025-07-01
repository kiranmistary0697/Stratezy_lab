"use client";
import React from "react";
import { Select, MenuItem, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { countries } from "../../V3/common/countryData";

const FlagImage = styled("img")({
  width: 20,
  height: 14,
  objectFit: "cover",
});

const CountryCode = styled(Typography)({
  fontSize: "14px",
  fontWeight: 500,
  color: "#666",
  fontFamily: "Inter, sans-serif",
});

// Custom select with no border/outline
const NoBorderSelect = styled(Select)({
  backgroundColor: "transparent",
  boxShadow: "none",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  paddingLeft: 0,
  paddingRight: 0,
  height: "30px",
  minWidth: "80px",
});

const LanguageDropdown = () => {
  const [selectedCountry, setSelectedCountry] = React.useState("IN");

  const handleChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const selectedCountryData = countries.find(
    (country) => country.code === selectedCountry
  );

  return (
    <NoBorderSelect
      value={selectedCountry}
      onChange={handleChange}
      variant="outlined"
      displayEmpty
      renderValue={() => (
        <Box display="flex" alignItems="center" gap={1}>
          <FlagImage src={selectedCountryData?.flag} alt="flag" />
          <CountryCode>{selectedCountryData?.code}</CountryCode>
        </Box>
      )}
    >
      {countries.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          <Box display="flex" alignItems="center" gap={1}>
            <FlagImage src={country.flag} alt="flag" />
            <Typography variant="body2">
              {country.name} ({country.code})
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </NoBorderSelect>
  );
};

export default LanguageDropdown;
