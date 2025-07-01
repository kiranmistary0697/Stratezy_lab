import React from 'react';
import { TextField, Button, Grid, Paper, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const TradeTable = ({ tradesData, filteredTradesData, filterText, setFilterText, exportToCSV, calculateColumnSums }) => {
    return (
        <Paper elevation={3} style={{ padding: '2em', marginBottom: '2em' }}>
            <Typography variant="h6" gutterBottom>
                Trade Table
            </Typography>
            <Grid container spacing={2} alignItems="center" marginBottom={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Filter trades by..."
                        fullWidth
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} textAlign="right">
                    <Button variant="contained" color="primary" onClick={exportToCSV}>
                        Download Data as CSV
                    </Button>
                </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredTradesData.map((item, index) => ({
                        id: index,
                        ...item,
                    }))}
                    columns={tradesData.length ? Object.keys(tradesData[0]).map((key) => ({ field: key, headerName: key, width: 100 })) : []}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                />
            </div>
            <Box marginTop={2}>
                <Typography variant="h6">Column Sums</Typography>
                <DataGrid
                    rows={[
                        {
                            id: 'sum',
                            ...calculateColumnSums(),
                        },
                    ]}
                    columns={tradesData.length ? Object.keys(tradesData[0]).map((key) => ({ field: key, headerName: key, width: 150 })) : []}
                    hideFooter
                />
            </Box>
        </Paper>
    );
};

export default TradeTable;
