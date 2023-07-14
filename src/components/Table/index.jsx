import React, { useEffect, useState } from "react";
import { orderTableGenerator } from "../../utils/orderTableGenerator";
import "./table.css";
import Thead from "./Thead";
import Tbody from "./Tbody";

const Table = ({ data }) => {
  console.log(data);
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState([]);
  useEffect(() => {
    if (Object.keys(data).length) {
      const { headers: head, body: bodyData } = orderTableGenerator(data);
      setHeaders(head);
      setBody(bodyData);
    }
  }, [data]);

  return (
    <>
      {data.length ? (
        <div id="order_table_container">
          <div id="table_container">
            <table id="order_table">
              <Thead headers={headers} />
              <Tbody body={body} />
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Table;
