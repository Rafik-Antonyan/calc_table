import React, { useState, useRef } from "react";
import * as XLSX from 'xlsx';
import { MARKETPLACE_TYPES } from '../../../actions/actionType';
import { useDispatch } from "react-redux";
import "../../../style/home.css";

export const excelReader = ({ handleModalOpen }) => {

    const dispatch = useDispatch();

    const inputFile = useRef(null);

    const [csvFile, setCsvFile] = useState("");

    const hadleFileUpLoad = e => {

        const { files } = e.target;

        if (files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                dispatch({ type: MARKETPLACE_TYPES.GET_IMPORT_DATA, payload: json });
                dispatch({ type: MARKETPLACE_TYPES.GET_IMPORT_DATA_NAME, payload: files[0].name })
                handleModalOpen(true)
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }

    }

    const onButtonClick = () => {
        inputFile.current.click();
    };

    return (
        <React.Fragment>
            <input
                style={{ display: "none" }}
                ref={inputFile}
                type="file"
                id={"csvFileInput"}
                accept=".xlsx"
                onChange={hadleFileUpLoad}
            />
            <div className='export-button' onClick={onButtonClick} >
                <div className='export-main-button'>
                    <div className='import-logo'></div>
                    <a className='export-label'>Import File</a>
                </div>
            </div>


        </React.Fragment>
    );
}
