import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../../common/CustomDatePicker";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";

import { useFormik } from "formik";
import Badge from "../../../common/Badge";

const CreateDeploy = ({
  isOpen,
  handleClose = () => {},
  title,
  buttonText,
  deployStrategy,
  fetchAllData = () => {},
}) => {
  const navigate = useNavigate();
  const [createDeploy] = usePostMutation();
  const [activeData] = useLazyGetQuery();

  const [getStrategyData] = useLazyGetQuery();
  const [getDeployData] = useLazyGetQuery();

  const [deploy, setDeploy] = useState(null);
  const [strategies, setStrategies] = useState([]);

  const brokerageOptions = [
    { name: "ZERODHA", symbol: "ZRD" },
    { name: "KOTAK", symbol: "KOT" },
    { name: "HDFC", symbol: "HDC" },
    { name: "ICICI", symbol: "ICI" },
    { name: "OTHER", symbol: "OTH" },
  ];

  // Fetch strategy data
  const fetchStrategies = async () => {
    try {
      const { data } = await getStrategyData({
        endpoint: "deploy/strategy/findall",
        tags: [tagTypes.GET_DEPLOY],
      }).unwrap();
      setStrategies(data || []);
    } catch (error) {
      console.error("Failed to fetch strategy data:", error);
    }
  };
  useEffect(() => {
    fetchStrategies();
  }, []);

  const updatedStrategies =
    strategies?.map((strategy, index) => ({
      id: index + 1,
      ...strategy,
    })) || [];

  // Initial values for Formik
  const initialValues = {
    selectedStock: deploy
      ? {
          id: deploy.id,
          name: deploy.name,
          symbol: deploy.symbol,
        }
      : null,
    selectedBrokerage: deploy
      ? brokerageOptions.find((b) => b.name === deploy.Brokerage) || null
      : null,
    amount: deploy?.amount || "",
    startDate: deploy?.createdOn || moment().format("DD/MM/YYYY"),
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const strategyName = deployStrategy?.name || values.selectedStock?.name;
        const exchange = "NSE";
        const brokerage = values.selectedBrokerage?.name || "";
        const version =
          deployStrategy?.version || values.selectedStock?.version;

        await createDeploy({
          endpoint: `strategy/deploy`,
          payload: {
            requestId: deployStrategy?.reqId || values.selectedStock?.reqId,
            version: deployStrategy?.version || values.selectedStock?.version,
            exchangeId: exchange,
            initialCapital: Number(values.amount),
            startDate: moment(values.startDate, "DD/MM/YYYY").toISOString(),
            strategyName,
            brokerage,
          },
          tags: [tagTypes.DEPLOY, tagTypes.GET_DEPLOY],
        }).unwrap();

        // setSuccessModalOpen(true);
        // fetchStrategies();

        await activeData({
          endpoint: `deploy/strategy/activate?name=${strategyName}&exchange=${exchange}&brokerage=${brokerage}&version=${version}&activate=true`,
          tags: [tagTypes.DEPLOY, tagTypes.GET_DEPLOY],
        }).unwrap();
        fetchAllData();
      } catch (error) {
        console.error("Failed to create or activate deployment:", error);
      } finally {
        handleClose();
        navigate("/Deploy");
      }
    },
  });

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent className="!p-[30px]">
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", gap: "30px", flexDirection: "column" }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "120%",
                letterSpacing: "0px",
                color: "#0A0A0A",
              }}
            >
              {title}
            </Typography>

            <Box sx={{ display: "flex", gap: "30px", flexDirection: "column" }}>
              {/* Strategy Name */}
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#0A0A0A",
                  }}
                >
                  Strategy Name
                </Typography>
                {deployStrategy?.name ? (
                  <TextField
                    size="small"
                    fullWidth
                    name="name"
                    value={deployStrategy?.name}
                    disabled
                    InputProps={{
                      endAdornment: deployStrategy.version && (
                        <Badge variant="version">
                          {deployStrategy?.version}
                        </Badge>
                      ),
                    }}
                  />
                ) : (
                  <Autocomplete
                    options={updatedStrategies}
                    /* 1️⃣  Tell MUI how to stringify an option  */
                    getOptionLabel={
                      (option) => option?.name ?? "" // plain name only
                    }
                    /* 2️⃣  Fancy dropdown list with badge  */
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <Box
                          display="flex"
                          alignItems="center"
                          // gap={2}
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography>{option.name}</Typography>
                          {option.version && (
                            <Badge variant="version">{option.version}</Badge>
                          )}
                        </Box>
                      </li>
                    )}
                    /* 3️⃣  Formik plumbing  */
                    value={formik.values.selectedStock || null}
                    onChange={(e, newValue) =>
                      formik.setFieldValue("selectedStock", newValue)
                    }
                    isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                    /* 4️⃣  Custom input field → name + badge, no duplicate string  */
                    renderInput={(params) => {
                      const selected = formik.values.selectedStock;
                      const { inputProps, ...restInputProps } =
                        params.inputProps;

                      return (
                        <TextField
                          {...params}
                          // placeholder="Select a Strategy"
                          /* Hide the raw string when something is selected */
                          inputProps={{
                            ...params.inputProps,
                            value: selected ? "" : params.inputProps.value, // empty when selected
                          }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: selected ? (
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                pl={1}
                              >
                                <Typography>{selected.name}</Typography>
                                {selected.version && (
                                  <Badge variant="version">
                                    {selected.version}
                                  </Badge>
                                )}
                              </Box>
                            ) : null,
                          }}
                        />
                      );
                    }}
                    size="small"
                    componentsProps={{
                      paper: {
                        sx: {
                          maxHeight: 200,
                          "& ul": {
                            maxHeight: 160,
                            overflowY: "auto",
                          },
                        },
                      },
                    }}
                  />
                )}
              </Box>

              {/* Initial Capital */}
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#0A0A0A",
                  }}
                >
                  Initial Capital
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                />
              </Box>

              {/* Deployment Date */}
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#0A0A0A",
                  }}
                >
                  Deployment Date
                </Typography>
                <CustomDatePicker
                  value={formik.values.startDate}
                  onChange={(val) => formik.setFieldValue("startDate", val)}
                />
              </Box>

              {/* Brokerage */}
              <Box
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    color: "#0A0A0A",
                  }}
                >
                  Brokerage
                </Typography>
                <Autocomplete
                  options={brokerageOptions}
                  getOptionLabel={(option) => option?.name || ""}
                  value={formik.values.selectedBrokerage}
                  onChange={(e, newValue) =>
                    formik.setFieldValue("selectedBrokerage", newValue)
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.symbol === value?.symbol
                  }
                  size="small"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select a Brokerage" />
                  )}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              className="px-5 py-4 w-full h-10 text-sm font-medium !text-white !bg-[#3D69D3] rounded-sm"
              sx={{ textTransform: "none" }}
            >
              {buttonText}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeploy;
