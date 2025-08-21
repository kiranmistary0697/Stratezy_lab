import { useEffect, useMemo, useState, forwardRef } from "react";
import {
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Tooltip,
} from "@mui/material";
import {
  FullscreenRounded,
  FullscreenExitRounded,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useLazyGetQuery } from "../../../../../slices/api";
import { tagTypes } from "../../../../tagTypes";
import Plot from "react-plotly.js";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CompareIndex = ({ data = {} }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isSmDown = useMediaQuery(theme.breakpoints.down("md")); // <900px
  const gridColor = theme.palette.mode === "dark" ? "#444" : "#e0e0e0";
  const paper = theme.palette.background.paper;

  const { reqId } = data || {};
  const [triggerGetChart] = useLazyGetQuery();
  const [preparedData, setPreparedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [fsOpen, setFsOpen] = useState(false);
  useEffect(() => {
    if (fsOpen) {
      const t = setTimeout(
        () => window.dispatchEvent(new Event("resize")),
        120
      );
      return () => clearTimeout(t);
    }
  }, [fsOpen]);

  useEffect(() => {
    let cancelled = false;
    const fetchDeployData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await triggerGetChart({
          endpoint: `command/backtest/chart?symbol=&stage=trade&id=${
            reqId ?? ""
          }&substage=comparewithindex`,
          tags: [tagTypes.GET_CHART],
        }).unwrap();
        const payload = res?.data ?? res;
        if (!cancelled) prepareData(payload);
      } catch (e) {
        console.error("Failed to fetch chart data:", e);
        if (!cancelled) {
          setErr(e?.message || "Failed to load chart data");
          setPreparedData([]);
        }
      } finally {
        !cancelled && setLoading(false);
      }
    };

    fetchDeployData();
    return () => {
      cancelled = true;
    };
  }, [reqId, triggerGetChart]);

  const prepareData = (raw) => {
    if (!raw || typeof raw !== "object") return setPreparedData([]);
    let seriesData = [];

    Object.keys(raw).forEach((seriesName) => {
      const chartRes = raw[seriesName];
      if (chartRes?.error) return;
      const valueMap = chartRes?.valueMap;
      if (!valueMap) return;

      const dateValues = Object.keys(valueMap)
        .map((dateStr) => {
          const d = new Date(dateStr);
          if (Number.isNaN(d.getTime())) return null;
          const v = valueMap[dateStr];
          const num =
            typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
          return Number.isFinite(num) ? { date: d, value: num } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);

      if (dateValues.length) {
        seriesData = seriesData.concat(
          dateValues.map((item) => ({
            Date: item.date,
            Value: item.value,
            Series: seriesName,
            ChartType: chartRes.chartType?.toLowerCase() || "line",
            YAxis: chartRes.yaxis?.toLowerCase() || "y1",
          }))
        );
      }
    });

    setPreparedData(seriesData);
  };

  const plotData = useMemo(() => {
    if (!preparedData || preparedData.length === 0) return [];
    const seriesMap = new Map();

    for (const p of preparedData) {
      if (!seriesMap.has(p.Series)) {
        const isArea = (p.ChartType || "line") === "area";
        seriesMap.set(p.Series, {
          x: [],
          y: [],
          type: "scattergl",
          mode: isArea ? "lines" : isXs ? "lines" : "lines+markers",
          fill: isArea ? "tozeroy" : "none",
          name: p.Series,
          yaxis: p.YAxis === "y2" ? "y2" : "y1",
          marker: { size: isXs ? 2 : 3 },
          line: { width: isXs ? 1 : 1.25 },
        });
      }
      const s = seriesMap.get(p.Series);
      s.x.push(p.Date);
      s.y.push(p.Value);
    }
    return Array.from(seriesMap.values());
  }, [preparedData, isXs]);

  const y1Values = (preparedData || [])
    .filter((d) => d.YAxis === "y1")
    .map((d) => d.Value);
  const y2Values = (preparedData || [])
    .filter((d) => d.YAxis === "y2")
    .map((d) => d.Value);
  const y1Range = y1Values.length
    ? [Math.min(...y1Values), Math.max(...y1Values)]
    : undefined;
  const y2Range = y2Values.length
    ? [Math.min(...y2Values), Math.max(...y2Values)]
    : undefined;

  const bottomLegend = {
    orientation: "h",
    x: 0.5,
    xanchor: "center",
    y: -0.25,
    yanchor: "top",
    font: { size: isXs ? 10 : 12 },
    itemwidth: isXs ? 30 : 50,
    bgcolor: "rgba(0,0,0,0)",
    borderwidth: 0,
  };

  const baseLayout = useMemo(() => {
    // EXTRA TOP MARGIN on phones to make room for the overlay icon
    const margin = isXs
      ? { l: 44, r: 10, t: 48, b: 56 } // was t: 8 → now 48
      : isSmDown
      ? { l: 64, r: 40, t: 24, b: 64 } // a bit more on small tablets too
      : { l: 80, r: 80, t: 28, b: 72 };

    return {
      autosize: true,
      margin,
      xaxis: {
        title: isSmDown ? undefined : "Date",
        showgrid: true,
        gridcolor: gridColor,
        tickfont: { size: isXs ? 9 : 12 },
        rangeslider: { visible: !isXs, thickness: 0.05 },
      },
      yaxis: {
        title: isXs ? undefined : { text: "Primary Y-Axis", standoff: 20 },
        automargin: true,
        gridcolor: gridColor,
        tickfont: { size: isXs ? 9 : 12 },
        range: y1Range,
      },
      yaxis2: {
        title: isXs ? undefined : { text: "Secondary Y-Axis", standoff: 20 },
        automargin: true,
        overlaying: "y",
        side: "right",
        tickfont: { size: isXs ? 9 : 12 },
        range: y2Range,
        showgrid: false,
      },
      legend: bottomLegend,
      hovermode: "x unified",
      dragmode: "pan",
      paper_bgcolor: paper,
      plot_bgcolor: paper,
      uirevision: "keep",
      annotations:
        preparedData && preparedData.length === 0
          ? [
              {
                text: err ? "Failed to load chart data" : "No data",
                xref: "paper",
                yref: "paper",
                x: 0.5,
                y: 0.5,
                showarrow: false,
                font: { size: 14, color: theme.palette.text.secondary },
              },
            ]
          : [],
    };
  }, [
    isXs,
    isSmDown,
    gridColor,
    paper,
    y1Range,
    y2Range,
    preparedData,
    err,
    theme.palette.text.secondary,
  ]);

  const baseConfig = useMemo(
    () => ({
      responsive: true,
      displayModeBar: false,
      displaylogo: false,
      doubleClick: "autosize",
      scrollZoom: false,
    }),
    []
  );

  const fsLayout = useMemo(
    () => ({
      ...baseLayout,
      margin: { l: 56, r: 24, t: 16, b: 96 },
      xaxis: {
        ...baseLayout.xaxis,
        rangeslider: { visible: true, thickness: 0.05 },
      },
      legend: bottomLegend,
    }),
    [baseLayout, bottomLegend]
  );
  const fsConfig = useMemo(
    () => ({ ...baseConfig, displayModeBar: false, scrollZoom: true }),
    [baseConfig]
  );

  return (
    <>
      <Box
        className="w-full"
        sx={{
          px: { xs: 1.25, sm: 2, md: 3 },
          py: { xs: 1.25, sm: 2 },
          maxWidth: "100%",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CircularProgress size={18} />
            <Typography variant="body2">Loading chart…</Typography>
          </Box>
        )}

        <Box sx={{ position: "relative" }}>
          <Tooltip title="Full screen" arrow>
            <IconButton
              size="small"
              onClick={() => setFsOpen(true)}
              aria-label="Open full screen"
              sx={{
                position: "absolute",
                top: 6, // slightly tighter
                right: 6,
                zIndex: 1100,
                bgcolor: "action.hover",
                "&:hover": { bgcolor: "action.selected" },
                boxShadow: 1,
              }}
            >
              <FullscreenRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          <Plot
            data={plotData}
            layout={baseLayout}
            config={baseConfig}
            useResizeHandler
            style={{
              width: "100%",
              height: isXs ? "44vh" : "60vh",
              minHeight: 260,
            }}
          />
        </Box>
      </Box>

      <Dialog
        fullScreen
        open={fsOpen}
        onClose={() => setFsOpen(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setFsOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Performance
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setFsOpen(false)}
              aria-label="exit full screen"
            >
              <FullscreenExitRounded />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          <Plot
            data={plotData}
            layout={fsLayout}
            config={fsConfig}
            useResizeHandler
            style={{
              width: "100%",
              height: `calc(100dvh - ${isXs ? 56 : 64}px)`,
              minHeight: 320,
            }}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default CompareIndex;
