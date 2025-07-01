// ChartDisplay.js
import React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    useTheme,
    Paper,
    Box,
} from '@mui/material';
import Plot from 'react-plotly.js';
import { paperStyle } from './styles';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

function ChartDisplay({ internalData, fullScreen, setFullScreen, generatePlot }) {
    const theme = useTheme();

    if (!internalData || internalData.length === 0) {
        return null;
    }

    const { traces, layout } = generatePlot();

    return (
        <Card variant="outlined" sx={paperStyle}>
            <CardHeader
                title="Chart"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                }}
                action={
                    <IconButton
                        onClick={() => setFullScreen(!fullScreen)}
                        aria-label="Toggle Fullscreen"
                        sx={{ color: theme.palette.primary.contrastText }}
                    >
                        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                }
            />
            {/*<CardContent sx={paperStyle}>*/}
                {fullScreen ? (
                <Box
                    //elevation={4}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 2000,
                        backgroundColor: theme.palette.background.default,
                        display: 'flex',
                        flexDirection: 'column', // Key to ensure proper resizing
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton onClick={() => setFullScreen(false)} aria-label="Exit Fullscreen">
                            <FullscreenExitIcon />
                        </IconButton>
                    </Box>

                    {/* Flexible container for the chart */}
                    <Box sx={{
                        position: 'relative',
                        flex: 1,                 // Allow this Box to expand
                        width: '100%',           // Full width
                        height: '100%',          // Full height
                        display: 'flex',         // Flex again if needed
                        flexDirection: 'column', // Column layout
                    }}>
                        <Plot
                            data={traces}
                            layout={{
                                ...layout,
                                autosize: true, // Ensure autosize is enabled
                            }}
                            config={{
                                responsive: true,
                                displayModeBar: false,    
                                displaylogo: false,     
                            }}
                            useResizeHandler
                            style={{
                                width: '100%',  // Full width of parent
                                height: '100%', // Full height of parent
                            }}
                        />
                    </Box>
                </Box>
                ) : (
                    <Box sx={{ width: '100%', height: 600 }}>
                        <Plot
                            data={traces}
                            layout={layout}
                            config={{ responsive: true,
                                displayModeBar: false,    
                                displaylogo: false,     
                             }}
                            useResizeHandler
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                )}
            {/*</CardContent>*/}
        </Card>
    );
}

export default ChartDisplay;
