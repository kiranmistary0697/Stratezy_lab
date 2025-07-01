// components/FunctionList.js
import React, { useState } from 'react';
import {
    Typography,
    useTheme,
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    ListItemIcon,
    Box,
    TextField, // Import TextField
} from '@mui/material';

import {
    LibraryBooks as LibraryBooksIcon,
    Functions as FunctionIcon,
} from '@mui/icons-material';

import CloseIcon from '@mui/icons-material/Close';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';

const FunctionList = ({ data }) => {
    const theme = useTheme();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFunction, setSelectedFunction] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state

    const handleClickOpen = (item) => {
        setSelectedFunction(item);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedFunction(null);
    };

    // Filter data based on search query
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Search input field */}
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2 }}
            />

            {/* Scrollable List */}
            <Box
                sx={{
                    height: '100%', // Ensure it takes full available height
                    overflowY: 'auto', // Enable vertical scrolling
                }}
            >
                <List sx={{ width: '100%' }}>
                    {filteredData.map((item) => (
                        <Tooltip
                            key={item.name}
                            title={
                                <Typography variant="body2">
                                    {item.description || 'No description available'}
                                </Typography>
                            }
                            arrow
                            placement="right"
                        >
                            <ListItem
                                disablePadding
                                onClick={() => handleClickOpen(item)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                    px: 2,
                                    py: 1,
                                }}
                            >
                                <ListItemIcon>
                                    <LibraryBooksIcon color="action" /> {/* Replace with your desired icon */}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
                                            {item.name}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Box>

            {/* Dialog for displaying usage */}
            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                aria-labelledby="function-dialog-title"
            >
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    {selectedFunction?.name}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: theme.spacing(1),
                            top: theme.spacing(1),
                            color: theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedFunction?.usage ? (
                        <Box
                            component={SyntaxHighlighter}
                            language="javascript"
                            sx={{
                                backgroundColor: theme.palette.background.default,
                                padding: theme.spacing(2),
                                borderRadius: theme.shape.borderRadius,
                                fontSize: '0.875rem',
                            }}
                        >
                            {selectedFunction.usage}
                        </Box>
                    ) : (
                        <Typography variant="body2">No usage information available.</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );


};

export default FunctionList;
