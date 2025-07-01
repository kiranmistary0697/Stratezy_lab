import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  List,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  ListItemAvatar,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardHeader,
  InputAdornment,
  Skeleton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton as MuiListItemButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/material/styles";
import {
  CloudUpload as DeploymentIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { enIN } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { useAuth } from "../V2/contexts/AuthContext.jsx";
import TradeDataDialog from "./TradeDataDialog.jsx";
import TradeDataDialogToDo from "./TradeDataDialogToDo.jsx";
import { paperStyle } from "./styles.js";
import Rebalance from "./Rebalance.jsx";
import Plot from "react-plotly.js";
import { DataGrid } from "@mui/x-data-grid";
import { useMarket } from "./MarketContext";

const StyledListItem = styled(MuiListItemButton)(({ theme, ...props }) => ({
  backgroundColor: props.selected
    ? theme.palette.action.selected
    : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Deployment() {
  const theme = useTheme();
  const { getAccessToken } = useAuth();
  const [backtests, setBacktests] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [selectedBacktest, setSelectedBacktest] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchDeploymentText, setSearchDeploymentText] = useState("");
  const [exchange, setExchange] = useState("NSE");
  const [capital, setCapital] = useState("1000000");
  const [brokerage, setBrokerage] = useState("ZERODHA");
  const [ndays, setNdays] = useState("0");
  const [selectedDeploymentId, setSelectedDeploymentId] = useState(null);
  const [selectedBrokerageId, setSelectedBrokerageId] = useState(null);
  const [selectedDeploymentRequestId, setSelectedDeploymentRequestId] =
    useState(null);

  const [openTradeDataDialog, setOpenTradeDataDialog] = useState(false);
  const [openTradeDataDialogToDo, setOpenTradeDataDialogToDo] = useState(false);
  const [openTradeDataDialogN, setOpenTradeDataDialogN] = useState(false);
  const [tradeData, setTradeData] = useState([]);
  const [tradeDataToDo, setTradeDataToDo] = useState([]);
  const [tradeDataN, setTradeDataN] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [deploymentDate, setDeploymentDate] = useState(null);

  const [apiResponse, setApiResponse] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Plotly Performance Chart
  const [performanceData, setPerformanceData] = useState(null);
  const [showPerformanceChart, setShowPerformanceChart] = useState(false);
  const [isChartFullScreen, setIsChartFullScreen] = useState(false);

  // TradeHistoryAll table dialog
  const [tradeHistoryAllData, setTradeHistoryAllData] = useState([]);
  const [openTradeHistoryAllDialog, setOpenTradeHistoryAllDialog] =
    useState(false);
  const [tradeHistorySearch, setTradeHistorySearch] = useState("");
  const [isTradeHistoryFullScreen, setIsTradeHistoryFullScreen] =
    useState(false);

  // ---- NEW STATES for AddCapital Dialog ----
  const [openAddCapitalDialog, setOpenAddCapitalDialog] = useState(false);
  const [capitalType, setCapitalType] = useState("ONETIME");
  const [capitalValueInput, setCapitalValueInput] = useState("");
  const [addCapitalDate, setAddCapitalDate] = useState(null);
  const [numMonths, setNumMonths] = useState("");
  const { getExchange } = useMarket();
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchData();
    fetchDeploymentData();
  }, []);

  const handleDeploymentDateChange = (newValue) => {
    setDeploymentDate(newValue);
    console.log(
      "Selected Deployment Date: ",
      newValue?.toLocaleDateString() ?? ""
    );
  };

  const handleActivate = async (strategy, brokerage) => {
    try {
      setLoading(true);
      const latestToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKTnliemEzMnp1dE1YbUN3OXhBTUtaVGlxeGpEZ3I3QTVrOHFFV1dFMGJNIn0.eyJleHAiOjE3NDcyMjQzMzYsImlhdCI6MTc0NzIyNDAzNiwiYXV0aF90aW1lIjoxNzQ3MjI0MDM1LCJqdGkiOiI5ZDYyMzYwOC1mODY0LTQyOTEtYjZlOC1jZjRiMGU1MmIwMTYiLCJpc3MiOiJodHRwczovL3N0cmF0ZXp5bGFicy5haS9hdXRoL3JlYWxtcy9zdG9ja3NlcnZlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI4NTY0NzI0Ny05NjUyLTQzOWEtYWY2Yy0zZjU4ZGE1MThlZWYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzdG9ja3NlcnZlci1yZWFjdCIsIm5vbmNlIjoiNzZlZWQyZWEtZjZlYS00NDU5LWEzYzMtYTc0NmFlYjI5MzNjIiwic2Vzc2lvbl9zdGF0ZSI6ImU1OTExZDkyLWIyYjItNDUwMC04YzIxLTQ3YjVjMWQ5YWNlNCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly93d3cuc3RyYXRlenlsYWJzLmFpIiwiaHR0cHM6Ly9zdHJhdGV6eWxhYnMuYWkiLCJodHRwczovL3d3dy5zdHJhdGV6eWxhYnMuY29tIiwiaHR0cDovL2dhdGV3YXk6MzAwMCIsImh0dHBzOi8veXVrdGl0cmFkZS5jb206MzAwMCIsImh0dHA6Ly9nYXRld2F5OjgwMDEiLCJodHRwczovL3N0cmF0ZXp5bGFicy5vdXJhcHBkZW1vLmNvbSIsImh0dHBzOi8veXVrdGl0cmFkZS5jb20iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3RvY2tzZXJ2ZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiVVNFUiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJlNTkxMWQ5Mi1iMmIyLTQ1MDAtOGMyMS00N2I1YzFkOWFjZTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IktpcmFuIE1pc3RhcnkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJraXJhbm1pc3RhcnkwNjk5QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJLaXJhbiIsImZhbWlseV9uYW1lIjoiTWlzdGFyeSIsImVtYWlsIjoia2lyYW5taXN0YXJ5MDY5OUBnbWFpbC5jb20ifQ.dIxp7IFZfbRTMlJWauk_rgk7MzTqsCkltewUUFAougfxGKgW94OSfTMx0N9RZ0iVkl4Jlqat6hOfJDr_06yV5SjehoVk3p2ZMVrIfX0XFwckOimqLHdNij3msgfyEXc6nEpc_Xn8ASlXyLpPoYF41OvM7kgjAqj66si2Mc3gPb3QVgYLvw8ixmDGtSslkyqB8W9YPeDpdn3kawJ-nRwrGSQZjBE7gRlVDZtzyQIVJMTM_RHYRafF_JQZErcCJsKS-NXlg74MSPPJWJAkgAb0lGc0OiFGe_h_N9nQJmUCdYW1rmW1vG6Ht-AhNO7ksgnKCdhj9snqelx7JktarluWAg";
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/activate?name=${strategy}&exchange=${lexchange}&brokerage=${brokerage}&activate=true`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setSnackbarMessage(response.data);
      setSnackbarOpen(true);
      fetchDeploymentData();
    } catch (error) {
      console.error("Error activating strategy:", error);
      setSnackbarMessage(
        `Error activating strategy - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (strategy, brokerage) => {
    if (!strategy) {
      alert("Please select a strategy to deactivate.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to deactivate deployed strategy ${strategy}?`
      )
    )
      return;
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/activate?name=${strategy}&exchange=${lexchange}&brokerage=${brokerage}&activate=false`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setSnackbarMessage(response.data);
      setSnackbarOpen(true);
      fetchDeploymentData();
    } catch (error) {
      console.error("Error deactivating strategy:", error);
      setSnackbarMessage(
        `Error deactivating strategy - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (strategy, brokerage) => {
    if (!strategy) {
      alert("Please select a strategy to delete.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete deployed strategy ${strategy}?`
      )
    )
      return;
    try {
      setLoading(true);
      const lexchange = getExchange();
      const requestBody = {
        exchangeId: lexchange,
        strategyName: strategy,
        brokerage,
      };
      await axios.post("https://stratezylabs.ai/strategy/delete", requestBody, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      setSnackbarMessage(`Strategy - ${strategy} deleted successfully`);
      setSnackbarOpen(true);
      fetchDeploymentData();
    } catch (error) {
      console.error("Error deleting strategy:", error);
      setSnackbarMessage(`Error deleting strategy - ${error.message || error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (strategy, brokerage) => {
    if (!strategy) return;
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/viewall?name=${strategy}&exchange=${lexchange}&brokerage=${brokerage}`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setTradeData(response.data);
      setOpenTradeDataDialog(true);
    } catch (error) {
      console.error("Error viewing strategy trade table:", error);
      setSnackbarMessage(
        `Error viewing trades strategy - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewN = async (strategy, brokerage) => {
    if (!strategy) return;
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/viewn?name=${strategy}&days=${ndays}&exchange=${lexchange}&brokerage=${brokerage}`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setTradeDataN(response.data);
      setOpenTradeDataDialogN(true);
    } catch (error) {
      console.error("Error viewing strategy trade table:", error);
      setSnackbarMessage(
        `Error viewing trades strategy - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShow = async (strategy, brokerage) => {
    if (!strategy) return;
    try {
      setLoading(true);
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/backtest?name=${strategy}&exchange=${lexchange}&brokerage=${brokerage}`,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setApiResponse(JSON.stringify(response.data, null, 2));
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error getting strategy backtest:", error);
      setSnackbarMessage(
        `Error viewing strategy backtest rule - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleViewToDo = async (strategy, brokerage) => {
    if (!strategy) return;
    try {
      setLoading(true);
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/view?name=${strategy}&exchange=${lexchange}&brokerage=${brokerage}`,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setTradeDataToDo(response.data);
      setOpenTradeDataDialogToDo(true);
    } catch (error) {
      console.error("Error viewing strategy trade table:", error);
      setSnackbarMessage(
        `Error viewing strategy trade table - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  async function handleRebalance(id) {
    console.log("Not yet implemented !!");
  }

  // New handler for "TradeHistoryAll" button
  const handleTradeHistoryAll = async () => {
    if (!selectedDeploymentRequestId) {
      alert("Please select a deployment.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://stratezylabs.ai/command/backtest/tradetable?id=${selectedDeploymentRequestId}`,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setTradeHistoryAllData(response.data);
      setOpenTradeHistoryAllDialog(true);
    } catch (error) {
      console.error("Error fetching trade history all:", error);
      setSnackbarMessage(
        `Error fetching trade history all - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // ---- REPLACED handleOther with handleAddCapitalOpen (opens the popup) ----
  const handleAddCapitalOpen = () => {
    setOpenAddCapitalDialog(true);
  };

  // ---- AddCapital Dialog close handler ----
  const handleAddCapitalClose = () => {
    setOpenAddCapitalDialog(false);
    // optional: clear the fields if you want them reset each time the dialog opens
    // setCapitalType("ONETIME");
    // setCapitalValueInput("");
    // setAddCapitalDate(null);
    // setNumMonths("");
  };
  const handleAddCapitalView = async () => {
    if (!selectedDeploymentId || !selectedBrokerageId) {
      alert("Please select a deployed strategy.");
      return;
    }
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      // Example GET request with query parameters:
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/viewcapital?name=${selectedDeploymentId}&exchange=${lexchange}&brokerage=${selectedBrokerageId}`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setSnackbarMessage(JSON.stringify(response.data, null, 2));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenAddCapitalDialog(false);
    } catch (error) {
      console.error("ViewCapital failed:", error);
      setSnackbarMessage(`Error view capital: ${error.message || error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleAddCapitalClear = async () => {
    if (!selectedDeploymentId || !selectedBrokerageId) {
      alert("Please select a deployed strategy.");
      return;
    }
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      // Example GET request with query parameters:
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/clearcapital?name=${selectedDeploymentId}&exchange=${lexchange}&brokerage=${selectedBrokerageId}`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setSnackbarMessage(`${response.data}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenAddCapitalDialog(false);
    } catch (error) {
      console.error("ClearCapital failed:", error);
      setSnackbarMessage(`Error clear capital: ${error.message || error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // ---- AddCapital Submit Handler ----
  const handleAddCapitalSubmit = async () => {
    if (!selectedDeploymentId || !selectedBrokerageId) {
      alert("Please select a deployed strategy.");
      return;
    }
    // Validate capital value
    const capitalNum = parseFloat(capitalValueInput || "0");
    if (capitalNum <= 0) {
      alert("Capital Value must be positive and non-zero.");
      return;
    }

    // Validate date is in future (strictly > today)
    if (!addCapitalDate) {
      alert("Please select a valid future date.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // compare ignoring time of day
    const chosenDate = new Date(
      addCapitalDate.getFullYear(),
      addCapitalDate.getMonth(),
      addCapitalDate.getDate()
    );
    if (chosenDate <= today) {
      alert("Please select a future date.");
      return;
    }

    // If PERIODIC_MONTHLY, validate months >= 1
    if (capitalType === "PERIODIC_MONTHLY") {
      const m = parseInt(numMonths || "0", 10);
      if (m < 1) {
        alert("Number of months must be at least 1.");
        return;
      }
    }

    // Convert date to YYYY-MM-DD
    const dateStr = addCapitalDate.toISOString().split("T")[0];

    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      // Example GET request with query parameters:
      const response = await axios.get(
        `https://stratezylabs.ai/deploy/strategy/addcapital?name=${selectedDeploymentId}&exchange=${lexchange}&brokerage=${selectedBrokerageId}&type=${capitalType}&capitalValue=${capitalValueInput}&date=${dateStr}&months=${numMonths}`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setSnackbarMessage(`AddCapital success: ${response.data}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenAddCapitalDialog(false);
    } catch (error) {
      console.error("AddCapital failed:", error);
      setSnackbarMessage(`Error adding capital: ${error.message || error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePerformance = async () => {
    if (!selectedDeploymentId) return;
    try {
      setLoading(true);
      const latestToken = getAccessToken();
      const lexchange = getExchange();
      const response = await axios.get(
        `https://stratezylabs.ai/command/backtest/chart?symbol=&stage=trade&id=${selectedDeploymentRequestId}&substage=capital`,
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      const netProfitMap = response.data.NetProfit?.valueMap || {};
      const unInvestedCapitalMap =
        response.data.UnInvestedCapital?.valueMap || {};
      const accountValMap = response.data.accountVal?.valueMap || {};

      const allDates = Array.from(
        new Set([
          ...Object.keys(netProfitMap),
          ...Object.keys(unInvestedCapitalMap),
          ...Object.keys(accountValMap),
        ])
      ).sort();

      const dates = allDates;
      const netProfitValues = allDates.map((date) => netProfitMap[date] || 0);
      const unInvestedCapitalValues = allDates.map(
        (date) => unInvestedCapitalMap[date] || 0
      );
      const accountValValues = allDates.map((date) => accountValMap[date] || 0);

      setPerformanceData({
        dates,
        netProfitValues,
        unInvestedCapitalValues,
        accountValValues,
      });
      setShowPerformanceChart(true);
    } catch (error) {
      console.error("Performance API call failed", error);
      setSnackbarMessage(
        `Error fetching performance data - ${error.message || error}`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const latestToken = getAccessToken();
      const response = await axios.get(
        "https://stratezylabs.ai/command/backtest/findall",
        { headers: { Authorization: `Bearer ${latestToken}` } }
      );
      setBacktests(response.data);
      if (response.data.length > 0) {
        handleSelection(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch backtests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeploymentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://stratezylabs.ai/deploy/strategy/findall",
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setDeployments(response.data);
    } catch (error) {
      console.error("Error fetching deployments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!selectedBacktest) {
      alert("Please select a backtest to deploy.");
      return;
    }
    setLoading(true);
    const requestBody = {
      requestId: selectedBacktest.requestId,
      exchangeId: exchange,
      initialCapital: capital,
      startDate: deploymentDate,
      strategyName: selectedBacktest.name || selectedBacktest.requestId,
      brokerage,
    };
    try {
      const response = await axios.post(
        "https://stratezylabs.ai/strategy/deploy",
        requestBody,
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setSnackbarMessage(`${response.data.message}`);
      setSnackbarOpen(true);
      setTextareaValue("");
      fetchDeploymentData();
    } catch (error) {
      console.error("Error during deploy:", error);
      setSnackbarMessage(`Failed to deploy, pls try again, error - ${error}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredBacktests = useMemo(
    () =>
      backtests.filter((deployment) =>
        (deployment.name || deployment.requestId)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [backtests, searchText]
  );

  const filteredDeployments = useMemo(
    () =>
      deployments.filter((deployment) =>
        (deployment.name || deployment.requestId)
          .toLowerCase()
          .includes(searchDeploymentText.toLowerCase())
      ),
    [deployments, searchDeploymentText]
  );

  function convertLocalDateStringToJSDate(localDateString) {
    const [year, month, day] = localDateString.split("-");
    return new Date(year, month - 1, day);
  }

  function getDeploymentTextId(deployment) {
    return deployment.name + "(" + deployment.brokerage + ")";
  }

  const handleSelection = (deployment) => {
    setSelectedBacktest(deployment);
    setTextareaValue(deployment.summary || "");
    setDeploymentDate(convertLocalDateStringToJSDate(deployment.startDate));
    setCapital(deployment.initialCapital);
  };

  const handleDeploymentSelection = (deployment) => {
    setSelectedDeployment(deployment);
  };

  const actionItemStyle = {
    height: "48px",
    minWidth: "120px",
    textTransform: "none",
  };

  // Determine chart container style based on full screen state
  const chartContainerStyle = isChartFullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 1000,
        padding: "20px",
        overflowY: "auto",
        textAlign: "center",
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        padding: "20px",
        width: "80%",
        maxWidth: "800px",
        maxHeight: "80%",
        overflowY: "auto",
        textAlign: "center",
      };

  const chartHeight = isChartFullScreen ? "80vh" : "400px";

  // Define columns for the TradeHistoryAll DataGrid
  const tradeHistoryColumns = [
    { field: "symbol", headerName: "Symbol", flex: 1 },
    { field: "buyTime", headerName: "Buy Time", flex: 1 },
    { field: "buyPrice", headerName: "Buy Price", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },
    { field: "sellTime", headerName: "Sell Time", flex: 1 },
    { field: "sellPrice", headerName: "Sell Price", flex: 1 },
    { field: "principal", headerName: "Principal", flex: 1 },
    { field: "investment", headerName: "Investment", flex: 1 },
    { field: "netProfit", headerName: "Net Profit", flex: 1 },
    { field: "profit", headerName: "Profit (%)", flex: 1 },
    { field: "annualPrf", headerName: "Annual Profit", flex: 1 },
    { field: "risk1R", headerName: "Risk 1R", flex: 1 },
    { field: "duration", headerName: "Duration", flex: 1 },
    { field: "closeReason", headerName: "Close Reason", flex: 1 },
  ];

  // Prepare rows for the DataGrid
  const tradeHistoryRows = tradeHistoryAllData.map((row, index) => ({
    id: index,
    ...row,
  }));

  // Filter rows based on tradeHistorySearch
  const filteredTradeHistoryRows = tradeHistoryRows.filter((row) => {
    if (!tradeHistorySearch) return true;
    const searchLower = tradeHistorySearch.toLowerCase();
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchLower)
    );
  });

  // CSV export for the TradeHistoryAll table
  const exportCSV = () => {
    const headers = tradeHistoryColumns.map((col) => col.headerName).join(",");
    const csvRows = filteredTradeHistoryRows.map((row) => {
      return tradeHistoryColumns
        .map((col) => {
          let cell = row[col.field];
          if (cell === null || cell === undefined) cell = "";
          return `"${cell}"`;
        })
        .join(",");
    });
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "trade_history_all.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Card variant="outlined" sx={paperStyle}>
        <CardHeader
          title="Deployments"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            py: 2,
            px: 3,
            "& .MuiCardHeader-title": {
              fontSize: "1.25rem",
              fontWeight: "bold",
            },
          }}
        />
        <Box
          display="flex"
          bgcolor={theme.palette.background.default}
          sx={{ pb: 4, px: 2 }}
        >
          <Grid container spacing={2}>
            {/* List Section */}
            <Grid item xs={12} md={4}>
              <Paper elevation={6} sx={paperStyle}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Search Backtests Profile
                  </Typography>
                  <IconButton onClick={fetchData} color="primary" size="small">
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Search Backtests"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {loading ? (
                  <List>
                    {[...Array(5)].map((_, index) => (
                      <MuiListItemButton key={index}>
                        <Skeleton variant="text" width="100%" />
                      </MuiListItemButton>
                    ))}
                  </List>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <List
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    {filteredBacktests.map((deployment) => (
                      <React.Fragment key={deployment.requestId}>
                        <StyledListItem
                          selected={
                            selectedBacktest?.requestId === deployment.requestId
                          }
                          onClick={() => handleSelection(deployment)}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <DeploymentIcon color="action" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={deployment.name || deployment.requestId}
                            primaryTypographyProps={{ fontWeight: "medium" }}
                          />
                        </StyledListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Search Deployment
                  </Typography>
                  <IconButton
                    onClick={fetchDeploymentData}
                    color="primary"
                    size="small"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Search Deployments"
                  value={searchDeploymentText}
                  onChange={(e) => setSearchDeploymentText(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {loading ? (
                  <List>
                    {[...Array(5)].map((_, index) => (
                      <MuiListItemButton key={index}>
                        <Skeleton variant="text" width="100%" />
                      </MuiListItemButton>
                    ))}
                  </List>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <List
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    {filteredDeployments.map((deployment) => (
                      <React.Fragment
                        key={`${deployment.name}-${deployment.brokerage}`}
                      >
                        <StyledListItem
                          selected={
                            selectedDeployment?.name === deployment.name &&
                            selectedDeployment?.brokerage ===
                              deployment.brokerage
                          }
                          onClick={() => handleDeploymentSelection(deployment)}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <DeploymentIcon color="action" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={getDeploymentTextId(deployment)}
                            primaryTypographyProps={{ fontWeight: "medium" }}
                          />
                        </StyledListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Main Content Section */}
            <Grid item xs={12} md={8}>
              <Grid sx={{ mt: 2, mb: 2 }}>
                {backtests.length > 0 ? (
                  <Paper elevation={6} sx={paperStyle}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Backtest:{" "}
                      {selectedBacktest?.name ||
                        selectedBacktest?.requestId ||
                        ""}
                    </Typography>
                    <TextField
                      label="Backtest Details"
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
                          mb: 4,
                          borderRadius: 1,
                        },
                        spellCheck: false,
                      }}
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      variant="outlined"
                    />
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={2}
                      flexWrap="wrap"
                    >
                      <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <TextField
                          label="Initial Capital (Rs)"
                          type="number"
                          value={capital}
                          onChange={(e) =>
                            setCapital(parseFloat(e.target.value) || "")
                          }
                        />
                      </FormControl>
                      <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <LocalizationProvider
                          dateAdapter={AdapterDateFns}
                          locale={enIN}
                        >
                          <DatePicker
                            label="Deployment Date"
                            value={deploymentDate}
                            onChange={(newValue) => setDeploymentDate(newValue)}
                            inputFormat="dd-MM-yyyy"
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </LocalizationProvider>
                      </FormControl>
                      <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <InputLabel>Exchange</InputLabel>
                        <Select
                          value={exchange}
                          onChange={(e) => setExchange(e.target.value)}
                        >
                          <MenuItem value="NSE">NSE</MenuItem>
                          <MenuItem value="NSE">NASDAQ</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                        <InputLabel>Brokerage</InputLabel>
                        <Select
                          value={brokerage}
                          onChange={(e) => setBrokerage(e.target.value)}
                        >
                          <MenuItem value="ZERODHA">ZERODHA</MenuItem>
                          <MenuItem value="KOTAK">KOTAK</MenuItem>
                          <MenuItem value="HDFC">HDFC</MenuItem>
                          <MenuItem value="ICICI">ICICI</MenuItem>
                          <MenuItem value="OTHER">OTHER</MenuItem>
                        </Select>
                      </FormControl>
                      <Tooltip title="Deploy Strategy" arrow>
                        <IconButton
                          color="primary"
                          onClick={handleDeploy}
                          disabled={loading}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    flexDirection="column"
                    sx={{ m: 2 }}
                  >
                    <DeploymentIcon
                      sx={{ fontSize: 80, color: "text.secondary" }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Select a backtest to view details
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid sx={{ mt: 2, mb: 2 }}>
                {deployments.length > 0 ? (
                  <Paper elevation={6} sx={paperStyle}>
                    <Typography variant="h6" fontWeight="bold">
                      Deployment Details: {selectedDeploymentId || ""}
                    </Typography>
                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Deployment Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Brokerage
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Active
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Initial Capital
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Current Capital
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {deployments.map((dep) => (
                            <TableRow
                              key={`${dep.name}-${dep.brokerage}`}
                              hover
                              selected={
                                dep.name === selectedDeploymentId &&
                                dep.brokerage === selectedBrokerageId
                              }
                              onClick={() => {
                                setSelectedDeploymentId(dep.name);
                                setSelectedBrokerageId(dep.brokerage);
                                setSelectedDeploymentRequestId(dep.reqId);
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell>{dep.name}</TableCell>
                              <TableCell>{dep.deployedDate}</TableCell>
                              <TableCell>{dep.dataDate}</TableCell>
                              <TableCell>{dep.brokerage}</TableCell>
                              <TableCell>{dep.state}</TableCell>
                              <TableCell>{dep.active}</TableCell>
                              <TableCell>{dep.initialCapital}</TableCell>
                              <TableCell>{dep.currentCapital}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      mt={2}
                      width="100%"
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="stretch"
                        gap={2}
                        flexWrap="wrap"
                        width="100%"
                      >
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleView(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          color="info"
                          sx={{ ...actionItemStyle, flex: "1 1 0" }}
                        >
                          Holding
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleViewToDo(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          color="info"
                          sx={{ ...actionItemStyle, flex: "1 1 0" }}
                        >
                          DailyTradesToDo
                        </Button>
                        <Rebalance
                          selectedDeploymentId={selectedDeploymentId}
                        />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="stretch"
                        gap={2}
                        flexWrap="wrap"
                        width="100%"
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleActivate(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, flex: "1 1 0" }}
                        >
                          Activate
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleDeactivate(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, flex: "1 1 0" }}
                        >
                          Deactivate
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleDelete(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, flex: "1 1 0" }}
                        >
                          Delete
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          width: "100%",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(3, 1fr)",
                          },
                        }}
                      >
                        <FormControl>
                          <TextField
                            label="last N days"
                            type="number"
                            value={ndays}
                            size="small"
                            InputProps={{
                              sx: { height: "48px" },
                              inputProps: { min: 1 },
                            }}
                            sx={{ ...actionItemStyle, width: "100%" }}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value >= 1) {
                                setNdays(value);
                              } else if (!e.target.value) {
                                setNdays("");
                              }
                            }}
                          />
                        </FormControl>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleViewN(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, width: "100%" }}
                        >
                          TradesDone(last N-Days)
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleShow(
                              selectedDeploymentId,
                              selectedBrokerageId
                            )
                          }
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, width: "100%" }}
                        >
                          Strategy
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 2,
                          width: "100%",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(3, 1fr)",
                          },
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleTradeHistoryAll}
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, width: "100%" }}
                        >
                          TradeHistoryAll
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handlePerformance}
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, width: "100%" }}
                        >
                          Performance
                        </Button>
                        {/* Renamed Button to "AddCapital" */}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddCapitalOpen}
                          disabled={!selectedDeploymentId}
                          sx={{ ...actionItemStyle, width: "100%" }}
                        >
                          AddCapital
                        </Button>
                      </Box>
                      {isPopupOpen && (
                        <>
                          <div
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "white",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                              zIndex: 1000,
                              padding: "20px",
                              width: "80%",
                              maxWidth: "600px",
                              maxHeight: "80%",
                              overflowY: "auto",
                              textAlign: "center",
                            }}
                          >
                            <h3 style={{ marginBottom: "15px" }}>
                              Deployed - Backtest JSON
                            </h3>
                            <p
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "pre-wrap",
                                fontFamily: "'Courier New', Courier, monospace",
                                fontSize: "14px",
                                textAlign: "left",
                              }}
                            >
                              {apiResponse}
                            </p>
                            <button
                              onClick={handleClosePopup}
                              style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Close
                            </button>
                          </div>
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              zIndex: 999,
                            }}
                            onClick={handleClosePopup}
                          />
                        </>
                      )}
                    </Box>
                  </Paper>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    flexDirection="column"
                    sx={{ m: 2 }}
                  >
                    <DeploymentIcon
                      sx={{ fontSize: 80, color: "text.secondary" }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Select a deployed strategy to view details
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>

      {/* Existing TradeData Dialogs */}
      <TradeDataDialog
        open={openTradeDataDialog}
        onClose={() => setOpenTradeDataDialog(false)}
        tradeData={tradeData}
        name={selectedDeploymentId}
        message="Open Trades"
        showSell={false}
      />
      <TradeDataDialogToDo
        open={openTradeDataDialogToDo}
        onClose={() => setOpenTradeDataDialogToDo(false)}
        tradeData={tradeDataToDo}
        name={selectedDeploymentId}
      />
      <TradeDataDialog
        open={openTradeDataDialogN}
        onClose={() => setOpenTradeDataDialogN(false)}
        tradeData={tradeDataN}
        name={selectedDeploymentId}
        message={`Trades for ${ndays} days`}
        showSell={true}
      />

      {/* Show Performance Chart */}
      {showPerformanceChart && (
        <>
          <div style={chartContainerStyle}>
            <h3 style={{ marginBottom: "15px" }}>Capital Chart</h3>
            <Plot
              data={[
                {
                  x: performanceData ? performanceData.dates : [],
                  y: performanceData ? performanceData.netProfitValues : [],
                  type: "scatter",
                  mode: "lines+markers",
                  name: "NetProfit",
                },
                {
                  x: performanceData ? performanceData.dates : [],
                  y: performanceData
                    ? performanceData.unInvestedCapitalValues
                    : [],
                  type: "scatter",
                  mode: "lines+markers",
                  name: "UnInvestedCapital",
                },
                {
                  x: performanceData ? performanceData.dates : [],
                  y: performanceData ? performanceData.accountValValues : [],
                  type: "scatter",
                  mode: "lines+markers",
                  name: "accountVal",
                },
              ]}
              layout={{
                title: "Performance Chart",
                autosize: true,
                hovermode: "x unified",
                xaxis: {
                  showspikes: true,
                  spikemode: "across",
                  spikesnap: "cursor",
                  spikecolor: "grey",
                  spikethickness: 1,
                },
                legend: { orientation: "h", x: 0, y: -0.2 },
              }}
              style={{ width: "100%", height: chartHeight }}
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowPerformanceChart(false)}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsChartFullScreen(!isChartFullScreen)}
              >
                {isChartFullScreen ? "Exit Full Screen" : "Full Screen"}
              </Button>
            </Box>
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setShowPerformanceChart(false)}
          />
        </>
      )}

      {/* TradeHistoryAll Dialog */}
      <Dialog
        open={openTradeHistoryAllDialog}
        onClose={() => setOpenTradeHistoryAllDialog(false)}
        fullWidth
        maxWidth="lg"
        fullScreen={isTradeHistoryFullScreen}
      >
        <DialogTitle>Trade History All</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={tradeHistorySearch}
            onChange={(e) => setTradeHistorySearch(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ overflowX: "auto", width: "100%" }}>
            <DataGrid
              rows={filteredTradeHistoryRows}
              columns={tradeHistoryColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                minWidth: 2100,
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.grey[200],
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={exportCSV} variant="contained">
            Export CSV
          </Button>
          <Button
            onClick={() =>
              setIsTradeHistoryFullScreen(!isTradeHistoryFullScreen)
            }
            variant="contained"
          >
            {isTradeHistoryFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
          <Button
            onClick={() => setOpenTradeHistoryAllDialog(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* AddCapital Dialog */}
      <Dialog
        open={openAddCapitalDialog}
        onClose={handleAddCapitalClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Capital</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={capitalType}
                  onChange={(e) => setCapitalType(e.target.value)}
                >
                  <MenuItem value="ONETIME">ONETIME</MenuItem>
                  <MenuItem value="PERIODIC_MONTHLY">PERIODIC_MONTHLY</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capital Value"
                type="number"
                value={capitalValueInput}
                onChange={(e) => setCapitalValueInput(e.target.value)}
                inputProps={{ min: 1 }} // user can type below 1, but we'll validate on Submit
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={enIN}>
                <DatePicker
                  label="Select Date"
                  value={addCapitalDate}
                  onChange={(newValue) => setAddCapitalDate(newValue)}
                  inputFormat="dd-MM-yyyy"
                  minDate={new Date()} // blocks past dates in the UI
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            {capitalType === "PERIODIC_MONTHLY" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Number of months"
                  type="number"
                  value={numMonths}
                  onChange={(e) => setNumMonths(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Tooltip title="Add incremental capital plan">
                <Button
                  onClick={handleAddCapitalSubmit}
                  variant="contained"
                  fullWidth
                >
                  Add
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Tooltip title="View incremental capital plan">
                <Button
                  onClick={handleAddCapitalView}
                  variant="contained"
                  fullWidth
                >
                  View
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Tooltip title="Clear incremental capital plan">
                <Button
                  color="secondary"
                  onClick={handleAddCapitalClear}
                  variant="contained"
                  fullWidth
                >
                  Clear
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                onClick={handleAddCapitalClose}
                variant="outlined"
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default React.memo(Deployment);
