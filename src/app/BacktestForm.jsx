// BacktestForm.js
import React, {
  memo,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { paperStyle } from "./styles.js";
import { DataGrid } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import Plot from "react-plotly.js";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../V2/contexts/AuthContext.jsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import SummaryIconButton from "./SummaryIconButton.jsx";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

// Context for BacktestForm state
const BacktestContext = createContext();

const BacktestProvider = ({ children }) => {
  // Shared states for the form
  const [backtestRequest, setBacktestRequest] = useState(
    localStorage.getItem("backtestRequest") || ""
  );
  const [preparedData, setPreparedData] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [substage, setSubstage] = useState("");
  const [symin, setSymin] = useState("");
  const [summary, setSummary] = useState("");
  const [tradesData, setTradesData] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Persist `backtestRequest` in localStorage
  useEffect(() => {
    localStorage.setItem("backtestRequest", backtestRequest);
  }, [backtestRequest]);

  return (
    <BacktestContext.Provider
      value={{
        backtestRequest,
        setBacktestRequest,
        preparedData,
        setPreparedData,
        selectedRequestId,
        setSelectedRequestId,
        substage,
        setSubstage,
        symin,
        setSymin,
        summary,
        setSummary,
        tradesData,
        setTradesData,
        alert,
        setAlert,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};

// Custom hook to access BacktestContext
const useBacktestContext = () => useContext(BacktestContext);

function BacktestForm() {
  const theme = useTheme(); // Access the theme
  // Use shared states from context
  const {
    backtestRequest,
    setBacktestRequest,
    preparedData,
    setPreparedData,
    selectedRequestId,
    setSelectedRequestId,
    substage,
    setSubstage,
    symin,
    setSymin,
    summary,
    setSummary,
    tradesData,
    setTradesData,
    alert,
    setAlert,
  } = useBacktestContext();

  const { authToken, getAccessToken } = useAuth();
  const { functionFetched, setFunctionFetched } = useState(false);

  // State variables
  const [phase, setPhase] = useState("trade");
  const [reqid, setReqid] = useState("");

  const [dataFetched, setDataFetched] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [showTradeTable, setShowTradeTable] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showSymbol, setShowSymbol] = useState(false);

  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [helpContent, setHelpContent] = useState(null);
  const [helpLoading, setHelpLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);

  const customStyle = {
    p: 4,
    mb: 4,
    backgroundColor: theme.palette.background.default,
    position: isFullScreen ? "fixed" : "relative",
    top: isFullScreen ? 0 : "auto",
    left: isFullScreen ? 0 : "auto",
    right: isFullScreen ? 0 : "auto",
    bottom: isFullScreen ? 0 : "auto",
    zIndex: isFullScreen ? 9999 : "auto",
    width: isFullScreen ? "100vw" : "100%",
    height: isFullScreen ? "100vh" : "auto",
    overflow: "auto",
  };
  const combinedStyle = {
    ...paperStyle,
    ...customStyle,
  };

  // Predefined options for dropdowns
  const pipelineStages = [
    "trade",
    "filter",
    "strategy",
    "psizing",
    "underlying",
    "entry",
    "order",
    "exit",
  ];
  const substages = [
    "",
    "capital",
    "profits",
    "parameters",
    "avg1r",
    "opentrades",
    "totaltrades",
    "duration",
    "symbol",
  ];

  // useEffect to fetch data once authentication is completed
  useEffect(() => {
    fetchData();
    fetchFunctions();
  }, []);

  useEffect(() => {
    setShowSymbol(substage === "symbol");
  }, [substage]);

  useEffect(() => {
    if (isFullScreen) {
      // Trigger a resize event to make Plotly resize correctly
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  }, [isFullScreen]);

  const fetchFunctions = async () => {
    if (!functionFetched) {
      try {
        const latestToken =
          "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKTnliemEzMnp1dE1YbUN3OXhBTUtaVGlxeGpEZ3I3QTVrOHFFV1dFMGJNIn0.eyJleHAiOjE3NDcyMjU2MjksImlhdCI6MTc0NzIyNTMyOSwiYXV0aF90aW1lIjoxNzQ3MjI1MzI3LCJqdGkiOiJlMzMyODJhMS1hYzIyLTRjZGYtYTM0My01OWM3NzYzYzY1MTMiLCJpc3MiOiJodHRwczovL3N0cmF0ZXp5bGFicy5haS9hdXRoL3JlYWxtcy9zdG9ja3NlcnZlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI4NTY0NzI0Ny05NjUyLTQzOWEtYWY2Yy0zZjU4ZGE1MThlZWYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdG9ja3NlcnZlci1yZWFjdCIsIm5vbmNlIjoiNDYwYmUyYTEtYjRhOS00YzZmLWI2MmItODgzNWU2NmY3MjFiIiwic2Vzc2lvbl9zdGF0ZSI6IjMyYTU3YjI1LTY2NWYtNDE3Mi1hNzMwLThjM2EzZGUxZWJjNCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly93d3cuc3RyYXRlenlsYWJzLmFpIiwiaHR0cHM6Ly9zdHJhdGV6eWxhYnMuYWkiLCJodHRwczovL3d3dy5zdHJhdGV6eWxhYnMuY29tIiwiaHR0cDovL2dhdGV3YXk6MzAwMCIsImh0dHBzOi8veXVrdGl0cmFkZS5jb206MzAwMCIsImh0dHA6Ly9nYXRld2F5OjgwMDEiLCJodHRwczovL3N0cmF0ZXp5bGFicy5vdXJhcHBkZW1vLmNvbSIsImh0dHBzOi8veXVrdGl0cmFkZS5jb20iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RvY2tzZXJ2ZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiVVNFUiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiIzMmE1N2IyNS02NjVmLTQxNzItYTczMC04YzNhM2RlMWViYzQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IktpcmFuIE1pc3RhcnkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraXJhbm1pc3RhcnkwNjk5QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJLaXJhbiIsImZhbWlseV9uYW1lIjoiTWlzdGFyeSIsImVtYWlsIjoia2lyYW5taXN0YXJ5MDY5OUBnbWFpbC5jb20ifQ.GKS69A_iJ0v4RcNoYwKvmI35z8oQATq1bx8CraRcF62elUKQo_fhZOr73Q-VP6aZKUn0Wf51_zKVO9upASW8Z4cu_wICtbNUDHwF0lNMP1_rdh-nRu26wRt8jkkH1719TBOWiB3j7eLMrnc5fTceL_Cpy9bM83yqN8vEwPfWQF-P6GLpPer0xWfK4WZ0wKT4iXdDJq8aaJps4HGy-GmEM-6LASLDf_ms_YIuKzCzdQuid-biQNZityIhVHKgyFdpFq16zaG27n9WKs3Ei_uUq9aPae2hDn24dAcNVrX5FeNaGRthiO7YQsdoyRKQhJ4aVewE1053K8pxVg9givj-mg";
        const response = await axios.get(
          "https://stratezylabs.ai/stock-analysis-function/list",
          {
            headers: {
              Authorization: `Bearer ${latestToken}`,
              credentials: "include",
            },
          }
        );
        //console.debug("Funtion fetched - ", response.data);
        setFunctionFetched(true);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.log("Error fetching function list -", error);
        }
      } finally {
      }
    }
  };

  const handleHelpClick = () => {
    setHelpLoading(true);
    // Call the REST API to fetch help content (PDF)
    const latestToken = getAccessToken();
    fetch("https://stratezylabs.ai/stock-analysis-function/help/download", {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${latestToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const pdfUrl = URL.createObjectURL(blob);
        setHelpContent(pdfUrl);
        setHelpLoading(false);
        setHelpDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching help content:", error);
        setHelpLoading(false);
      });
  };
  const downloadJsonFile = async () => {
    try {
      // Make the backend API call
      const latestToken = getAccessToken();
      const response = await fetch(
        "https://stratezylabs.ai/stock-analysis-function/help/jsondownload",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${latestToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      // Read the response as a Blob
      const blob = await response.blob();

      // Prompt the user with a confirmation popup
      const userConfirmed = window.confirm(
        "The JSON file is ready for download. Do you want to save it?"
      );

      if (userConfirmed) {
        // Create a link to download the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.txt"; // Use .txt as required
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("An error occurred while downloading the file.");
    }
  };

  const fetchData = async () => {
    try {
      const latestToken = getAccessToken();
      const response = await axios.get(
        "https://stratezylabs.ai/command/backtest/findall",
        {
          //const response = await axios.get('http://localhost:8889/command/backtest/findall', {
          headers: {
            Authorization: `Bearer ${latestToken}`,
          },
        }
      );
      setRequests(response.data);
      const selectedRequest = response.data.find(
        (request) => request.requestId === selectedRequestId
      );
      setSummary(selectedRequest ? selectedRequest.summary : "");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Handle dropdown change
  const handleRequestChange = (event) => {
    const selectedId = event.target.value;
    setSelectedRequestId(selectedId);

    // Find the summary for the selected requestId
    const selectedRequest = requests.find(
      (request) => request.requestId === selectedId
    );
    setSummary(selectedRequest ? selectedRequest.summary : "");
    setReqid(selectedId);
  };

  // Function to fetch chart data
  const fetchChartData = async () => {
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      let url = `https://stratezylabs.ai/command/backtest/chart?symbol=${symin}&stage=${phase}&id=${selectedRequestId}`;
      //let url = `http://localhost:8889/command/backtest/chart?symbol=${symin}&stage=${phase}&id=${selectedRequestId}`;
      if (substage) {
        url += `&substage=${substage}`;
      }
      const headers = {
        Authorization: `Bearer ${latestToken}`,
      };
      const response = await axios.get(url, { headers });
      console.log("respson",response.data);
      
      setChartData(response.data);
      prepareData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: `Error fetching data: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Function to fetch trades data
  const fetchTradesData = async () => {
    try {
      setTradeLoading(true);
      const latestToken = getAccessToken();
      const url = `https://stratezylabs.ai/command/backtest/tradetable?id=${reqid}`;
      //const url = `http://localhost:8889/command/backtest/tradetable?id=${reqid}`;
      const headers = {
        Authorization: `Bearer ${latestToken}`,
      };
      const response = await axios.get(url, { headers });
      setTradesData(response.data);
      setShowTradeTable(true);
      setTradeLoading(false);
    } catch (error) {
      setTradeLoading(false);
      setAlert({
        open: true,
        message: `Error fetching trade data: ${error.message}`,
        severity: "error",
      });
    }
  };

  const postBacktestRequestData = async (requestBody) => {
    const url = "https://stratezylabs.ai/command/backtest/request";
    //const url = 'http://localhost:8889/command/backtest/request';
    try {
      const latestToken = getAccessToken();
      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${latestToken}`,
        },
      });
      fetchData();
      setBacktestRequest("");
      setAlert({
        open: true,
        message: `Request submitted successfully!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error during backtest POST request:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "An unexpected error occurred.";
      setAlert({
        open: true,
        message: `Error submitting backtest request: ${errorMessage}`,
        severity: "error",
      });
    }
  };

  // Function to prepare data for plotting
  const prepareData = (data) => {
    let seriesData = [];
    Object.keys(data).forEach((seriesName) => {
      const chartRes = data[seriesName];
      if (chartRes.error) {
        setAlert({
          open: true,
          message: `No data found: ${chartRes.error.message}`,
          severity: "error",
        });
        return;
      }
      const valueMap = chartRes.valueMap;
      if (!valueMap) {
        setAlert({
          open: true,
          message: `No data available for series '${seriesName}'.`,
          severity: "error",
        });
        return;
      }

      // Collect date and value pairs
      const dateValues = Object.keys(valueMap)
        .map((dateStr) => {
          const date = new Date(dateStr);
          if (isNaN(date)) {
            console.warn(`Skipping invalid date format: ${dateStr}`);
            return null;
          }
          return { date, value: valueMap[dateStr] };
        })
        .filter((item) => item !== null);

      // Sort the dateValues array by date
      dateValues.sort((a, b) => a.date - b.date);

      if (dateValues.length) {
        const df = dateValues.map((item) => ({
          Date: item.date,
          Value: item.value,
          Series: seriesName,
          ChartType: chartRes.chartType
            ? chartRes.chartType.toLowerCase()
            : "line",
          YAxis: chartRes.yaxis ? chartRes.yaxis.toLowerCase() : "y1",
        }));
        seriesData = seriesData.concat(df);
      }
    });

    if (seriesData.length) {
      setPreparedData(seriesData);
    } else {
      setPreparedData(null);
    }
  };

  // Function to prepare Plot data
  const preparePlotData = (data) => {
    const plotData = data.reduce((acc, curr) => {
      let existingSeries = acc.find((series) => series.name === curr.Series);
      if (existingSeries) {
        existingSeries.x.push(curr.Date);
        existingSeries.y.push(curr.Value);
      } else {
        let chartType = (curr.ChartType || "line").toLowerCase();
        let mode = "lines+markers";
        let fill = "none";
        if (chartType === "area") {
          mode = "lines";
          fill = "tozeroy";
        } else if (chartType === "line") {
          mode = "lines+markers";
          fill = "none";
        }
        acc.push({
          x: [curr.Date],
          y: [curr.Value],
          type: "scatter",
          mode: mode,
          fill: fill,
          name: curr.Series,
          yaxis: curr.YAxis === "y2" ? "y2" : "y1",
          marker: {
            size: 3,
          },
          line: {
            width: 1,
          },
        });
      }
      return acc;
    }, []);
    return plotData;
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    /*if(authToken && phase && substage) {
      if (substage === 'symbol' && !symin) {
        setAlert({
          open: true,
          message: 'Please enter your phase symbol!',
          severity: 'warning',
        });
      }
    } else */ if (reqid && substage) {
      if (substage === "symbol" && !symin) {
        setAlert({
          open: true,
          message: "Please enter your symbol!",
          severity: "warning",
        });
      } else {
        setDataFetched(true);
        fetchChartData();
      }
    } else {
      setAlert({
        open: true,
        message: "Please enter your substage!",
        severity: "warning",
      });
    }
  };

  // Handler for showing trade table
  const handleShowTradeTable = () => {
    fetchTradesData();
  };

  // Filtered trades data
  const filteredTradesData = tradesData
    ? tradesData.filter((item) => {
        if (!filterText) return true;
        return Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(filterText.toLowerCase());
      })
    : [];

  // CSV Export functionality
  const exportToCSV = () => {
    const csvRows = [];
    const headers = Object.keys(filteredTradesData[0]);
    csvRows.push(headers.join(","));
    filteredTradesData.forEach((row) => {
      const values = headers.map((header) => `"${row[header]}"`);
      csvRows.push(values.join(","));
    });
    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    saveAs(csvData, "trade_table.csv");
  };

  // Close alert
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  // Handle backtest form submission
  const handleBacktestRequestSubmit = (e) => {
    e.preventDefault();
    if (backtestRequest) {
      postBacktestRequestData(backtestRequest);
    } else {
      setAlert({
        open: true,
        message: "Please enter a backtest request before submitting.",
        severity: "warning",
      });
    }
  };

  const handleDelete = async () => {
    console.log("Delete backtest request button clicked");
    try {
      const userConfirmed = window.confirm(
        `Are you sure you want to delete backtest data ?`
      );
      if (!userConfirmed) {
        return; // Exit if user cancels
      }

      setLoading(true);
      const latestToken = getAccessToken();
      let url = `https://stratezylabs.ai/command/backtest/delete/${selectedRequestId}`;
      const headers = {
        Authorization: `Bearer ${latestToken}`,
      };
      const response = await axios.get(url, { headers });
      setLoading(false);
      setAlert({
        open: true,
        message: `${response.message}`,
        severity: "success",
      });
      fetchData();
      console.log("Fetched data");
    } catch (error) {
      setLoading(false);
      setAlert({
        open: true,
        message: `Error deleting request Id: ${error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <Card variant="outlined" sx={paperStyle}>
      <CardHeader
        title="Backtest Request and Analysis"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div>
          <Paper elevation={6} sx={paperStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              <Typography variant="h6" gutterBottom>
                Backtest Request Submission
              </Typography>
              <Tooltip title="Help - backtest.pdf" arrow>
                <IconButton onClick={handleHelpClick} color="primary">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
              {/* Download Icon */}
              <Tooltip title="Download Sample JSON" arrow>
                <IconButton
                  onClick={downloadJsonFile}
                  color="primary"
                  sx={{ ml: 2 }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Enter backtest request in JSON format"
                  multiline
                  rows={10}
                  fullWidth
                  InputProps={{
                    readOnly: false,
                    sx: {
                      fontFamily:
                        '"Fira Code", "JetBrains Mono", "Courier Prime", monospace',
                      whiteSpace: "pre-wrap",
                      backgroundColor: theme.palette.background.paper,
                      p: 2,
                      borderRadius: 1,
                    },
                    spellCheck: false,
                  }}
                  value={backtestRequest}
                  onChange={(e) => setBacktestRequest(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  textAlign="center"
                  display="flex"
                  justifyContent="center"
                  gap={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    sx={{ mt: 2, mb: 2 }}
                    startIcon={loading && <CircularProgress size={20} />}
                    onClick={handleBacktestRequestSubmit}
                  >
                    {loading
                      ? "Submitting request..."
                      : "Submit Backtest Request"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </div>

        <Dialog
          open={helpDialogOpen}
          onClose={() => setHelpDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Help</DialogTitle>
          <DialogContent dividers>
            {helpLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            ) : (
              helpContent && (
                <Document
                  file={helpContent}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={(error) =>
                    console.error(
                      "Error while loading document! " + error.message
                    )
                  }
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer
                      renderAnnotationLayer
                    />
                  ))}
                </Document>
              )
            )}
          </DialogContent>
        </Dialog>

        {/* Visualization Card */}
        <div>
          <Paper elevation={6} sx={paperStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Backtest Result Analysis
              </Typography>
              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> */}
              {/* Summary Icon Button */}

              <SummaryIconButton color="primary" />

              {/* Refresh Icon */}
              <Tooltip title="Refresh" arrow>
                <IconButton onClick={fetchData} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {/* </Box> */}
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Request ID */}
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Request ID</InputLabel>
                    <Select
                      value={selectedRequestId}
                      onChange={handleRequestChange}
                      label="Request ID"
                    >
                      {requests.map((request) => (
                        <MenuItem
                          key={request.requestId}
                          value={request.requestId}
                        >
                          {request.name || request.requestId}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Stage */}
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Stage</InputLabel>
                    <Select
                      value={phase}
                      onChange={(e) => {
                        setPhase(e.target.value);
                        if (e.target.value != "trade") {
                          setSubstage("symbol");
                        }
                      }}
                      label="Phase"
                    >
                      {pipelineStages.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage || "None"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Substage */}

                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Backtest Data</InputLabel>
                    <Select
                      value={substage}
                      onChange={(e) => setSubstage(e.target.value)}
                      label="Substage"
                    >
                      {substages.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage || "None"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* NSE Symbol Name */}
                {showSymbol && (
                  <Grid item xs={12} sm={4} md={4}>
                    <TextField
                      label="NSE Symbol Name"
                      fullWidth
                      value={symin}
                      onChange={(e) => setSymin(e.target.value)}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Summary"
                    value={summary}
                    multiline
                    rows={12}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      sx: {
                        fontFamily:
                          '"Fira Code", "JetBrains Mono", "Courier Prime", monospace',
                        whiteSpace: "pre-wrap",
                        backgroundColor: theme.palette.background.paper,
                        p: 2,
                        borderRadius: 1,
                      },
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    textAlign="center"
                    display="flex"
                    justifyContent="center"
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{ mt: 2, mb: 2, flex: 1 }}
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} />}
                    >
                      {loading ? "Fetching Data..." : "Submit"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mt: 2, mb: 2, flex: 1 }}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </div>

        {preparedData && preparedData.length > 0 && (
          <Paper
            elevation={6}
            sx={{
              ...paperStyle,
              position: isFullScreen ? "fixed" : "relative",
              top: isFullScreen ? 0 : "auto",
              left: isFullScreen ? 0 : "auto",
              right: isFullScreen ? 0 : "auto",
              bottom: isFullScreen ? 0 : "auto",
              zIndex: isFullScreen ? 9999 : "auto",
              width: isFullScreen ? "100vw" : "100%",
              height: isFullScreen ? "100vh" : "auto",
              overflow: isFullScreen ? "auto" : "hidden",
              padding: isFullScreen ? "0" : "inherit",
            }}
          >
            <Typography variant="h6" gutterBottom mt={2}>
              Data Visualization
            </Typography>

            {/* Plotly Chart */}
            {(() => {
              const y1Values = preparedData
                .filter((d) => d.YAxis === "y1")
                .map((d) => d.Value);
              const y2Values = preparedData
                .filter((d) => d.YAxis === "y2")
                .map((d) => d.Value);

              const y1Range = y1Values.length
                ? [Math.min(...y1Values), Math.max(...y1Values)]
                : undefined;
              const y2Range = y2Values.length
                ? [Math.min(...y2Values), Math.max(...y2Values)]
                : undefined;

              return (
                <Plot
                  data={preparePlotData(preparedData)}
                  layout={{
                    xaxis: {
                      title: "Date",
                      showgrid: true,
                      gridcolor: "#e0e0e0",
                    },
                    yaxis: {
                      title: "Primary Y-Axis",
                      gridcolor: "#e0e0e0",
                      range: y1Range,
                    },
                    yaxis2: {
                      title: "Secondary Y-Axis",
                      overlaying: "y",
                      side: "right",
                      range: y2Range,
                    },
                    legend: { orientation: "h" },
                    hovermode: "x unified",
                    paper_bgcolor: theme.palette.background.paper,
                    plot_bgcolor: theme.palette.background.paper,
                    autosize: true,
                    margin: { l: 40, r: 40, t: 20, b: 40 },
                  }}
                  config={{
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToAdd: ["toggleSpikelines", "resetScale2d"], // Add additional buttons
                  }}
                  useResizeHandler={true}
                  style={{
                    width: isFullScreen ? "100vw" : "100%",
                    height: isFullScreen ? "90vh" : "50vh", // Adjust based on fullscreen state
                  }}
                />
              );
            })()}
            {/* Fullscreen Toggle Button */}
            <Box textAlign="center" mt={1} mb={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? "Exit Fullscreen" : "Go Fullscreen"}
              </Button>
            </Box>
          </Paper>
        )}

        {/* Trade Table Section */}
        <Box textAlign="center" my={4}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleShowTradeTable}
            disabled={tradeLoading}
            startIcon={tradeLoading && <CircularProgress size={20} />}
          >
            {tradeLoading ? "Fetching Trade Data..." : "Show Trade Table"}
          </Button>
        </Box>

        {/* Trade Table */}
        {showTradeTable && tradesData && (
          <Paper elevation={6} sx={paperStyle}>
            <Typography variant="h6" gutterBottom>
              Trade Table
            </Typography>
            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Filter trades by..."
                  fullWidth
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} textAlign="right">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={exportToCSV}
                >
                  Download Data as CSV
                </Button>
              </Grid>
            </Grid>

            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredTradesData.map((item, index) => ({
                  id: index,
                  ...item,
                }))}
                columns={
                  tradesData && tradesData.length
                    ? Object.keys(tradesData[0]).map((key) => ({
                        field: key,
                        headerName: key,
                        width: 100,
                        valueFormatter: (params) =>
                          typeof params.value === "number"
                            ? params.value.toFixed(2) // Format numbers to 2 decimal places
                            : params.value, // Leave other values as-is
                      }))
                    : []
                }
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                sx={{
                  "& .MuiDataGrid-cell": {
                    color: theme.palette.text.primary,
                    fontSize: "0.875rem",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.default,
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          </Paper>
        )}

        {/* Snackbar for alerts */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          action={
            <IconButton size="small" color="inherit" onClick={handleAlertClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Card>
  );
}

export default memo(() => (
  <BacktestProvider>
    <BacktestForm />
  </BacktestProvider>
));
