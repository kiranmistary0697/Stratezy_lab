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

// Styled component for the header cells with sticky header, shaded background, and bold font.
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    fontWeight: 'bold',
    position: 'sticky',
    top: 0,
    zIndex: 1,
}));

function TradeDataDialog({ open, onClose, tradeData, name, message, showSell }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('symbol');
    const [filterSymbol, setFilterSymbol] = useState('');
    const [fullScreen, setFullScreen] = useState(false); // Full screen state for this dialog

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filtered data based on filterSymbol input
    const filteredData = useMemo(() => {
        if (!filterSymbol.trim()) {
          return tradeData;
        }
        const lowerSearch = filterSymbol.toLowerCase();
      
        return tradeData.filter((row) => {
          // Manually iterate each key so we can transform booleans
          return Object.entries(row).some(([key, val]) => {
            let displayVal = val;
      
            // We don't show openReason as column
            if (key === 'openReason') {
                return false;
            }
            // If showSell is false, then we don't have to match these three columns as they won't be visible
            if (showSell === false) {
                if (key === 'closed' || key === 'closeReason' || key === 'sellTime') {
                    return false;
                }
            }
            // If it's the 'closed' field, transform it into "Yes" / "No"
            if (key === 'closed') {
              displayVal = val ? 'Yes' : 'No';
            }
      
            // Convert to string and compare
            return displayVal?.toString().toLowerCase().includes(lowerSearch);
          });
        });
      }, [tradeData, filterSymbol, showSell]);
      
    // Sorted data based on current order and orderBy
    const sortedData = useMemo(() => {
        const comparator = getComparator(order, orderBy);
        return [...filteredData].sort(comparator);
    }, [filteredData, order, orderBy]);

    // CSV export function: converts sorted data to CSV and triggers download
    const exportCSV = () => {
        // Define headers for CSV – note: these must match the columns rendered below
        const headers = [
            'Symbol',
            'Number',
            'Buy Price',
            'Sell Price',
            'Principal',
            'Investment',
            'Net Profit',
            'Profit (%)',
            'Annual Prf(%)',
            'Buy Time',
            ...(showSell ? ['Sell Time'] : []),
            'Duration Days',
            'Risk1R',
            ...(showSell ? ['Close Reason', 'Is Closed'] : [])
        ].join(',');
      
        const csvRows = sortedData.map(row => {
            const values = [
                row.symbol,
                row.number,
                row.buyPrice,
                row.sellPrice,
                row.principal,
                row.investment,
                row.netProfit,
                row.profit,
                row.anPrf,
                row.buyTime,
                ...(showSell ? [row.sellTime] : []),
                row.duration,
                row.risk1R,
                ...(showSell ? [row.closeReason, row.closed ? 'Yes' : 'No'] : [])
            ];
            return values.map(val => `"${val !== undefined && val !== null ? val : ''}"`).join(',');
        });
      
        const csvContent = [headers, ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "trade_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            fullScreen={fullScreen}
        >
            <DialogTitle>{name} - {message}</DialogTitle>
            <DialogContent dividers sx={{ maxHeight: fullScreen ? '90vh' : '70vh', overflowY: 'auto' }}>
                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom>
                        Filters
                    </Typography>
                    <TextField
                        label="Filter by any Column"
                        variant="outlined"
                        size="small"
                        value={filterSymbol}
                        onChange={(e) => setFilterSymbol(e.target.value)}
                    />
                </Box>
                {/* Wrap the table in a Box with horizontal scrolling */}
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {[
                                    { id: 'symbol', label: 'Symbol' },
                                    { id: 'number', label: 'Number' },
                                    { id: 'buyPrice', label: 'Buy Price' },
                                    { id: 'sellPrice', label: 'Sell Price' },
                                    { id: 'principal', label: 'Principal' },
                                    { id: 'investment', label: 'Investment' },
                                    { id: 'netProfit', label: 'Net Profit' },
                                    { id: 'profit', label: 'Profit (%)' },
                                    { id: 'anPrf', label: 'Annual Prf(%)' },
                                    { id: 'buyTime', label: 'Buy Time' },
                                    ...(showSell ? [{ id: 'sellTime', label: 'Sell Time' }] : []),
                                    { id: 'duration', label: 'Duration Days' },
                                    { id: 'risk1R', label: 'Risk1R' },
                                    ...(showSell ? [{ id: 'closeReason', label: 'Close Reason' }, { id: 'isClosed', label: 'Is Closed' }] : [])
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
                                    <TableCell>{row.symbol}</TableCell>
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell>{row.buyPrice}</TableCell>
                                    <TableCell>{row.sellPrice}</TableCell>
                                    <TableCell>{row.principal ? parseFloat(row.principal).toFixed(2) : " "}</TableCell>
                                    <TableCell>{row.investment ? parseFloat(row.investment).toFixed(2) : " "}</TableCell>
                                    <TableCell>{row.netProfit ? parseFloat(row.netProfit).toFixed(2) : " "}</TableCell>
                                    <TableCell>{row.profit ? parseFloat(row.profit).toFixed(2) : " "}</TableCell>
                                    <TableCell>{row.anPrf ? parseFloat(row.anPrf).toFixed(2) : " "}</TableCell>
                                    <TableCell>{row.buyTime}</TableCell>
                                    {showSell && <TableCell>{row.sellTime}</TableCell>}
                                    <TableCell>{row.duration}</TableCell>
                                    <TableCell>{row.risk1R ? parseFloat(row.risk1R).toFixed(2) : " "}</TableCell>
                                    {showSell && <TableCell>{row.closeReason}</TableCell>}
                                    {showSell && <TableCell>{row.closed ? 'Yes' : 'No'}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={exportCSV} variant="contained">
                    Export CSV
                </Button>
                <Button
                    onClick={() => setFullScreen(!fullScreen)}
                    variant="contained"
                >
                    {fullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </Button>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TradeDataDialog;
