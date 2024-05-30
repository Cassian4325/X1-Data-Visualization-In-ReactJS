import React, { memo, useCallback } from "react";
import { Pill as TableauPill } from "@tableau/tableau-ui";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

const Pill = ({ children, onClear, ...props }) => {
  const handleClear = useCallback(() => {
    if (typeof onClear === "function") {
      onClear();
    }
  }, [onClear]);

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", margin: "2px" }}
    >
      <TableauPill {...props}>{children}</TableauPill>
      <IconButton
        size="small"
        onClick={handleClear}
        style={{ marginLeft: "-8px", padding: "4px" }}
      >
        <ClearIcon fontSize="small" style={{ color: "#fff" }} />
      </IconButton>
    </div>
  );
};

export default memo(Pill);
