import React, { useEffect, useState } from "react";
import { Box, Divider, Grid2, useTheme } from "@mui/material";
import CreateFunctionHeader from "./CreateFunction/CreateFunctionHeader";
import FunctionSelect from "./CreateFunction/FunctionSelect";
import KeywordSearch from "./CreateFunction/KeywordSearch";
import EditorFunction from "./CreateFunction/EditorFunction";

import VerfiyStockModal from "./CreateFunction/VerfiyStockModal";
import { useLocation } from "react-router-dom";

import useLabTitle from "../../hooks/useLabTitle";
import { useLazyGetQuery, usePostMutation } from "../../../slices/api";
import { tagTypes } from "../../tagTypes";
import {
  FUNCTION_SUB_TITLE,
  FUNCTION_SUB_TITLE_BUTTON,
  FUNCTION_SUB_TITLE_TOOLTIP,
  FUNCTION_TITLE,
  FUNCTION_TITLE_BUTTON,
  FUNCTION_TITLE_TOOLTIP,
  VERIFY_STOCK_TITLE,
  VERIFY_STOCK_TOOLTIP,
} from "../../../constants/CommonText";
import moment from "moment";
import VerifyOnStock from "./CreateFunction/VerifyOnStock";
import Plot from "react-plotly.js";
import AddFunctionModal from "./CreateFunction/AddFunctionModal";

const CreateFunction = () => {
  useLabTitle("Dev Studio");
  const theme = useTheme();

  const [getKeywords] = useLazyGetQuery();
  const [getStrategyData] = useLazyGetQuery();
  const [verifyStock] = usePostMutation();

  const [openStockModal, setOpenStockModal] = useState(false);
  const { search, state } = useLocation();
  const [stockList, setStockList] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState({});
  const [internalData, setInternalData] = useState(null);
  const [openAddFunctionModal, setOpenAddFunctionModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  //yyyy-mm-dd

  const queryParams = new URLSearchParams(search);

  const id = queryParams.get("name");

  const startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
  const endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
  const selectedSymbol = selectedStock?.symbol;

  //stock-analysis-function/abcggg

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getKeywords({
          endpoint: `stock-analysis-function/keywords`,
          tags: [tagTypes.GET_KEYWORDS],
        }).unwrap();
        setKeywordData(data);
      } catch (error) {
        console.error("Failed to fetch keywords:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // setIsLoading(true);
        const { data } = await getStrategyData({
          endpoint: "command/backtest/equitylist?exchange=nse",
          tags: [tagTypes.GET_STOCK],
        }).unwrap();
        setStockList(data);
      } catch (error) {
        console.error("Failed to fetch all data:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleVerifyStock = async ({ xAxis, yAxis }) => {
    try {
      const { data } = await verifyStock({
        endpoint: `command/chart/request`,
        payload: {
          exchange: "nse",
          zeroDate: endDate,
          ndate: startDate,
          symbol: selectedSymbol,
          chartRule: {
            ruleType: "CHART_RULE",
            ruleSubType: "CUSTOM_RULE",
            customRule: "{c = close(); return c;}",
          },
          varList1: xAxis,
          varList2: yAxis,
        },

        tags: [tagTypes.VERIFY_STOCK],
      }).unwrap();

      const dataMap = data["chartResMap"];
      const preparedData = prepareData(dataMap);
      setInternalData(preparedData);
      setOpenStockModal(false);
    } catch (error) {
      console.error("Failed to verify stock:", error);
    }
  };

  const prepareData = (dataMap) => {
    const seriesData = [];
    for (const seriesName in dataMap) {
      const chartRes = dataMap[seriesName];

      const valueMap = chartRes["valueMap"];

      let dateValueArray = [];
      for (const dateStr in valueMap) {
        const value = valueMap[dateStr];
        try {
          const date = new Date(dateStr);
          if (!isNaN(date)) {
            dateValueArray.push({ date, value });
          } else {
            console.warn(`Skipping invalid date format: ${dateStr}`);
          }
        } catch (error) {
          console.warn(`Skipping invalid date format: ${dateStr}`);
        }
      }

      dateValueArray.sort((a, b) => a.date - b.date);
      const dates = dateValueArray.map((item) => item.date);
      const values = dateValueArray.map((item) => item.value);

      if (dates.length && values.length) {
        const df = {
          Date: dates,
          Value: values,
          Series: seriesName,
          ChartType: chartRes["chartType"]
            ? chartRes["chartType"].toLowerCase()
            : "line",
          YAxis: chartRes["yaxis"] ? chartRes["yaxis"].toLowerCase() : "y1",
        };
        seriesData.push(df);
      }
    }
    return seriesData.length ? seriesData : [];
  };

  const generatePlot = () => {
    if (!internalData || internalData.length === 0) {
      return null;
    }

    const colors = theme.palette.chartColors || [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];

    const markerStyles = ["circle", "square", "diamond", "cross", "x"];
    const lineDashStyles = ["solid", "dash", "dot", "dashdot"];

    const traces = [];

    internalData.forEach((seriesData, i) => {
      const {
        Date: dates,
        Value: values,
        Series: series,
        ChartType: chartType,
        YAxis: yAxis,
      } = seriesData;
      const markerStyle = markerStyles[i % markerStyles.length];
      const lineDash = lineDashStyles[i % lineDashStyles.length];
      const color = colors[i % colors.length];
      const yaxis = yAxis === "y2" ? "y2" : "y";

      let trace = {
        x: dates,
        y: values,
        name: series,
        type: "scatter",
        mode: chartType === "line" ? "lines+markers" : "lines",
        line: {
          width: 2,
          dash: lineDash,
          color: color,
        },
        marker: {
          symbol: markerStyle,
          size: 6,
          color: color,
        },
        yaxis: yaxis,
      };
      if (chartType === "area") {
        trace.fill = "tozeroy";
        trace.mode = "lines";
      }

      traces.push(trace);
    });

    const y1Range = internalData
      .filter((series) => series.YAxis === "y1")
      .map((series) => series.Value);
    const y2Range = internalData
      .filter((series) => series.YAxis === "y2")
      .map((series) => series.Value);

    const y1Min = y1Range.length ? Math.min(...y1Range.flat()) : 0;
    const y1Max = y1Range.length ? Math.max(...y1Range.flat()) : 1;
    const y2Min = y2Range.length ? Math.min(...y2Range.flat()) : 0;
    const y2Max = y2Range.length ? Math.max(...y2Range.flat()) : 1;

    const layout = {
      xaxis: {
        title: "Date",
        showline: true,
        showgrid: false,
        zeroline: true,
        showticklabels: true,
        showspikes: true,
        spikemode: "across",
        spikesnap: "cursor",
        spikedash: "solid",
        spikethickness: 1,
        spikecolor: theme.palette.divider,
        hoverformat: "%Y-%m-%d",
      },
      yaxis: {
        title: "Primary Y-Axis",
        range: [y1Min, y1Max],
        showgrid: true,
        autorange: false,
        showline: true,
        showticklabels: true,
      },
      yaxis2: {
        title: "Secondary Y-Axis",
        range: [y2Min, y2Max],
        overlaying: "y",
        side: "right",
        showgrid: false,
        autorange: false,
        showline: true,
        showticklabels: true,
      },
      template: theme.palette.mode === "dark" ? "plotly_dark" : "plotly_white",
      hovermode: "x unified",
      autosize: true,
      //height: fullScreen ? window.innerHeight - theme.spacing(12) : 600,
      margin: {
        l: theme.spacing(0),
        r: theme.spacing(0),
        b: theme.spacing(0),
        t: theme.spacing(0),
      },
    };

    return { traces, layout };
  };

  const { traces = [], layout = {} } = generatePlot() || {};

  return (
    <>
      {openStockModal && (
        <VerfiyStockModal
          isOpen={openStockModal}
          handleClose={() => {
            setOpenStockModal(false);
          }}
          title={"Verify on a Stock"}
          stockList={stockList}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          handleVerifyStock={handleVerifyStock}
        />
      )}
      {openAddFunctionModal && (
        <AddFunctionModal
          isOpen={openAddFunctionModal}
          handleClose={() => {
            setOpenAddFunctionModal(false);
          }}
          // onSave={handleSaveFunction}
          // isSaving={isSaving}
          selectedFunction={selectedFunction}
          title={"Create Function"}
        />
      )}

      <div className="sm:h-[calc(100vh-100px)] bg-[#f0f0f0]  overflow-auto p-8">
        <div className="bg-white h-auto">
          <CreateFunctionHeader
            title={FUNCTION_TITLE}
            buttonText={FUNCTION_TITLE_BUTTON}
            tooltip={FUNCTION_TITLE_TOOLTIP}
          />

          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <FunctionSelect setSelectedFunction={setSelectedFunction} />
          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <CreateFunctionHeader
            title={FUNCTION_SUB_TITLE}
            tooltip={FUNCTION_SUB_TITLE_TOOLTIP}
            buttonText={FUNCTION_SUB_TITLE_BUTTON}
            handleChange={() => {
              setOpenStockModal(true);
            }}
            isFunction
            systemDefine={true}
          />
          <Grid2
            container
            spacing={2}
            className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200 "
          >
            <Grid2
              // className="md:border-r md:border-r-zinc-200"
              item
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <KeywordSearch keywordData={keywordData} />
            </Grid2>
            <Grid2
              item
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              <EditorFunction />
            </Grid2>

            {/* Stock Bundle Step - Full Width on Small Screens, Half on Medium+, 6.7/12 on Large+ */}
          </Grid2>
          {internalData && (
            <>
              <CreateFunctionHeader
                title={VERIFY_STOCK_TITLE}
                tooltip={VERIFY_STOCK_TOOLTIP}
                buttonText={"Continue to save"}
                isVerify
                handleChange={() => {
                  setOpenAddFunctionModal(true);
                }}
                // systemDefine={stockData?.userDefined}
                // id={id}
              />
              <Grid2
                container
                spacing={2}
                className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200"
              >
                <Grid2
                  className="md:border-r md:border-r-zinc-200"
                  item
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 4,
                  }}
                >
                  <VerifyOnStock
                    // title="Verify on Stock"
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    stockList={stockList}
                    selectedStock={selectedStock}
                    setSelectedStock={setSelectedStock}
                  />
                </Grid2>
                <Grid2
                  item
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 8,
                  }}
                >
                  <Box sx={{ width: "100%", height: 600 }}>
                    <Plot
                      data={traces}
                      layout={layout}
                      config={{
                        responsive: true,
                        displayModeBar: false,
                        displaylogo: false,
                      }}
                      useResizeHandler
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>
                  {/* <CapitalChart selectedOption={"capital"} /> */}
                </Grid2>
              </Grid2>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateFunction;
