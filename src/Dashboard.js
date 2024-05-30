import React, { useState, useMemo, useEffect } from "react";
import { useDrop } from "react-dnd";
import Plot from "react-plotly.js";
import IconButton from "@mui/material/IconButton";
import CompareIcon from "@mui/icons-material/Compare";
import TextField from "@mui/material/TextField";
import { Menu, Popover } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import SortIcon from "@mui/icons-material/Sort";
import Divider from "@mui/material/Divider";
import {
  Button,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";

//pill for the dropped header
const Pill = ({ children, onClear, onContextMenu, ...props }) => {
  const handleContextMenu = (event) => {
    event.preventDefault();
    onContextMenu(event);
  };
  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", margin: "2px" }}
      onContextMenu={handleContextMenu}
    >
      <div>{children}</div>
      <IconButton
        size="small"
        onClick={onClear}
        style={{ marginLeft: "-8px", padding: "4px" }}
      >
        <ClearIcon
          fontSize="small"
          style={{ color: "black", marginLeft: 10 }}
        />
      </IconButton>
    </div>
  );
};
//ends here

const Dashboard = ({ fileHeaders = [], fileData = [] }) => {
  const [list, setList] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterAnchorEl2, setFilterAnchorEl2] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOpen2, setFilterOpen2] = useState(false);
  const [filterOpen3, setFilterOpen3] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [droppedColumns, setDroppedColumns] = useState([]);
  const [viewMode, setViewMode] = useState("data");
  //States for Graph and Aggregations
  const [selectedChartType, setSelectedChartType] = useState("bar");
  const [selectedAggregation, setSelectedAggregation] = useState("sum");
  const [compareSelection, setCompareSelection] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonType, setComparisonType] = useState("y-axis");
  //popup for the filter Menulist
  const [rangeOpen, setRangeOpen] = useState(false);
  const [rangeMin, setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(100);
  const [selectedOption, setSelectedOption] = useState("onlyRelevantValues");
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [sortOption, setSortOption] = useState("dataSourceOrder");
  const [manualOrder, setManualOrder] = useState(["Female", "Male"]);
  const [nestedOrder, setNestedOrder] = useState({
    order: "ascending",
    fieldName: "Sex",
    aggregation: "count",
  });
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    if (query !== "") {
      const filteredData = fileData.filter((item) => {
        // Assuming each item is an object with a `name` property
        if (typeof item.name === "string") {
          return item.name.toLowerCase().includes(query.toLowerCase());
        }
        return false;
      });
      setResults(filteredData);
    } else {
      setResults([]);
    }
  }, [query, fileData]);

  const handleList = (event) => {
    setList(event.target.value);
  };
  //popup functions for opening and closing

  const handleContextMenuClose = () => {
    setContextMenuOpen(false);
  };

  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterOpen2 = () => {
    setFilterOpen2(true);
  };
  const handleFilterOpen3 = () => {
    setFilterOpen3(true);
  };
  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleFilterClose2 = () => {
    setFilterOpen2(false);
  };

  const handleDrop = (item, target) => {
    const header = item.name;
    if (target === "column" && !droppedColumns.includes(header)) {
      setDroppedColumns([...droppedColumns, header]);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //ends here

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };
  const handleManualOrderChange = (index) => (event) => {
    const newOrder = [...manualOrder];
    newOrder[index] = event.target.value;
    setManualOrder(newOrder);
  };
  const handleNestedOrderChange = (field) => (event) => {
    setNestedOrder({
      ...nestedOrder,
      [field]: event.target.value,
    });
  };
  const open = Boolean(anchorEl);
  const id = open ? "sort-popover" : undefined;
  const handleDeleteHeader = (header) => {
    setDroppedColumns(droppedColumns.filter((col) => col !== header));
  };
  const [{ isOver: isColumnOver }, dropColumn] = useDrop({
    accept: "HEADER",
    drop: (item) => handleDrop(item, "column"),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const handleCompareSelection = (event) => {
    const { value } = event.target;
    setCompareSelection(value);
    setShowComparison(true);
  };
  const handleComparisonTypeChange = (event) => {
    setComparisonType(event.target.value);
  }; //get random color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };
  const renderChartData = () => {
    return droppedColumns
      .map((header) => {
        const columnIndex = fileHeaders.indexOf(header);
        if (columnIndex === -1) {
          console.error(`Header '${header}' not found`);
          return null;
        }
        const yPoints = fileData.map((row) => row[columnIndex]).filter(Boolean);
        if (yPoints.length === 0) return null;
        return {
          x: fileData.map((_, index) => index + 1),
          y: yPoints,
          type: selectedChartType,
          name: header,
          marker: { color: getRandomColor() },
        };
      })
      .filter(Boolean);
  };

  //Aggregation Functions----------------------------------------------------------------
  const aggregateData = (data, aggregation) => {
    if (data.length === 0) return 0;
    switch (aggregation) {
      case "sum":
        return data.reduce((acc, row) => acc + row, 0);
      case "average":
        return data.reduce((acc, val) => acc + val, 0) / data.length;
      case "median":
        const sortedData = [...data].sort((a, b) => a - b);
        const mid = Math.floor(sortedData.length / 2);
        return sortedData.length % 2 !== 0
          ? sortedData[mid]
          : (sortedData[mid - 1] + sortedData[mid]) / 2;
      case "min":
        return Math.min(...data);
      case "max":
        return Math.max(...data);
      case "standardDeviation":
        const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
        const variance =
          data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length;
        return Math.sqrt(variance);
      case "variance":
        const meanVariance =
          data.reduce((acc, val) => acc + val, 0) / data.length;
        return (
          data.reduce((acc, val) => acc + (val - meanVariance) ** 2, 0) /
          data.length
        );
      default:
        return 0;
    }
  }; //aggregation functions continued
  const applySelectedFilters = (data) => {
    return data.filter((row) => {
      return selectedFilters.every((filter) => {
        const columnIndex = fileHeaders.indexOf(filter.column);
        const cellValue = row[columnIndex];
        switch (filter.condition) {
          case "greaterThan":
            return cellValue > filter.value;
          case "lessThan":
            return cellValue < filter.value;
          case "equals":
            return cellValue === filter.value;
          case "notEquals":
            return cellValue !== filter.value;
          default:
            return true;
        }
      });
    });
  };
  const chartData = renderChartData();
  const filteredData = applySelectedFilters(fileData);
  const mergeCharts = () => {
    const mergedData = compareSelection.map((header) => {
      const columnIndex = fileHeaders.indexOf(header);
      if (columnIndex === -1) return null;
      let yPoints = filteredData.map((row) => row[columnIndex]).filter(Boolean);
      if (yPoints.length === 0) return null;
      return {
        x: filteredData.map((_, index) => index + 1),
        y: yPoints,
        type: selectedChartType,
        name: `${header} (Comparison)`,
        marker: { color: getRandomColor() },
      };
    });
    return mergedData.filter(Boolean);
  };
  //-------------------------------------------------------------------------------

  //functions for the popup buttons of Filter
  const handleRangeApply = () => {
    console.log(
      "Applying range filter:",
      rangeMin,
      "-",
      rangeMax,
      "Show:",
      selectedOption
    );
    setRangeOpen(false);
  };
  const handleRangeClose = () => {
    setRangeOpen(false);
  };

  const handleHeaderClick = (header) => {
    if (header !== selectedHeader) {
      setSelectedHeader(header);
      setCheckedItems({});
    }
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [index]: !prevCheckedItems[index],
    }));
  };
  const filteredList = useMemo(() => {
    if (selectedHeader && filteredData.length > 0 && fileHeaders.length > 0) {
      const colIndex = fileHeaders.indexOf(selectedHeader);
      if (colIndex !== -1) {
        return filteredData.map((row) => row[colIndex] || "NULL");
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [selectedHeader, filteredData, fileHeaders]);
  const handleContextMenu = (event, header) => {
    event.preventDefault();
    setSelectedHeader(header);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuOpen(true);
  };
  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };
  return (
    <div className="dashboard-box">
      <div className="dashboard">
        <div className="drop-area-container">
          <div
            className={`drop-container ${isColumnOver ? "over" : ""}`}
            ref={dropColumn}
          >
            <div className="dropped-header">
              {droppedColumns.map((header) => (
                <Pill
                  key={header}
                  onClear={() => handleDeleteHeader(header)}
                  onContextMenu={(e) => handleContextMenu(e, header)}
                  kind="measure"
                  style={{ backgroundColor: getRandomColor(), color: "#fff" }}
                  className="pill"
                >
                  {header}
                </Pill>
              ))}
            </div>
          </div>
        </div>
        <Button
          variant="contained"
          onClick={() => setViewMode("chart")}
          className="view-mode-button"
          style={{ marginLeft: 550, marginTop: -115, right: -67 }}
        >
          Graphs
        </Button>
        <Popover
          open={filterOpen}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          <div className="filter-popup">
            <div className="filter-content">
              <div className="filter-tabs">
                <Button
                  variant="outlined"
                  className="filter-tab"
                  onClick={handleRangeApply}
                >
                  Filter
                </Button>
              </div>
              <div className="filter-options">
                <div>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Search"
                    sx={{ width: 300 }}
                    value={query}
                    onChange={handleSearch}
                  />{" "}
                  <div>
                    {results.map((result, index) => (
                      <div key={index}>{result.name}</div>
                    ))}
                  </div>
                  <Box
                    height={150}
                    width={400}
                    my={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    gap={2}
                    p={2}
                    sx={{
                      border: "2px solid grey",
                      marginTop: -0.1,
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      {selectedHeader ? (
                        <div>
                          <div style={{ cursor: "pointer", padding: "10px 0" }}>
                            <strong>{selectedHeader}</strong>
                          </div>
                          <Divider />
                          <div
                            style={{
                              width: "100%",
                              overflowY: "auto",
                              marginLeft: 20,
                            }}
                          >
                            {filteredList.map((cellValue, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px ",
                                  marginLeft: "80",
                                }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={checkedItems[index] || false}
                                      onChange={() =>
                                        handleCheckboxChange(index)
                                      }
                                    />
                                  }
                                  label={cellValue}
                                />
                                <Divider />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        droppedColumns.map((colHeader) => (
                          <div
                            key={colHeader}
                            onClick={() => handleHeaderClick(colHeader)}
                            style={{ cursor: "pointer", padding: "8px 0" }}
                          >
                            <strong>{colHeader}</strong>
                            <Divider />
                          </div>
                        ))
                      )}
                    </div>
                  </Box>
                  <InputLabel sx={{ marginLeft: 60, marginTop: -10 }}>
                    <Checkbox />
                    Exclude Selected Values
                  </InputLabel>
                </div>

                <div className="filter-buttons4">
                  <Button variant="outlined" sx={{ left: -420 }}>
                    Reset
                  </Button>
                  <Button variant="contained" sx={{ left: -400 }}>
                    OK
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleRangeClose}
                    sx={{ left: -20 }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </Popover>
        {viewMode === "chart" && ( //Graphs MenuList
          <div className="chart-options">
            <Select
              value={selectedChartType}
              onChange={(e) => setSelectedChartType(e.target.value)}
              displayEmpty
              className="chart-select"
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="histogram">Histogram</MenuItem>
              <MenuItem value="box">Box Plot</MenuItem>
              <MenuItem value="funnel">Funnel Chart</MenuItem>
              <MenuItem value="waterfall">Waterfall Chart</MenuItem>
              <MenuItem value="scatter">Scatter Plot</MenuItem>
            </Select>
            <Select //Aggregation MenuList
              value={selectedAggregation}
              onChange={(e) => setSelectedAggregation(e.target.value)}
              displayEmpty
              className="aggregation-select"
            >
              <MenuItem value="sum">Sum</MenuItem>
              <MenuItem value="average">Average</MenuItem>
              <MenuItem value="median">Median</MenuItem>
              <MenuItem value="min">Minimum</MenuItem>
              <MenuItem value="max">Maximum</MenuItem>
              <MenuItem value="standardDeviation">Standard Deviation</MenuItem>
              <MenuItem value="variance">Variance</MenuItem>
              <MenuItem value="percentage">Percentage</MenuItem>
            </Select>
            <Button
              onClick={() => setViewMode("data")}
              className="go-back-button"
            >
              <ArrowBackIcon></ArrowBackIcon>
            </Button>
            <Button
              onClick={() => setShowComparison(!showComparison)}
              className="compare-button"
            >
              <CompareIcon />
              <span className="compare-button-tip">Compare</span>
            </Button>
            {showComparison && (
              <Select
                multiple
                value={compareSelection}
                onChange={handleCompareSelection}
                displayEmpty
                className="compare-select"
              >
                {droppedColumns.map((header) => (
                  <MenuItem key={header} value={header}>
                    {header}
                  </MenuItem>
                ))}
              </Select>
            )}
            {showComparison && (
              <Select
                value={comparisonType}
                onChange={handleComparisonTypeChange}
                displayEmpty
                className="comparison-type-select"
              >
                <MenuItem value="x-axis"> X-axis</MenuItem>
                <MenuItem value="y-axis"> Y-axis</MenuItem>
              </Select>
            )}
          </div>
        )}
        {viewMode === "chart" ? (
          <div>
            {compareSelection.length > 0 && showComparison ? (
              <div className="chart-container">
                <Plot //chart information
                  data={
                    comparisonType === "x-axis"
                      ? chartData.concat(mergeCharts())
                      : mergeCharts()
                  }
                  layout={{
                    responsive: true,
                    useResizeHandler: true,
                    autosize: true,
                    width: 700,
                    height: 500,
                    gap: 1,
                    title: `Comparison Chart (${selectedAggregation})`,
                  }}
                  config={{
                    displaylogo: false,
                    scrollZoom: true,
                    displayModeBar: true,
                  }}
                />
              </div>
            ) : (
              droppedColumns.map((header) => {
                const columnIndex = fileHeaders.indexOf(header);
                if (columnIndex === -1) return null;

                let yPoints = filteredData
                  .map((row) => row[columnIndex])
                  .filter(Boolean);
                if (yPoints.length === 0) return null;

                const aggregationResult = aggregateData(
                  yPoints,
                  selectedAggregation
                );
                return (
                  <div key={header} className="chart-container">
                    <Plot //chart information
                      data={[
                        {
                          x: filteredData.map((_, index) => index + 1),
                          y: yPoints,
                          type: selectedChartType,
                          name: header,
                          marker: { color: getRandomColor() },
                        },
                      ]}
                      layout={{
                        responsive: true,
                        useResizeHandler: true,
                        autosize: true,
                        width: 700,
                        height: 500,
                        gap: 1,
                        title: `${header} (${selectedAggregation}: ${aggregationResult})`,
                      }}
                      config={{
                        displaylogo: false,
                        scrollZoom: true,
                        displayModeBar: true,
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        ) : (
          //Table being displayed when the header is dragged and dropped
          <div className="data-table-border">
            <div className="data-table-container">
              <table className="data-table">
                <thead className="fixed-header">
                  <tr>
                    {droppedColumns.map((colHeader) => (
                      <th key={colHeader} className="table-header">
                        {colHeader}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {droppedColumns.map((colHeader) => {
                        const colIndex = fileHeaders.indexOf(colHeader);
                        const cellValue =
                          colIndex !== -1 ? row[colIndex] : undefined;
                        return (
                          <td key={colHeader} className="table-cell">
                            {cellValue !== undefined ? cellValue : "NULL"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Popover //popover for the sort
        id={id}
        open={filterOpen2}
        anchorEl={filterAnchorEl2}
        onClose={handleFilterClose2}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <div
          style={{
            padding: "20px",
            minWidth: "200px",
            backgroundColor: "lightgrey",
            position: "fixed",
            marginTop: "100px",
            marginLeft: "-80px",
          }}
        >
          {" "}
          <Typography variant="h6">Sort [Sex]</Typography>
          <FormControl fullWidth>
            <Select value={sortOption} onChange={handleSortOptionChange}>
              <MenuItem value="dataSourceOrder">Data source order</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="nested">Nested</MenuItem>
            </Select>
          </FormControl>
          {sortOption === "manual" && (
            <div style={{ marginTop: "16px", bottom: 20 }}>
              {manualOrder.map((value, index) => (
                <FormControl key={index} fullWidth>
                  <Select
                    value={value}
                    onChange={handleManualOrderChange(index)}
                  >
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                  </Select>
                </FormControl>
              ))}
            </div>
          )}
          {sortOption === "nested" && (
            <div style={{ marginTop: "16px", bottom: 20 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  value={nestedOrder.order}
                  onChange={handleNestedOrderChange("order")}
                >
                  <FormControlLabel
                    value="ascending"
                    control={<Radio />}
                    label="Ascending"
                  />
                  <FormControlLabel
                    value="descending"
                    control={<Radio />}
                    label="Descending"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth style={{ marginTop: "8px" }}>
                <Select
                  value={nestedOrder.fieldName}
                  onChange={handleNestedOrderChange("fieldName")}
                >
                  <MenuItem value="Sex">Sex</MenuItem>
                  <MenuItem value="Index">Index</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginTop: "8px" }}>
                <Select
                  value={nestedOrder.aggregation}
                  onChange={handleNestedOrderChange("aggregation")}
                >
                  <MenuItem value="count">Count</MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <Button onClick={handleClose} style={{ marginTop: "16px" }}>
            Clear
          </Button>
        </div>
      </Popover>

      <Menu //Context menu for the Dropped Headers
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuOpen && contextMenuPosition
            ? { top: contextMenuPosition.y, left: contextMenuPosition.x }
            : undefined
        }
        open={contextMenuOpen}
        onClose={handleContextMenuClose}
        sx={{ top: 10 }}
      >
        <MenuItem onClick={handleFilterOpen} sx={{ gap: 1 }}>
          <FilterAltIcon sx={{ left: -20 }} />
          Filter
        </MenuItem>

        <MenuItem onClick={handleFilterOpen2}>
          <SortIcon />
          Sort
        </MenuItem>

        <MenuItem onClick={handleFilterOpen3}>
          <ClearSharpIcon />
          Clear Filter
        </MenuItem>
      </Menu>
    </div>
  );
};
export default React.memo(Dashboard);
