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
import EditorFunctionModal from "../Strategies/Modal/EditorFunctionModal";

const CreateFunction = () => {
  useLabTitle("Dev Studio");
  const theme = useTheme();

  const [getKeywords] = useLazyGetQuery();
  const [getStrategyData] = useLazyGetQuery();
  const [verifyStock] = usePostMutation();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [isSaving, setIsSaving] = useState(false);
  const [openStockModal, setOpenStockModal] = useState(false);
  const { search, state } = useLocation();
  const [stockList, setStockList] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState({});
  const [internalData, setInternalData] = useState(null);
  const [openAddFunctionModal, setOpenAddFunctionModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: oneMonthAgo,
    endDate: new Date(),
    key: "selection",
  });
  const [xAxisInput, setXAxisInput] = useState("");
  const [yAxisInput, setYAxisInput] = useState("");
  const [code, setCode] = useState("");
  const [triggerVerify, setTriggerVerify] = useState(false);

  //yyyy-mm-dd
  const [argsData, setArgsData] = useState([{ name: "", value: "" }]);
  const [isFunctionDialogOpen, setIsFunctionDialogOpen] = useState(false);

  const handleAddArgsData = () => {
    const modifiedArgsData = [...argsData, { name: "", value: "" }];
    setArgsData(modifiedArgsData);
    localStorage.setItem("argsData", JSON.stringify(modifiedArgsData));
  };

  const handleDeleteArgsData = (index) => {
    const deletedData = argsData.filter((_, i) => index !== i);
    setArgsData(deletedData);
    localStorage.setItem("argsData", JSON.stringify(deletedData));
  };

  const handleArgsDataChange = (index, field, value) => {
    const modifiedArgsData = argsData.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setArgsData(modifiedArgsData);
    localStorage.setItem("argsData", JSON.stringify(modifiedArgsData));
  };



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

  useEffect(() => {
    const previousArgsData = localStorage.getItem("argsData");
    if (previousArgsData) {
      setArgsData(JSON.parse(previousArgsData));
    }
  }, []);

  const handleVerifyStock = async ({ xAxis, yAxis }) => {
    setIsSaving(true);
    try {
      const argsDataValue = argsData
        .map((data) => (data.value.trim() !== "" ? Number(data.value) : null))
        .filter((data) => data !== null && !isNaN(data));

      const verifyStockPayload = {
        endpoint: `command/chart/request`,
        payload: {
          exchange: "nse",
          zeroDate: endDate,
          ndate: startDate,
          symbol: selectedSymbol,
          chartRule: {
            ruleType: "CHART_RULE",
            ruleSubType: "CUSTOM_RULE",
            customRule: code,
            funcArgs: argsDataValue,
          },
          varList1: xAxis,
          varList2: yAxis,
        },

        tags: [tagTypes.VERIFY_STOCK],
      };

      const { data } = await verifyStock(verifyStockPayload).unwrap();

      const dataMap = data["chartResMap"];
      const preparedData = prepareData(dataMap);
      setInternalData(preparedData);
      setOpenStockModal(false);
    } catch (error) {
      console.error("Failed to verify stock:", error);
    } finally {
      setIsSaving(false);
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
          title="Verify Stock"
          isOpen={openStockModal}
          handleClose={() => setOpenStockModal(false)}
          stockList={stockList}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          xAxisInput={xAxisInput}
          setXAxisInput={setXAxisInput}
          yAxisInput={yAxisInput}
          setYAxisInput={setYAxisInput}
          handleVerifyStock={handleVerifyStock}
          isSaving={isSaving}
        />
      )}
      {openAddFunctionModal && (
        <AddFunctionModal
          isOpen={openAddFunctionModal}
          handleClose={() => {
            setOpenAddFunctionModal(false);
          }}
          code={code}
          selectedFunction={selectedFunction}
          title={"Create Function"}
          argsData={argsData}
        />
      )}

      {isFunctionDialogOpen && (
        <EditorFunctionModal
          isOpen={isFunctionDialogOpen}
          handleClose={() => setIsFunctionDialogOpen(false)}
          code={code}
          setCode={setCode}
          argsData={argsData}
          handleAddArgsData={handleAddArgsData}
          handleDeleteArgsData={handleDeleteArgsData}
          handleArgsDataChange={handleArgsDataChange}
          setIsFunctionDialogOpen={setIsFunctionDialogOpen}
          keywordData={keywordData}
        />
      )}

      <div className="sm:h-[calc(100vh-100px)] bg-[#f0f0f0]  overflow-auto p-6">
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
              <KeywordSearch keywordData={keywordData} fullHeight={false} />
            </Grid2>
            <Grid2
              item
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              <EditorFunction
                code={code}
                setCode={setCode}
                argsData={argsData}
                handleAddArgsData={handleAddArgsData}
                handleDeleteArgsData={handleDeleteArgsData}
                handleArgsDataChange={handleArgsDataChange}
                setIsFunctionDialogOpen={setIsFunctionDialogOpen}
              />
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
                handleVerify={() => {
                  setTriggerVerify(true); // ✅ Triggers VerifyOnStock effect
                }}
                isSaving={isSaving}
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
                    stockList={stockList}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    selectedStock={selectedStock}
                    setSelectedStock={setSelectedStock}
                    xAxisInput={xAxisInput}
                    setXAxisInput={setXAxisInput}
                    yAxisInput={yAxisInput}
                    setYAxisInput={setYAxisInput}
                    handleVerifyStock={handleVerifyStock}
                    isSaving={isSaving}
                    triggerVerify={triggerVerify}
                    setTriggerVerify={setTriggerVerify}
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
