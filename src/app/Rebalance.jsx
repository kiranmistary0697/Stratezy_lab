import React, { useState } from "react";
import {
    Button,
    useTheme,
} from "@mui/material";
import { useAuth } from '../V2/contexts/AuthContext.jsx';

const Rebalance = ({ selectedDeploymentId }) => {
    const [isPopupClosed, setIsPopupClosed] = useState(false);
    const theme = useTheme();
    const { authToken } = useAuth();

    const handleRebalance = () => {
        // Uncomment the following code to enable the popup window
        /*const redirectUrl = "https://stratezylabs.ai/deploy/login";

        // Open the popup window directly
        const popup = window.open(redirectUrl, "_blank", "width=600,height=600");

        if (!popup) {
            alert("Popup blocked by the browser. Please allow popups for this site.");
            return;
        }

        // Monitor the popup window for closure
        const interval = setInterval(() => {
            if (popup.closed) {
                clearInterval(interval);
                setIsPopupClosed(true); // Update state when popup is closed
            }
        }, 500);
        */
        console.log("Rebalance button clicked")
    };


    const actionButtonStyles = {
        minWidth: 100,
        size: "large",
    };

    const actionItemStyle = {
        height: '48px',
        minWidth: '120px',
        textTransform: 'none', // optional (prevents uppercase text)
    };
    return (
        <Button
            variant="contained"
            onClick={handleRebalance}
            disabled={!selectedDeploymentId}
            color="info"
            sx={{
                ...actionItemStyle,
                flex: '1 1 0', // match how you style your other buttons
            }}
        >
            Rebalance
        </Button>
    );
};

export default Rebalance;
