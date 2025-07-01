// AppContent.js
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    useMediaQuery,
    useTheme,
    Tooltip,
    IconButton,
    Drawer
} from '@mui/material';

import { MarketProvider } from './MarketContext';
import Button from '../V2/components/common/Button';
import { useAuth } from '../V2/contexts/AuthContext';
import BacktestForm from './BacktestForm';
import CustomChartVisualization from './CustomChartVisualization';
import Library from './Library';
import Deployment from './Deployment';
import Navbar from './Navbar';
import SubscribeButton from './SubscribeButton';
import BacktestIcon from '@mui/icons-material/Assessment';
import ChartIcon from '@mui/icons-material/ShowChart';
import LibraryIcon from '@mui/icons-material/LibraryBooks';
import BuildIcon from '@mui/icons-material/Build';
import { Link, useNavigate } from 'react-router-dom';
import routes from '../V2/constants/Routes'
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

function AppContent() {
    const theme = useTheme();
    const { logout, initialized } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // Lifted state to keep data persistent across tabs
    const [chartData, setChartData] = useState({
        endDate: new Date(),
        startDate: new Date(),
        symbol: '',
        varList1: '',
        varList2: '',
        customRule: '',
        data: null,
        dataFetched: false,
        loading: false,
        error: null,
    });

    const [darkMode, setDarkMode] = useState(() => {
        const storedDarkMode = sessionStorage.getItem('darkMode');
        return storedDarkMode ? JSON.parse(storedDarkMode) : false;
    });

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    if (!initialized) {
        return <div>Loading...</div>; // Wait for initialization to complete
    }

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <>
        <MarketProvider>
            <Navbar />

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant={isSmallScreen ? 'scrollable' : 'standard'}
                    scrollButtons={isSmallScreen ? 'auto' : 'off'}
                    centered={!isSmallScreen}
                    aria-label="navigation tabs"
                >
                    <Tab
                        icon={<BacktestIcon />}
                        label="Strategy Backtest"
                        sx={{
                            typography: isSmallScreen ? 'body2' : 'body1',
                        }}
                    />
                    <Tab
                        icon={<ChartIcon />}
                        label="Rule development"
                        sx={{
                            typography: isSmallScreen ? 'body2' : 'body1',
                        }}
                    />
                    <Tab
                        icon={<LibraryIcon />}
                        label="Rule Library"
                        sx={{
                            typography: isSmallScreen ? 'body2' : 'body1',
                        }}
                    />
                    <Tab
                        icon={<BuildIcon />}
                        label="Deploy Strategy"
                        sx={{
                            typography: isSmallScreen ? 'body2' : 'body1',
                        }}
                    />
                </Tabs>

                {tabIndex === 0 && <BacktestForm />}
                {tabIndex === 1 && (
                    <CustomChartVisualization
                        endDate={chartData.endDate}
                        startDate={chartData.startDate}
                        symbol={chartData.symbol}
                        varList1={chartData.varList1}
                        varList2={chartData.varList2}
                        customRule={chartData.customRule}
                        data={chartData.data}
                        dataFetched={chartData.dataFetched}
                        loading={chartData.loading}
                        error={chartData.error}
                        setChartData={setChartData}
                    />
                )}
                {tabIndex === 2 && (
                    <Library darkMode={darkMode} setDarkMode={setDarkMode} />
                )}
                {tabIndex === 3 && <Deployment />}
            </Container>
            </MarketProvider>
        </>
        
    );
}

export default AppContent;
