import React from "react";
import "./thead.css";

const Thead = ({ headers }) => {
  return (
    <thead id="order_table_header">
      <tr>
        {headers.map((header, index) => {
          return (
            <th key={index}>
              {typeof header === "string" ? (
                header
              ) : (
                <div className="row_parent">
                  <div>{Object.keys(header)[0]}</div>
                  <div>{Object.values(header)[0][0]}</div>
                  <div>{Object.values(header)[0][1]}</div>
                </div>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default Thead;
