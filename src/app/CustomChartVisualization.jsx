// CustomChartVisualization.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputForm from './InputForm';
import ChartDisplay from './ChartDisplay';
import {
    Typography,
    Box,
    Snackbar,
    Alert,
    useTheme,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';
import { useAuth } from '../V2/contexts/AuthContext.jsx';
import { paperStyle } from './styles.js';
import { useMarket } from './MarketContext';

function CustomChartVisualization({
    endDate,
    startDate,
    symbol,
    varList1,
    varList2,
    customRule,
    data,
    dataFetched,
    loading,
    error,
    setChartData,
}) {
    const theme = useTheme();
    const { authToken, getAccessToken } = useAuth();
    const { getExchange } = useMarket();
    // Internal state variables
    const [internalEndDate, setInternalEndDate] = useState(endDate);
    const [internalStartDate, setInternalStartDate] = useState(startDate);
    const [internalSymbol, setInternalSymbol] = useState(symbol);
    const [internalVarList1, setInternalVarList1] = useState(varList1);
    const [internalVarList2, setInternalVarList2] = useState(varList2);
    const [internalCustomRule, setInternalCustomRule] = useState(customRule);
    const [internalData, setInternalData] = useState(data);
    const [internalDataFetched, setInternalDataFetched] = useState(dataFetched);
    const [internalLoading, setInternalLoading] = useState(loading);
    const [internalError, setInternalError] = useState(error);
    const [fullScreen, setFullScreen] = useState(false);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Update parent component state
    useEffect(() => {
        setChartData({
            endDate: internalEndDate,
            startDate: internalStartDate,
            symbol: internalSymbol,
            varList1: internalVarList1,
            varList2: internalVarList2,
            customRule: internalCustomRule,
            data: internalData,
            dataFetched: internalDataFetched,
            loading: internalLoading,
            error: internalError,
        });
    }, [
        internalEndDate,
        internalStartDate,
        internalSymbol,
        internalVarList1,
        internalVarList2,
        internalCustomRule,
        internalData,
        internalDataFetched,
        internalLoading,
        internalError,
        setChartData,
    ]);

    const postCustomData = async (authToken, requestData) => {
        const latestToken = getAccessToken();
        const url = 'https://stratezylabs.ai/command/chart/request';
        const headers = {
            Authorization: `Bearer ${latestToken}`,
            'Content-Type': 'application/json',
        };
        try {
            const response = await axios.post(url, requestData, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async () => {
        setInternalLoading(true);
        setInternalError(null);
        const requestData = {
            exchange: getExchange(),
            zeroDate: internalEndDate.toISOString().split('T')[0],
            ndate: internalStartDate.toISOString().split('T')[0],
            symbol: internalSymbol,
            chartRule: {
                ruleType: 'CHART_RULE',
                ruleSubType: 'CUSTOM_RULE',
                //customRule: internalCustomRule.replace(/\n/g, ' ').replace(/\r/g, ' '),
                customRule: internalCustomRule
            },
            varList1: internalVarList1
                ? internalVarList1.split(',').map((v) => v.trim())
                : [],
            varList2: internalVarList2
                ? internalVarList2.split(',').map((v) => v.trim())
                : [],
        };

        try {
            const dataResp = await postCustomData(authToken, requestData);
            if (dataResp.error) {
                setSnackbarMessage(dataResp.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setInternalLoading(false);
                return;
            }
            const dataMap = dataResp['chartResMap'];
            const preparedData = prepareData(dataMap);
            setInternalData(preparedData);
            setInternalDataFetched(true);
            setInternalLoading(false);
        } catch (error) {
            setInternalError(`Error fetching data: ${error.message}`);
            setInternalLoading(false);
        }
    };

    const prepareData = (dataMap) => {
        const seriesData = [];
        for (const seriesName in dataMap) {
            const chartRes = dataMap[seriesName];
            if ('error' in chartRes) {
                setInternalError(`No data found: ${chartRes['error']['message']}`);
                continue;
            }
            const valueMap = chartRes['valueMap'];
            if (!valueMap) {
                setInternalError(`No data available for series '${seriesName}'.`);
                continue;
            }

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
                    ChartType: chartRes['chartType']
                        ? chartRes['chartType'].toLowerCase()
                        : 'line',
                    YAxis: chartRes['yaxis'] ? chartRes['yaxis'].toLowerCase() : 'y1',
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

        const markerStyles = ['circle', 'square', 'diamond', 'cross', 'x'];
        const lineDashStyles = ['solid', 'dash', 'dot', 'dashdot'];

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
            const yaxis = yAxis === 'y2' ? 'y2' : 'y';

            let trace = {
                x: dates,
                y: values,
                name: series,
                type: 'scatter',
                mode: chartType === 'line' ? 'lines+markers' : 'lines',
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
            if (chartType === 'area') {
                trace.fill = 'tozeroy';
                trace.mode = 'lines';
            }

            traces.push(trace);
        });

        const y1Range = internalData
            .filter((series) => series.YAxis === 'y1')
            .map((series) => series.Value);
        const y2Range = internalData
            .filter((series) => series.YAxis === 'y2')
            .map((series) => series.Value);

        const y1Min = y1Range.length ? Math.min(...y1Range.flat()) : 0;
        const y1Max = y1Range.length ? Math.max(...y1Range.flat()) : 1;
        const y2Min = y2Range.length ? Math.min(...y2Range.flat()) : 0;
        const y2Max = y2Range.length ? Math.max(...y2Range.flat()) : 1;

        const layout = {
            xaxis: {
                title: 'Date',
                showline: true,
                showgrid: false,
                zeroline: true,
                showticklabels: false,
                showspikes: true,
                spikemode: 'across',
                spikesnap: 'cursor',
                spikedash: 'solid',
                spikethickness: 1,
                spikecolor: theme.palette.divider,
                hoverformat: '%Y-%m-%d',
            },
            yaxis: {
                title: 'Primary Y-Axis',
                range: [y1Min, y1Max],
                showgrid: true,
                autorange: false,
                showline: true,
                showticklabels: true,
            },
            yaxis2: {
                title: 'Secondary Y-Axis',
                range: [y2Min, y2Max],
                overlaying: 'y',
                side: 'right',
                showgrid: false,
                autorange: false,
                showline: true,
                showticklabels: true,
            },
            template: theme.palette.mode === 'dark' ? 'plotly_dark' : 'plotly_white',
            hovermode: 'x unified',
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

    return (
        <Card variant="outlined" sx={paperStyle}>
            <CardHeader
                title="Custom Rule development and testing"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                }}
            />
            {/*<CardContent sx={paperStyle}>*/}

            <InputForm
                internalSymbol={internalSymbol}
                setInternalSymbol={setInternalSymbol}
                internalVarList1={internalVarList1}
                setInternalVarList1={setInternalVarList1}
                internalVarList2={internalVarList2}
                setInternalVarList2={setInternalVarList2}
                internalStartDate={internalStartDate}
                setInternalStartDate={setInternalStartDate}
                internalEndDate={internalEndDate}
                setInternalEndDate={setInternalEndDate}
                internalCustomRule={internalCustomRule}
                setInternalCustomRule={setInternalCustomRule}
                internalError={internalError}
                internalLoading={internalLoading}
                handleSubmit={handleSubmit}
            />

            {internalDataFetched && internalData && internalData.length > 0 ? (
                <ChartDisplay
                    internalData={internalData}
                    fullScreen={fullScreen}
                    setFullScreen={setFullScreen}
                    generatePlot={generatePlot}
                />
            ) : null}

            {internalDataFetched && (!internalData || internalData.length === 0) && (
                <Typography color="error" sx={{ mt: 4 }}>
                    No data available to plot
                </Typography>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/*</CardContent>*/}
        </Card>
    );
}

export default CustomChartVisualization;
