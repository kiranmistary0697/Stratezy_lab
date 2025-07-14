import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLazyGetQuery, usePostMutation } from "../../../../slices/api";
import { useLocation, useNavigate } from "react-router-dom";
import { tagTypes } from "../../../tagTypes";

import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import VerifyOnStock from "./VerifyOnStock";
import EditHeader from "./EditHeader";
import FunctionSelect from "./FunctionSelect";
import CreateFunctionHeader from "./CreateFunctionHeader";
import KeywordSearch from "./KeywordSearch";
import EditorFunction from "./EditorFunction";
import VerfiyStockModal from "./VerfiyStockModal";

import {
  FUNCTION_SUB_TITLE,
  FUNCTION_SUB_TITLE_TOOLTIP,
  VERIFY_STOCK_TITLE,
  VERIFY_STOCK_TOOLTIP,
} from "../../../../constants/CommonText";
import AddFunctionModal from "./AddFunctionModal";
import moment from "moment";
import Plot from "react-plotly.js";
import EditorFunctionModal from "../../Strategies/Modal/EditorFunctionModal";
import DeleteModal from "../../../common/DeleteModal";
import { useRouterBlocker } from "../../../hooks/useRouterBlocker";
import WarningPopupModal from "../../Strategies/CreateStratezy/WarningPopupModal";
import CommonModal from "./CommonModal";

import FullscreenIcon from "@mui/icons-material/Fullscreen";

const EditFunction = () => {
  const theme = useTheme();

  const [getStockDetails] = useLazyGetQuery();
  const [getKeywords] = useLazyGetQuery();
  const [getStrategyData] = useLazyGetQuery();
  const [verifyStock] = usePostMutation();

  const { search, state } = useLocation();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [openStockModal, setOpenStockModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stockData, setStockData] = useState({});
  const [keywordData, setKeywordData] = useState([]);
  const [editUserData, setEditUserData] = useState(false);
  const [openAddFunctionModal, setOpenAddFunctionModal] = useState(false);
  const [stockList, setStockList] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [internalData, setInternalData] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState({});
  const [startDate, setStartDate] = useState(
    moment().subtract(1, "month").format("DD/MM/YYYY")
  );
  const [endDate, setEndDate] = useState(moment().format("DD/MM/YYYY"));

  const [xAxisInput, setXAxisInput] = useState("");
  const [yAxisInput, setYAxisInput] = useState("");
  const [code, setCode] = useState("");
  const [triggerVerify, setTriggerVerify] = useState(false);
  const [argsData, setArgsData] = useState([{ name: "", value: "" }]);
  const [isFunctionDialogOpen, setIsFunctionDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteFunctionName, setDeleteFunctionName] = useState({});
  const [isFullGraphOpen, setIsFullGraphOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { showPrompt, confirmNavigation, cancelNavigation } = useRouterBlocker({
    when: isDirty,
  });

  const [deleteData] = useLazyGetQuery();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("name");
  const isDuplicate = queryParams.get("duplicate");

  const selectedSymbol = selectedStock?.symbol;

  //stock-analysis-function/abcggg stock-analysis-function/keywords

  const combineAdescArgs = (data) => {
    const { adesc = [], args = [] } = data;

    return adesc.map((name, index) => ({
      name,
      value: Number(args[index]), // convert string "25" → number 25
    }));
  };

  const handleStockAnalysis = async () => {
    try {
      const { data } = await getStockDetails({
        endpoint: `stock-analysis-function/${id}`,
        tags: [tagTypes.GET_SELECTDATA],
      }).unwrap();
      setArgsData(combineAdescArgs(data));

      setStockData(data);
    } catch (error) {}
  };
  const handleKeywords = async () => {
    try {
      const { data } = await getKeywords({
        endpoint: `stock-analysis-function/keywords`,
        tags: [tagTypes.GET_KEYWORDS],
      }).unwrap();

      setKeywordData(data);
    } catch (error) {}
  };

  const handleDeleteFunction = async () => {
    setDeleteFunctionName(stockData.func);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await deleteData({
        endpoint: `stock-analysis-function/delete/${deleteFunctionName}`,
        tags: [tagTypes.GET_FILTERTYPE],
      }).unwrap();

      if (data.success) {
        toast.success(data.message);
        navigate(`/Globalfunctions`);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleDuplicate = () => {
    if (!stockData || !stockData.func) {
      toast.error("No function data available to duplicate");
      return;
    }
    setEditUserData(true);

    navigate(
      `/Devstudio/edit-function?name=${stockData.shortFuncName}&duplicate=true`
    );
  };

  useEffect(() => {
    if (id) {
      handleStockAnalysis();
      handleKeywords();
    }
  }, [id]);

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
    if (stockData?.userDefined) {
      setEditUserData(true);
    }
  }, [stockData]);

  const handleVerifyStock = async ({ xAxis, yAxis }) => {
    setIsSaving(true);
    try {
      const argsDataValue = argsData
        .map((data) =>
          String(data.value).trim() !== "" ? Number(data.value) : null
        )
        .filter((data) => data !== null && !isNaN(data));

      const verifyStockPayload = {
        endpoint: `command/chart/request`,
        payload: {
          exchange: "nse",
          zeroDate: moment(endDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          ndate: moment(startDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
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

      if (data?.error) {
        toast.error(data.message);
        throw new Error(data.message);
      }

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

  const handleAddArgsData = () => {
    setIsDirty(true);
    setArgsData((pre) => [...pre, { name: "", value: "" }]);
  };

  const handleDeleteArgsData = (index) => {
    setIsDirty(true);
    const deletedData = argsData.filter((_, i) => index !== i);
    setArgsData(deletedData);
  };

  const handleArgsDataChange = (index, field, value) => {
    setIsDirty(true);
    setArgsData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
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
        showticklabels: false,
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
  useEffect(() => {
    if (stockData?.rule) {
      setCode(stockData.rule);
    }
  }, [stockData]);

  return (
    <>
      {openStockModal && (
        <VerfiyStockModal
          title="Verify Stock"
          isOpen={openStockModal}
          handleClose={() => setOpenStockModal(false)}
          stockList={stockList}
          startDate={startDate}
          setStartDate={(e) => {
            setStartDate(e);
          }}
          endDate={endDate}
          setEndDate={(e) => {
            setEndDate(e);
          }}
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
          selectedFunction={selectedFunction}
          code={code}
          stockData={stockData}
          title={"Create Function"}
          isDuplicate={isDuplicate}
          argsData={argsData}
          setIsDirty={setIsDirty}
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
          editUserData={!editUserData}
          stockData={stockData}
          isNewFuncOrDuplicate={isDuplicate}
          setIsDirty={setIsDirty}
        />
      )}

      <div className="sm:h-[calc(100vh-100px)] bg-[#f0f0f0]  overflow-auto p-8">
        <div className="bg-white h-auto">
          <EditHeader
            stockData={stockData}
            setEditUserData={setEditUserData}
            editUserData={editUserData}
            isDuplicate={isDuplicate}
            handleDelete={handleDeleteFunction}
            handleDuplicate={handleDuplicate}
            handleChange={() => setOpenAddFunctionModal(true)}
          />

          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <FunctionSelect
            stockData={stockData}
            editUserData={editUserData}
            id={id}
            setSelectedFunction={(e) => {
              // setIsDirty(true);
              setSelectedFunction(e);
            }}
            setIsDirty={setIsDirty}
          />
          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <CreateFunctionHeader
            title={FUNCTION_SUB_TITLE}
            tooltip={FUNCTION_SUB_TITLE_TOOLTIP}
            // buttonText={FUNCTION_SUB_TITLE_BUTTON}
            isFunction
            handleVerify={() => {
              setOpenStockModal(true);
            }}
            systemDefine={stockData?.userDefined}
            showButtons={stockData?.userDefined}
            isVerify
            // id={id}
          />
          <Grid
            container
            spacing={2}
            className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200 "
          >
            <Grid
              // className="md:border-r md:border-r-zinc-200"
              item
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <KeywordSearch keywordData={keywordData} fullHeight={false} />
            </Grid>
            <Grid
              item
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              {stockData && (
                <EditorFunction
                  stockData={stockData}
                  code={code}
                  setCode={setCode}
                  editUserData={!editUserData}
                  argsData={argsData}
                  handleAddArgsData={handleAddArgsData}
                  handleDeleteArgsData={handleDeleteArgsData}
                  handleArgsDataChange={handleArgsDataChange}
                  setIsFunctionDialogOpen={setIsFunctionDialogOpen}
                  isNewFuncOrDuplicate={isDuplicate}
                  setIsDirty={setIsDirty}
                />
              )}
            </Grid>

            {/* Stock Bundle Step - Full Width on Small Screens, Half on Medium+, 6.7/12 on Large+ */}
          </Grid>
          {internalData && (
            <>
              <CreateFunctionHeader
                title={VERIFY_STOCK_TITLE}
                tooltip={VERIFY_STOCK_TOOLTIP}
                buttonText={"Continue to save"}
                isVerify
                handleChange={() => {
                  setIsDirty(true);
                  setOpenAddFunctionModal(true);
                }}
                handleVerify={() => {
                  setIsDirty(true);
                  setTriggerVerify(true); // ✅ Triggers VerifyOnStock effect
                }}
                isSaving={isSaving}
                isShowSave
                showButtons={isDuplicate || stockData?.userDefined}
                // systemDefine={stockData?.userDefined}
                // id={id}
              />
              <Grid
                container
                spacing={2}
                className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200"
              >
                <Grid
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
                    startDate={startDate}
                    setStartDate={(e) => {
                      setStartDate(e);
                      setIsDirty(true);
                    }}
                    endDate={endDate}
                    setEndDate={(e) => {
                      setEndDate(e);
                      setIsDirty(true);
                    }}
                    selectedStock={selectedStock}
                    setSelectedStock={(e) => {
                      setSelectedStock(e);
                      setIsDirty(true);
                    }}
                    xAxisInput={xAxisInput}
                    setXAxisInput={(e) => {
                      setXAxisInput(e);
                      setIsDirty(true);
                    }}
                    yAxisInput={yAxisInput}
                    setYAxisInput={(e) => {
                      setYAxisInput(e);
                      setIsDirty(true);
                    }}
                    handleVerifyStock={handleVerifyStock}
                    isSaving={isSaving}
                    triggerVerify={triggerVerify}
                    setTriggerVerify={setTriggerVerify}
                  />
                </Grid>
                <Grid
                  item
                  size={{
                    xs: 12,
                    md: 6,
                    lg: 8,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: 600,
                      position: "relative",
                    }}
                  >
                    <IconButton
                      onClick={() => setIsFullGraphOpen(true)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <FullscreenIcon fontSize="large" />
                    </IconButton>
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
                </Grid>
              </Grid>
            </>
          )}

          {isFullGraphOpen && (
            <CommonModal
              isOpen={isFullGraphOpen}
              handleClose={() => setIsFullGraphOpen(false)}
              title={""}
            >
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
            </CommonModal>
          )}

          {isDeleteOpen && (
            <DeleteModal
              isOpen={isDeleteOpen}
              handleClose={() => setIsDeleteOpen(false)}
              handleConfirm={handleConfirmDelete}
              title="Are you Sure?"
              description="This action is irreversible. Once deleted, the function and all its data cannot be recovered."
            />
          )}

          {showPrompt && (
            <WarningPopupModal
              isOpen={showPrompt}
              handleClose={cancelNavigation}
              title="Unsaved Changes"
              description="You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost if you don’t save them."
              buttonText="Yes"
              handleConfirm={confirmNavigation}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditFunction;
