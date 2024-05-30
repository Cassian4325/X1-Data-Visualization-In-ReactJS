import React, { useCallback } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";

const DraggableHeader = React.memo(({ headerName, onHeaderDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.HEADER,
    item: { name: headerName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleHeaderDrop = useCallback(() => {
    onHeaderDrop(headerName);
  }, [headerName, onHeaderDrop]);

  return (
    <div
      ref={drag}
      style={{
        color: "#black"[500],
        opacity: isDragging ? 0.2 : 1,
        cursor: "move",
        padding: "10px",
        border: "1px solid black",
        marginBottom: "5px",
      }}
      onClick={handleHeaderDrop}
    >
      {headerName}
    </div>
  );
});

export default DraggableHeader;
