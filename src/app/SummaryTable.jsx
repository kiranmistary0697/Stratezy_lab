import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Paper,
    Button,
    Box,
} from "@mui/material";

const SummaryTable = ({ data }) => {
    const [filter, setFilter] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("strategyName");

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const filteredData = data.filter((row) =>
        Object.values(row).some((value) =>
            value && value.toString().toLowerCase().includes(filter.toLowerCase())
        )
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];

        if (valA == null && valB == null) return 0;
        if (valA == null) return order === "asc" ? -1 : 1;
        if (valB == null) return order === "asc" ? 1 : -1;

        if (typeof valA === "number" && typeof valB === "number") {
            return order === "asc" ? valA - valB : valB - valA;
        }

        const strA = valA.toString().toLowerCase();
        const strB = valB.toString().toLowerCase();
        if (strA < strB) return order === "asc" ? -1 : 1;
        if (strA > strB) return order === "asc" ? 1 : -1;
        return 0;
    });

    const handleDownloadCSV = () => {
        const csvRows = [];
        const headers = Object.keys(data[0] || {});
        csvRows.push(headers.join(",")); // Add headers
    
        sortedData.forEach((row) => {
            const values = headers.map((header) => {
                const cell = row[header];
                if (cell !== null && cell !== undefined) {
                    // Escape double quotes and wrap in quotes if it contains a comma
                    const value = cell.toString().replace(/"/g, '""'); // Escape double quotes
                    return value.includes(",") ? `"${value}"` : value;
                }
                return ""; // Empty value for null/undefined
            });
            csvRows.push(values.join(","));
        });
    
        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "backtest_summary.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <Paper>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <TextField
                    label="Filter"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadCSV}
                    sx={{ ml: 2 }}
                >
                    Save as CSV
                </Button>
            </Box>
            <TableContainer>
                <Table sx={{ fontFamily: "Roboto, Arial, sans-serif", fontSize: "14px" }}>
                    <TableHead>
                        <TableRow>
                            {Object.keys(data[0] || {}).map((key) => (
                                <TableCell
                                    key={key}
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === key}
                                        direction={orderBy === key ? order : "asc"}
                                        onClick={() => handleSort(key)}
                                    >
                                        {key}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((row, index) => (
                            <TableRow key={index}>
                                {Object.values(row).map((value, idx) => (
                                    <TableCell
                                        key={idx}
                                        sx={{
                                            fontSize: "14px",
                                            color: "#333",
                                        }}
                                    >
                                        {value !== null && value !== undefined
                                            ? value.toString()
                                            : ""}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default SummaryTable;
