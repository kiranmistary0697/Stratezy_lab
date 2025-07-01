import React, { useState } from "react";
import axios from 'axios';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, CircularProgress, Tooltip } from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SummaryTable from "./SummaryTable";
import { useAuth } from '../V2/contexts/AuthContext.jsx';

const SummaryIconButton = () => {
    const { authToken, getAccessToken } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // const handleClickOpen1 = async () => {
    //     setLoading(true);
    //     setOpen(true);
    //     try {
    //         const response = await fetch("/api/summary"); // Replace with your API endpoint
    //         const result = await response.json();
    //         setData(result);
    //     } catch (error) {
    //         console.error("Error fetching summary:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleClickOpen = async () => {
        {
            try {
                setLoading(true);
                setOpen(true);
                const latestToken = getAccessToken();
                const response = await axios.get(
                    'https://stratezylabs.ai/command/backtest/summary',
                    {
                        headers: { Authorization: `Bearer ${latestToken}` },
                    }
                );
                //console.debug("Funtion fetched - ", response.data);
                const result = response.data;
                setData(result);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.log("Error fetching backtest summary list -", error)
                }
            } finally {
                setLoading(false);
            }
        }
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Summary of all completed backtest results" arrow>
                <IconButton onClick={handleClickOpen} color="primary">
                    <SummarizeIcon />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>Backtest Summary</DialogTitle>
                <DialogContent>
                    {loading ? <CircularProgress /> : <SummaryTable data={data} />}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SummaryIconButton;
