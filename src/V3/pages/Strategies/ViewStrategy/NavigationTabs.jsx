import { Tabs, Tab, Tooltip } from "@mui/material";
import { STRATEGY_DEFINITION_TAB_TOOLTIP } from "../../../../constants/CommonText";

const NavigationTabs = ({ value, onChange, tabs, selectedVersion }) => {  
  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((tab, index) => {
        const isDisabled = selectedVersion === "All Versions" && index === 0;

        const tabNode = (
          <Tab
            key={tab}
            label={tab}
            sx={{
              outline: "none",
              boxShadow: "none",
              textTransform: "none",
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "120%",
              letterSpacing: "0px",
              color: "#0A0A0A",
              "&.Mui-selected": {
                color: "#3D69D3",
              },
              "&:hover, &:active, &:focus": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          />
        );

        if (isDisabled) {
          return (
            <Tooltip
              key={tab}
              title={STRATEGY_DEFINITION_TAB_TOOLTIP}
              componentsProps={{
                tooltip: {
                  sx: {
                    fontFamily: "inherit",
                    fontWeight: 400,
                    fontSize: "14px",
                    width: 400,
                    height: 132,
                    gap: 10,
                    borderRadius: "2px",
                    padding: "16px",
                    background: "#FFFFFF",
                    color: "#666666",
                  },
                },
              }}
            >
              <Tab
                key={tab}
                label={tab}
                sx={{
                  outline: "none",
                  boxShadow: "none",
                  textTransform: "none",
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "120%",
                  letterSpacing: "0px",
                  color: isDisabled ? "#666666" : "#0A0A0A",
                  "&.Mui-selected": {
                    color: "#3D69D3",
                  },
                  "&:hover, &:active, &:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }}
              />
            </Tooltip>
          );
        }
        return tabNode;
      })}
    </Tabs>
  );
};

export default NavigationTabs;
