import React from "react";
import "./tbody.css"

const Tbody = ({ body }) => {
  return (
    <>
      {Object.keys(body).length ? (
        <tbody>
          <tr>
            <td>asdasd</td>
            <td>asdasd</td>
            <td>
              <div>asdasd</div>
              <div>asdasd</div>
            </td>
            <td>asdasd</td>
            <td>asdasd</td>
          </tr>
          <tr>
            <td>asdasd</td>
            <td>asdasd</td>
            <td>asdasd</td>
            <td>asdasd</td>
            <td>asdasd</td>
          </tr>
          <tr>
            <td>asdasd</td>
          </tr>
          <tr>
            <td>asdasd</td>
          </tr>
          <tr>
            <td>asdasd</td>
          </tr>
          <tr>
            <td>asdasd</td>
          </tr>
        </tbody>
      ) : (
        <></>
      )}
    </>
  );
};

export default Tbody;
