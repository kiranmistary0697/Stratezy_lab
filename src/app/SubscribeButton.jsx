import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import Button from '../V2/components/common/Button';
import { useAuth } from '../V2/contexts/AuthContext.jsx';

const SubscribeButton = () => {
    const navigate = useNavigate();
    const { authToken, getAccessToken } = useAuth();

    // ReactJS example:

    // const handleSubscribe = async () => {
    //     try {
    //         // POST to your backend endpoint
    //         const latestToken = getAccessToken();
    //         const response = await axios.post('/stockclient/create-session', {
    //             priceId: 'prctbl_1Ql7D1HUHzoZhIZk3ydRWrjW',
    //             headers: { Authorization: `Bearer ${latestToken}` },
    //         });

    //         // If successful, the server should return an object like { url: "<checkout-session-url>" }
    //         if (response.data && response.data.url) {
    //             console.log("Redirecting user to - ", response.data.url)
    //             window.location = response.data.url; // Redirect user to the Stripe Checkout page
    //         }
    //     } catch (error) {
    //         console.error('Error creating checkout session:', error);
    //     }
    // };

    return (
        <Tooltip title="Subscribe">
            {/* <Button className="w-full flex items-center justify-center gap-x-2"
                variant="outlined"
                color="secondary"
                // onClick={() => navigate(routes.plan)}>
                onClick={handleSubscribe}>
                Subscribe <SubscriptionsIcon />
            </Button> */}
        </Tooltip>
    );
};

export default SubscribeButton;
