import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

const App = () => {
  const [fileHeaders, setFileHeaders] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(fileData); // Show all data when search query is empty
    } else {
      const newData = fileData.filter((row) =>
        row.join(",").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(newData);
    }
  }, [fileData, searchQuery]);

  const handleFileUpload = useCallback(
    (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const headers = e.target.result.split("\n")[0].split(",");
        const data = e.target.result
          .split("\n")
          .slice(1)
          .map((line) => line.split(","));
        setFileHeaders(headers);
        setFileData(data);
        setFilteredData(data); // Initialize filtered data with all data
      };
      reader.readAsText(file);
    },
    [setFileHeaders, setFileData]
  );

  const handleHeaderDrop = (header) => {
    console.log("Header dropped:", header);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="content">
          <Sidebar
            fileHeaders={fileHeaders}
            fileData={fileData}
            onHeaderDrop={handleHeaderDrop}
            onFileUpload={handleFileUpload}
          />
          <Dashboard
            fileHeaders={fileHeaders}
            fileData={filteredData}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
