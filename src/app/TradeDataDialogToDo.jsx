import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TextField,
    TableSortLabel,
    Box,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Helper function to sort the table rows
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Styled component for the header cells (shaded background)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold'
}));

function TradeDataDialogToDo({ open, onClose, tradeData, name }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('symbol');
    const [filterSymbol, setFilterSymbol] = useState('');

    //console.log("Inside tradeviewToDo component", tradeData);
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredData = useMemo(() => {
        if (!tradeData) return [];
        return tradeData.filter(row =>
            row.stock.toLowerCase().includes(filterSymbol.toLowerCase())
        );
    }, [tradeData, filterSymbol]);


    // Sorted data based on current order and orderBy
    const sortedData = useMemo(() => {
        const comparator = getComparator(order, orderBy);
        return [...(filteredData || [])].sort(comparator);
    }, [filteredData, order, orderBy]);


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>TradesToDo - {name}</DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Filters
                    </Typography>
                    <TextField
                        label="Filter by Symbol"
                        variant="outlined"
                        size="small"
                        value={filterSymbol}
                        onChange={(e) => setFilterSymbol(e.target.value)}
                    />
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                { id: 'stock', label: 'Stock' },
                                { id: 'companyName', label: 'Company' },
                                { id: 'number', label: 'Number' },
                                { id: 'value', label: 'Value' },
                                { id: 'action', label: 'action' },
                                { id: 'reason', label: 'Reason' }
                            ].map((headCell) => (
                                <StyledTableCell key={headCell.id}>
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.stock}</TableCell>
                                <TableCell>{row.companyName}</TableCell>
                                <TableCell>{row.number}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.buy ? 'ENTER' : 'EXIT'}</TableCell>
                                <TableCell>{row.reason}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TradeDataDialogToDo;
