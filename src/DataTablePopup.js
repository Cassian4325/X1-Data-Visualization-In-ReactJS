import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const DataTablePopup = ({ open, onClose, headers, data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setSelectedFilter(event.target.value);
  }, []);

  const filteredData = data.filter((row) =>
    Array.isArray(row)
      ? row.some(
          (cell, cellIndex) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!selectedFilter || headers[cellIndex] === selectedFilter)
        )
      : false
  );

  const handleDownload = useCallback(() => {
    const csvData = data.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Data.csv");
    link.click();
    URL.revokeObjectURL(url); // Release the object URL
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Data Table</DialogTitle>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <Button onClick={handleDownload} sx={{ marginLeft: 1 }}>
          <DownloadIcon />
        </Button>
        <Button onClick={onClose}>X</Button>
      </div>
      <DialogContent>
        <div style={{ marginBottom: 16 }}>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            style={{ marginBottom: 8 }}
          />
          <TextField
            select
            label="Filter"
            value={selectedFilter}
            onChange={handleFilterChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {headers.map((header) => (
              <MenuItem key={header} value={header}>
                {header}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.isArray(row) ? (
                  row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {typeof cell === "string" ? cell : "Invalid Data"}
                    </TableCell>
                  ))
                ) : (
                  <TableCell colSpan={headers.length}>Invalid Row</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default DataTablePopup;
