import React from "react";
import { Tooltip, Typography } from "@mui/material";

import Grid from "@mui/material/Grid";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Strategies = () => {
  return (
    <div className="p-8 space-y-4">
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={8} display="flex" alignItems="center" gap={1}>
          <Typography className="subheader">Strategy</Typography>
          <Tooltip
            title="A trading strategy is a systematic plan that outlines step-by-step actions to leverage market opportunities while managing risks. It includes clear entry, execution, and exit points tailored to achieve specific financial objectives."
            componentsProps={{
              tooltip: {
                sx: {
                  width: 400,
                  height: 132,
                  gap: 10,
                  borderRadius: "16px",
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#0A0A0A",
                },
              },
            }}
          >
            <InfoOutlinedIcon sx={{ color: "#0A0A0A" }} />
          </Tooltip>
        </Grid>

        <Grid
          item
          xs={12}
          sm={4}
          display="flex"
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
        ></Grid>
      </Grid>
    </div>
  );
};

export default Strategies;
