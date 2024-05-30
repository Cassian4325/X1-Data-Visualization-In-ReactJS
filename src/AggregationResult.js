import React from "react";

const AggregationResult = ({ aggregationValue, goBack }) => {
  return (
    <div>
      <h2>Aggregation Result</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "8px",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              Aggregation Value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style={{
                padding: "8px",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              {aggregationValue}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default AggregationResult;
