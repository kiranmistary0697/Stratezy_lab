// components/CodeEditor.js

import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Paper,
    TextareaAutosize,
    Button,
    useMediaQuery,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-java'; // For Java
import 'ace-builds/src-noconflict/mode-c_cpp'; // For C/C++
import 'ace-builds/src-noconflict/theme-monokai'; // Ensure the theme is imported as well
import ace from 'ace-builds/src-noconflict/ace';
import { useAuth } from '../V2/contexts/AuthContext.jsx';
import FunctionList from './FunctionList';
import { paperStyle } from './styles.js';
import { useMarket } from './MarketContext';

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.1/');
ace.config.set('workerPath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.23.1/');

const langTools = ace.require('ace/ext/language_tools'); // Initialize language tools

function CodeEditor({
    code,
    onChange,
    description,
    args,
    adesc,
    lexchange,
    darkMode,
    functionName,
    sFunction
}) {
    const { authToken, getAccessToken } = useAuth();
    const [currentCode, setCurrentCode] = useState(code || '');
    const [isEditable, setIsEditable] = useState(false); // Fields are non-editable by default
    const [numArgs, setNumArgs] = useState(adesc ? adesc.length : 0);
    const [desc, setDesc] = useState(description || '');
    const [editableArgs, setEditableArgs] = useState(args ? [...args] : []);
    const [editableArgsDesc, setEditableArgsDesc] = useState(adesc ? [...adesc] : []);
    const [name, setName] = useState(functionName || '');
    const [keywords, setKeywords] = useState([]);
    const [selectedFunction, setSelectedFunction] = useState({});
    const { getExchange } = useMarket();
    // State variables for checkboxes
    const [filterCheckbox, setFilterCheckbox] = useState(false);
    const [tradeCheckbox, setTradeCheckbox] = useState(false);
    const [usmarketCheckbox, setUsmarketCheckbox] = useState(lexchange === 'nasdaq' ? true: false);
    const [inmarketCheckbox, setInmarketCheckbox] = useState(lexchange === 'nse' ? true: false);    
    const [globalEntryCheckbox, setGlobalEntryCheckbox] = useState(false);
    const [globalExitCheckbox, setGlobalExitCheckbox] = useState(false);
    const [entryCheckbox, setEntryCheckbox] = useState(false);
    const [exitCheckbox, setExitCheckbox] = useState(false);
    const [sortCheckbox, setSortCheckbox] = useState(false);
    const [portfolioSizingCheckbox, setPortfolioSizingCheckbox] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // 'success', 'error', 'warning', 'info'

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };


    // Fetch keywords on component mount
    useEffect(() => {
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
                registerKeywords(response.data);
            } catch (error) {
                console.error('Failed to fetch keywords:', error);
            }
        };
        fetchKeywords();
    }, []);

    // Register keywords for autocompletion
    const registerKeywords = (keywordList) => {
        const customCompleter = {
            getCompletions: (editor, session, pos, prefix, callback) => {
                if (prefix.length === 0) return callback(null, []);
                const suggestions = keywordList.map((kw) => ({
                    caption: kw.name,
                    value: kw.value,
                    meta: kw.meta || 'keyword',
                }));
                callback(null, suggestions);
            },
        };
        langTools.addCompleter(customCompleter);
    };

    // Update fields when a new function is selected
    useEffect(() => {
        setCurrentCode(code || '');
        setDesc(description || '');
        setEditableArgs(args ? [...args] : []);
        setEditableArgsDesc(adesc ? [...adesc] : []);
        setName(functionName || '');
        setSelectedFunction(sFunction);
        setNumArgs(adesc ? adesc.length : 0);
        setFilterCheckbox(selectedFunction.filter);
        setTradeCheckbox(selectedFunction.buysell);
        setUsmarketCheckbox(selectedFunction.exchange == 'nasdaq' ? true: false);
        setInmarketCheckbox(selectedFunction.exchange === 'nse' ? true: false);
        setGlobalEntryCheckbox(selectedFunction.gentry);
        setGlobalExitCheckbox(selectedFunction.gexit);
        setEntryCheckbox(selectedFunction.entry);
        setExitCheckbox(selectedFunction.exit);
        setSortCheckbox(selectedFunction.sort);
        setPortfolioSizingCheckbox(selectedFunction.psizing);
    }, [code, description, args, adesc, functionName, selectedFunction]);

    // Adjust arguments arrays when numArgs changes
    useEffect(() => {
        const parsedNumArgs = numArgs;
        let argsArray = editableArgs ? [...editableArgs] : [];
        let argsDescArray = editableArgsDesc ? [...editableArgsDesc] : [];

        if (argsArray.length < parsedNumArgs) {
            // Add empty elements to reach desired length
            for (let i = argsArray.length; i < parsedNumArgs; i++) {
                argsArray.push('');
                argsDescArray.push('');
            }
        } else if (argsArray.length > parsedNumArgs) {
            // Remove excess elements
            argsArray = argsArray.slice(0, parsedNumArgs);
            argsDescArray = argsDescArray.slice(0, parsedNumArgs);
        }
        setEditableArgs(argsArray);
        setEditableArgsDesc(argsDescArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numArgs]);

    const handleDelete = async () => {
        try {
            console.log("deleting function - ", name)
            const latestToken = getAccessToken();
            const dataResp = await axios.get(
                //'http://localhost:8888/stock-analysis-function/delete/${name}',
                `https://stratezylabs.ai/stock-analysis-function/delete/${name}`,
                {
                    headers: { Authorization: `Bearer ${latestToken}` },
                }
            );
            //console.log(dataResp)
            setSnackbarMessage(dataResp.data.message);
            if (!dataResp.data.success) {
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error deleting function");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEdit = () => setIsEditable(!isEditable);

    const handleNew = () => {
        setCurrentCode('');
        setDesc('');
        setEditableArgs([]);
        setEditableArgsDesc([]);
        setNumArgs(0);
        setName('');
        // Reset checkboxes
        setFilterCheckbox(false);
        setTradeCheckbox(false);
        setInmarketCheckbox(false);
        setUsmarketCheckbox(false);
        setGlobalEntryCheckbox(false);
        setGlobalExitCheckbox(false);
        setEntryCheckbox(false);
        setExitCheckbox(false);
        setSortCheckbox(false);
        setPortfolioSizingCheckbox(false);
    };

    const handleSave = async () => {
        try {
            const requestBody = generateRequestBody();
            const latestToken = getAccessToken();
            const dataResp = await axios.post(
                //'http://localhost:8888/stock-analysis-function/save',
                'https://stratezylabs.ai/stock-analysis-function/save',
                requestBody,
                {
                    headers: { Authorization: `Bearer ${latestToken}` },
                }
            );
            setSnackbarMessage(dataResp.data.message);
            if (!dataResp.data.success) {
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Error Saving function");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleVerify = async () => {
        try {
            const latestToken = getAccessToken();
            const requestBody = generateRequestBody();
            const dataResp = await axios.post(
                //'http://localhost:8888/stock-analysis-function/verify',
                //'https://yuktitrade.com/stock-analysis-function/verify',
                'https://stratezylabs.ai/stock-analysis-function/verify',
                requestBody,
                {
                    headers: { Authorization: `Bearer ${latestToken}` },
                }
            );
            //console.log(dataResp);
            setSnackbarMessage(dataResp.data.message);
            if (!dataResp.data.success) {
                setSnackbarSeverity('error');
            }
            setSnackbarOpen(true);

        } catch (error) {
            console.error('Error verifying function:', error);
            setSnackbarMessage("Error verifying function");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const exchange = () => {
        if (inmarketCheckbox) {
            return "nse";
        } else if (usmarketCheckbox) {
            return "nasdaq";
        } else {
            return "nse";
        }
    }

    const generateRequestBody = () => ({
        func: name,
        rule: currentCode,
        exchange: exchange(),
        num_arg: numArgs,
        equation: `/config/library/${name}`,
        desc,
        args: editableArgs,
        adesc: editableArgsDesc,
        filter: filterCheckbox,
        buysell: tradeCheckbox,
        entry: entryCheckbox,
        exit: exitCheckbox,
        psizing: portfolioSizingCheckbox,
        gentry: globalEntryCheckbox,
        gexit: globalExitCheckbox,
        sort: sortCheckbox,
        ulying: selectedFunction.ulying,
        candle_stick: selectedFunction.candle_stick,
        future_rule: selectedFunction.future_rule,
        cacheable: selectedFunction.cacheable,
        static: selectedFunction.static,
        stockList: selectedFunction.stockList,
    });

    // Handle numArgs change
    const handleNumArgsChange = (e) => {
        const value = parseInt(e.target.value) || 0;
        setNumArgs(value >= 0 ? value : 0);
    };

    // Dynamic styles for editable fields
    const getInputStyles = () => ({
        '& .MuiInputBase-input.Mui-disabled': {
            backgroundColor: isEditable ? '#fff' : '#f5f5f5',
            color: isEditable ? 'inherit' : 'rgba(0, 0, 0, 0.6)',
        },
    });

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
            sx={{
                fontFamily: 'Inter, sans-serif',
                p: isSmallScreen ? 1 : 2,
                overflowY: 'auto', // Add vertical scrolling
                //maxHeight: '100vh', // Limit height to viewport height
            }}
        >
            {/* Name Card */}
            <Paper elevation={6} sx={paperStyle}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{
                                readOnly: !isEditable,
                            }}
                            variant="outlined"
                            sx={getInputStyles()}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Function Description */}
            <Paper elevation={3} sx={paperStyle}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Function Description
                </Typography>
                <TextareaAutosize
                    minRows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5em',
                        fontSize: '1rem',
                        borderRadius: '4px',
                        border: isEditable ? '1px solid #ccc' : '1px solid transparent',
                        backgroundColor: isEditable ? '#fff' : '#f5f5f5',
                        color: isEditable ? 'inherit' : 'rgba(0, 0, 0, 0.6)',
                        resize: 'vertical',
                    }}
                    readOnly={!isEditable}
                />
            </Paper>

            {/* Checkboxes */}
            <Paper elevation={6} sx={paperStyle}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filterCheckbox}
                                    onChange={(e) => setFilterCheckbox(e.target.checked)}
                                    name="filter"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="Filter"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tradeCheckbox}
                                    onChange={(e) => setTradeCheckbox(e.target.checked)}
                                    name="trade"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="Trade"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={globalEntryCheckbox}
                                    onChange={(e) => setGlobalEntryCheckbox(e.target.checked)}
                                    name="globalEntry"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="GlobalEntry"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={globalExitCheckbox}
                                    onChange={(e) => setGlobalExitCheckbox(e.target.checked)}
                                    name="globalExit"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="GlobalExit"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={entryCheckbox}
                                    onChange={(e) => setEntryCheckbox(e.target.checked)}
                                    name="entry"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="Entry"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={exitCheckbox}
                                    onChange={(e) => setExitCheckbox(e.target.checked)}
                                    name="exit"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="Exit"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sortCheckbox}
                                    onChange={(e) => setSortCheckbox(e.target.checked)}
                                    name="sort"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="Sort"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={portfolioSizingCheckbox}
                                    onChange={(e) => setPortfolioSizingCheckbox(e.target.checked)}
                                    name="portfolioSizing"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="PortfolioSizing"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={usmarketCheckbox}
                                    onChange={(e) => setUsmarketCheckbox(e.target.checked)}
                                    name="usmarket"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="US market"
                        />
                    </Grid>   
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={inmarketCheckbox}
                                    onChange={(e) => setInmarketCheckbox(e.target.checked)}
                                    name="indiamarket"
                                    color="primary"
                                    disabled={!isEditable}
                                />
                            }
                            label="India market"
                        />
                    </Grid>                                      
                </Grid>
            </Paper>

            {/* Code Editor */}
            <Paper
                elevation={6}
                sx={{
                    mb: 4,
                    border: isEditable ? '1px solid #ccc' : '1px solid transparent',
                }}
            >
                <AceEditor
                    mode="c_cpp"
                    theme="monokai"
                    name="code-editor"
                    value={currentCode}
                    onChange={setCurrentCode}
                    width="100%"
                    height="600px"
                    fontSize={16}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                    readOnly={!isEditable}
                />
            </Paper>

            {/* Action Buttons */}
            <Box
                display="flex"
                flexDirection={isSmallScreen ? 'column' : 'row'}
                alignItems="center"
                mb={2}
                gap={1}
            // flexWrap can help if needed on larger screens:
            // flexWrap={!isSmallScreen ? 'wrap' : 'nowrap'}
            >
                <TextField
                    label="Number of Arguments"
                    value={numArgs}
                    onChange={handleNumArgsChange}
                    InputProps={{ readOnly: !isEditable }}
                    variant="outlined"
                    sx={{
                        width: isSmallScreen ? '100%' : '15%',
                        ...getInputStyles(),
                    }}
                    type="number"
                    inputProps={{ min: 0 }}
                />

                <Button
                    variant="outlined"
                    onClick={handleNew}
                    sx={{
                        flexGrow: 1,
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    New
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleEdit}
                    sx={{
                        flexGrow: 1,
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    {isEditable ? 'Lock' : 'Edit'}
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleVerify}
                    disabled={!isEditable}
                    sx={{
                        flexGrow: 1,
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    Verify
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!isEditable}
                    sx={{
                        flexGrow: 1,
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    Save
                </Button>

                <Button
                    variant="outlined"
                    onClick={handleDelete}
                    sx={{
                        flexGrow: 1,
                        width: isSmallScreen ? '100%' : 'auto',
                    }}
                >
                    Delete
                </Button>
            </Box>


            {/* Arguments Section */}
            <Paper elevation={6} sx={paperStyle}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Arguments description and default value
                </Typography>
                {editableArgsDesc && editableArgsDesc.length > 0 ? (
                    editableArgsDesc.map((argDesc, index) => (
                        <Grid
                            container
                            spacing={2}
                            key={index}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label={`Argument description ${index + 1}`}
                                    value={argDesc || ''}
                                    onChange={(e) => {
                                        const newArgsDesc = [...editableArgsDesc];
                                        newArgsDesc[index] = e.target.value;
                                        setEditableArgsDesc(newArgsDesc);
                                    }}
                                    InputProps={{ readOnly: !isEditable }}
                                    variant="outlined"
                                    sx={getInputStyles()}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Value"
                                    value={editableArgs[index] || ''}
                                    onChange={(e) => {
                                        const newArgs = [...editableArgs];
                                        newArgs[index] = e.target.value;
                                        setEditableArgs(newArgs);
                                    }}
                                    InputProps={{ readOnly: !isEditable }}
                                    variant="outlined"
                                    sx={getInputStyles()}
                                />
                            </Grid>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No arguments to display.
                    </Typography>
                )}
            </Paper>
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
                        whiteSpace: 'pre-wrap',   // Ensures newlines are respected
                        fontFamily: 'monospace',  // Monospace font for alignment
                        fontSize: '14px',         // Optional: Adjust font size
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default CodeEditor;
