import React, { useState, useCallback } from "react";
import DraggableHeader from "./DraggableHeader";
import { Button, Snackbar, Alert } from "@mui/material";
import DataTablePopup from "./DataTablePopup";
import DatasetOutlinedIcon from "@mui/icons-material/DatasetOutlined";

const Sidebar = ({ fileData, onHeaderDrop, onFileUpload }) => {
  const [fileHeaders, setFileHeaders] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);

  const handleViewData = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const validFileTypes = [
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (!validFileTypes.includes(file.type)) {
          setFileTypeError(true);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const headersFromFile = content.split("\n")[0].split(",");
          console.log("Headers from file:", headersFromFile);
          setFileHeaders(headersFromFile);
          onFileUpload(file);
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload]
  );

  const handleCloseFileTypeError = () => {
    setFileTypeError(false);
  };

  return (
    <div className="sidebar">
      <h3>Upload File</h3>
      <input type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
      <Button
        onClick={handleViewData}
        sx={{ textAlign: "center", marginLeft: 10 }}
      >
        <DatasetOutlinedIcon />
      </Button>

      <h3>Fields</h3>
      <div className="header-container">
        {fileHeaders.length > 0 ? (
          fileHeaders.map((header, index) => (
            <DraggableHeader
              key={header || "Unknown Header"}
              headerName={header || "Unknown Header"}
              onHeaderDrop={() => onHeaderDrop(header || "Unknown Header")}
            />
          ))
        ) : (
          <p>No headers available</p>
        )}
      </div>

      <DataTablePopup
        open={openPopup}
        onClose={handleClosePopup}
        headers={fileHeaders}
        data={fileData}
      />

      <Snackbar
        open={fileTypeError}
        autoHideDuration={10000}
        onClose={handleCloseFileTypeError}
      >
        <Alert
          onClose={handleCloseFileTypeError}
          severity="error"
          sx={{ width: "100%" }}
        >
          Only CSV and XLSX files are accepted!!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Sidebar;
