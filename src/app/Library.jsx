// Library.js
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    List,
    ListItemText,
    Divider,
    Paper,
    Typography,
    CircularProgress,
    Grid,
    Switch,
    FormControlLabel,
    ListItemButton,
    IconButton,
    useMediaQuery,
    Card,
    CardHeader,
    InputAdornment,
    ListItemAvatar,
    Snackbar,
    Alert,
    Skeleton,
    ListItemButton as MuiListItemButton,
    useTheme,
    Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Search as SearchIcon,
    LibraryBooks as LibraryBooksIcon,
    Functions as FunctionIcon,
} from '@mui/icons-material';
import { useAuth } from '../V2/contexts/AuthContext.jsx';
import RefreshIcon from '@mui/icons-material/Refresh';
import FunctionList from './FunctionList';
import { paperStyle } from './styles';

// Lazy load CodeEditor for performance optimization
const CodeEditor = lazy(() => import('./CodeEditor'));

const StyledListItem = styled(MuiListItemButton)(({ theme, ...props }) => ({
    backgroundColor: props.selected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

function Library({ darkMode, setDarkMode }) {
    const { authToken, getAccessToken } = useAuth();
    const theme = useTheme();
    const [functionsList, setFunctionsList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [keywords, setKeywords] = useState([]);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [checkboxStates, setCheckboxStates] = useState({
        Filter: false,
        Trade: false,
        Entry: false,
        Exit: false,
        GEntry: false,
        GExit: false,
        PSizing: false,
        Order: false,
        StaticFunc: false,
        Underlying: false,
        Cacheable: false,
    });

    // Load persisted state from sessionStorage
    useEffect(() => {
        const storedFunction = sessionStorage.getItem('selectedFunction');
        if (storedFunction) setSelectedFunction(JSON.parse(storedFunction));
    }, []);

    // Fetch keywords on component mount
    useEffect(() => {
        fetchKeywords();
    }, []);

    // Fetch functions list
    useEffect(() => {
        const controller = new AbortController();
        fetchFunctions();
        return () => controller.abort();
    }, []);

    const fetchKeywords = async () => {
        const latestToken = getAccessToken();
        try {
            const response = await axios.get(
                //'http://localhost:8888/stock-analysis-function/keywords',
                'https://stratezylabs.ai/stock-analysis-function/keywords',
                {
                    headers: { Authorization: `Bearer ${latestToken}` },
                }
            );
            setKeywords(response.data);
        } catch (error) {
            console.error('Failed to fetch keywords:', error);
        }
    };

    const fetchFunctions = async () => {
        const latestToken = getAccessToken();
        setLoading(true);
        try {
            const response = await axios.get(
                //'http://localhost:8888/stock-analysis-function/list',
                'https://stratezylabs.ai/stock-analysis-function/list',
                {
                    headers: { Authorization: `Bearer ${latestToken}` },
                    //signal: controller.signal,
                }
            );
            setFunctionsList(response.data);
        } catch (error) {
            if (!axios.isCancel(error)) {
                setError('Failed to load functions. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (event, label) => {
        const isChecked = event.target.checked;
        const latestToken = getAccessToken();
        // Update the state for all checkboxes
        setCheckboxStates((prevStates) => {
            const updatedStates = { ...prevStates, [label]: isChecked };

            // Construct the body payload
            const payload = {
                filter: updatedStates.Filter || false,
                trade: updatedStates.Trade || false,
                entry: updatedStates.Entry || false,
                exit: updatedStates.Exit || false,
                gentry: updatedStates.GEntry || false,
                gexit: updatedStates.GExit || false,
                psizing: updatedStates.PSizing || false,
                order: updatedStates.Order || false,
                staticFunc: updatedStates.StaticFunc || false,
                underlying: updatedStates.Underlying || false,
                cacheable: updatedStates.Cacheable || false,
            };

            // Send POST request
            fetch('https://stratezylabs.ai/stock-analysis-function/type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${latestToken}`,
                },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    setFunctionsList(data); // Update the functionsList state with the response data
                    //console.log('API Response:', data);
                })
                .catch((error) => console.error('API Error:', error));

            return updatedStates;
        });
    };


    const handleFunctionSelect = useCallback(
        async (functionName) => {
            const latestToken = getAccessToken();
            try {
                const response = await axios.get(
                    //`http://localhost:8888/stock-analysis-function/${functionName}`,
                    `https://stratezylabs.ai/stock-analysis-function/${functionName}`,
                    {
                        headers: { Authorization: `Bearer ${latestToken}` },
                    }
                );
                setSelectedFunction(response.data);
                sessionStorage.setItem('selectedFunction', JSON.stringify(response.data));
            } catch (error) {
                setError('Failed to load function details.');
            }
        },
        []
    );

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredFunctions = useMemo(
        () =>
            functionsList.filter((func) =>
                func.toLowerCase().includes(searchText.toLowerCase())
            ),
        [functionsList, searchText]
    );
    return (
        <Card variant="outlined" sx={paperStyle}>
            <CardHeader
                title="Library Functions"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                }}
            />
            <Box
                display="flex"
                minHeight="calc(100vh - 64px)"
                bgcolor="background.default"
            >
                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: { xs: 'auto', md: 'hidden' },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mx: 2,
                            }}
                        >
                            {/* Top Section */}
                            <Paper elevation={3} sx={paperStyle}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Search Functions
                                    </Typography>
                                    <IconButton onClick={fetchFunctions}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>

                                {/* Checkboxes */}
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: {
                                                    xs: 'repeat(1, 1fr)',
                                                    sm: 'repeat(2, 1fr)',
                                                },
                                                gap: 2,
                                            }}
                                        >
                                            {[
                                                { label: 'Filter', key: 'Filter' },
                                                { label: 'Trade', key: 'Trade' },
                                                { label: 'Entry', key: 'Entry' },
                                                { label: 'GEntry', key: 'GEntry' },
                                                { label: 'Order', key: 'Order' },
                                                { label: 'PSizing', key: 'PSizing' },
                                                { label: 'Exit', key: 'Exit' },
                                                { label: 'GExit', key: 'GExit' },
                                            ].map(({ label, key }) => (
                                                <FormControlLabel
                                                    key={key}
                                                    control={
                                                        <Checkbox
                                                            checked={checkboxStates[key]}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(e, key)
                                                            }
                                                        />
                                                    }
                                                    label={label}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Search Box */}
                                <TextField
                                    fullWidth
                                    label="Search"
                                    value={searchText}
                                    onChange={handleSearchChange}
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

                                {/* Function List with fixed height */}
                                <List
                                    sx={{
                                        overflowY: 'auto',
                                        maxHeight: '400px', // Adjust to fit ~10 items
                                    }}
                                >
                                    {loading ? (
                                        [...Array(5)].map((_, index) => (
                                            <MuiListItemButton key={index}>
                                                <Skeleton variant="text" width="100%" />
                                            </MuiListItemButton>
                                        ))
                                    ) : error ? (
                                        <Typography color="error">{error}</Typography>
                                    ) : (
                                        filteredFunctions.map((func) => (
                                            <React.Fragment key={func}>
                                                <StyledListItem
                                                    selected={selectedFunction?.func === func}
                                                    onClick={() => handleFunctionSelect(func)}
                                                >
                                                    <ListItemAvatar>
                                                        <FunctionIcon color="action" />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={func} />
                                                </StyledListItem>
                                                <Divider />
                                            </React.Fragment>
                                        ))
                                    )}
                                </List>
                            </Paper>

                            {/* Bottom Section - keyword list with fixed height */}
                            <Paper elevation={3} sx={paperStyle}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Keywords
                                    </Typography>
                                    <IconButton onClick={fetchKeywords}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>

                                {/* Wrap FunctionList in a Box with fixed height */}
                                <Box
                                    sx={{
                                        overflowY: 'auto',
                                        maxHeight: '400px', // Adjust similarly here
                                    }}
                                >
                                    <FunctionList data={keywords} />
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Right Column */}
                    <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {selectedFunction ? (
                            <Suspense fallback={<CircularProgress />}>
                                <CodeEditor
                                    code={selectedFunction.rule}
                                    onChange={(newCode) =>
                                        console.log('Updated code')
                                    }
                                    description={selectedFunction.desc}
                                    args={selectedFunction.args}
                                    adesc={selectedFunction.adesc}
                                    lexchange={selectedFunction.exchange}
                                    darkMode={darkMode}
                                    functionName={selectedFunction.shortFuncName}
                                    sFunction={selectedFunction}
                                />
                            </Suspense>
                        ) : (
                            !isSmallScreen && (
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                    flexDirection="column"
                                >
                                    <LibraryBooksIcon
                                        sx={{ fontSize: 80, color: 'text.secondary' }}
                                    />
                                    <Typography
                                        variant="h6"
                                        color="textSecondary"
                                        sx={{ mt: 2 }}
                                    >
                                        Select a function to view details
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Grid>
                </Grid>
            </Box>

            {/* Error Snackbar */}
            {error && (
                <Snackbar
                    open
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setError('')}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </Card>
    );



}

export default React.memo(Library);
