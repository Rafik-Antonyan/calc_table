import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MuiTable from './components/MuiTable/MuiTable';
import { ToastContainer } from 'react-toastify';
import * as XLSX from 'xlsx';
import { orderTableGenerator, notifyError, getCurrentDate, selectPeriod } from 'utils';
import { CustomModal } from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFields, addNewTable, addNewWareHouse, selectWareHouse, setEditedData, setInitData, setPeriod } from "actions/calculateAction"
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableCount, setTableCount] = useState([0])
  const currentDate = getCurrentDate()
  const [workbook, setWorkbook] = useState(null)
  const [from, setFrom] = useState(currentDate)
  const [to, setTo] = useState(currentDate)
  const wareHouse = [{ name: "UK", price: 1.2 }, { name: "EU", price: 1.5 }, { name: "United Arab Emirates", price: 2 }, { name: "Australia", price: 1.8 }, { name: "Singapore", price: 1 }]
  const dispatch = useDispatch();

  const { calculationTables, fields, selectedWareHouse, initData, editedTableIndex } = useSelector(state => state.calculation)

  useEffect(() => {
    setWorkbook(null)
    setFrom(currentDate)
    setTo(currentDate)
    setIsModalOpen(false)
  }, [fields])

  const open = () => {
    if (typeof from !== "string" && typeof to !== "string") {
      const formatedToValue = to.$d.toISOString().substring(0, 10).split("-")
      const formatedFromValue = from.$d.toISOString().substring(0, 10).split("-")
      const startFrom = from.$d.toString().split(" ")[1]
      const endFrom = to.$d.toString().split(" ")[1]

      if (+formatedFromValue[0] > +formatedToValue[0] ||
        (+formatedFromValue[0] === +formatedToValue[0] && +formatedFromValue[1] > +formatedToValue[1]) ||
        (+formatedFromValue[0] === +formatedToValue[0] && +formatedFromValue[1] === +formatedToValue[1] && +formatedFromValue[2] > +formatedToValue[2])) {
        notifyError("Please select correct date.");
        return;
      }

      const orderData = XLSX.utils.sheet_to_json(workbook.Sheets["Order data"]).splice(1)
      const salesData = XLSX.utils.sheet_to_json(workbook.Sheets["Sales data"])
      const skuData = XLSX.utils.sheet_to_json(workbook.Sheets["SKU Management"])
      dispatch(setInitData({ orderData, skuData, salesData }))
      dispatch(setPeriod({ startFrom, endFrom }))
      let { fields: newFields, formatedData } = orderTableGenerator({ salesData, orderData, skuData, selectedWareHouse: selectedWareHouse[selectedWareHouse.length - 1].price })

      newFields = selectPeriod(newFields, startFrom, endFrom)
      dispatch(addNewTable(formatedData))
      dispatch(addNewFields(newFields))
    } else {
      notifyError("Please select date.");
    }
  }

  useEffect(() => {
    if (initData.length && editedTableIndex !== null) {
      let { formatedData } = orderTableGenerator({ salesData: initData[editedTableIndex].salesData, orderData: initData[editedTableIndex].orderData, skuData: initData[editedTableIndex].skuData, selectedWareHouse: selectedWareHouse[selectedWareHouse.length - 1].price })
      dispatch(setEditedData(formatedData))
    }
  }, [editedTableIndex, initData])

  const inputFile = useRef(null);

  const hadleFileUpLoad = e => {
    const { files } = e.target;

    if (files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        setWorkbook(XLSX.read(data, { type: "array" }));
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const selectingWareHouse = (name, index) => {
    const selected = wareHouse.find(house => house.name === name)
    dispatch(selectWareHouse(selected, index))
  }

  const addTable = () => {
    setTableCount([...tableCount, 0])
    dispatch(addNewWareHouse())
  }
  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <CustomModal data={isModalOpen} setData={setIsModalOpen} />
    <ToastContainer />

    <div id='info_div'>
      <h1>Internal Purchase Pricing and Stock Value Tracking </h1>
      {tableCount.map((_, index) => {
        return <div key={index}>
          {!fields[index] ?
            <>
              <Box sx={{ minWidth: 500, mt: 3, mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label1">Select your warehouse</InputLabel>
                  <Select
                    labelId="demo-simple-select-label1"
                    id="demo-simple-select"
                    value={selectedWareHouse[index] ? selectedWareHouse[index].name : ""}
                    label="Select your warehouse"
                    onChange={e => selectingWareHouse(e.target.value, index)}
                  >
                    {wareHouse.map((option, index) => {
                      return <MenuItem key={index} value={option.name}>{option.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Box>
              {selectedWareHouse[index] && !!selectedWareHouse[index].name.length && <Box sx={{ display: 'flex', gap: "50px", justifyContent: "space-around" }}>
                <input id="file-upload" type="file" onChange={hadleFileUpLoad} ref={inputFile} accept=".xlsx" />
                <label htmlFor="file-upload" className="custom-file-upload">
                  Upload Excel file
                </label>
                <label className="custom-file-upload" variant="outlined" onClick={() => setIsModalOpen(true)}>Do it Manually</label>
              </Box>}
              {workbook &&
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']} sx={{ mt: "10px" }}>
                      <DatePicker className='date_picker' label="From" value={from} onChange={setFrom} />
                      <DatePicker
                        className='date_picker'
                        label="To"
                        value={to}
                        onChange={setTo}
                        minDate={from ? from : null}
                      />
                      <Button id='see_result' onClick={open}>see result</Button>
                    </DemoContainer>
                  </LocalizationProvider>
                </>
              }
            </>
            :
            <MuiTable key={index} fields={fields[index]} data={calculationTables[index]} tableIndex={index} />
          }
        </div>
      })}

      {!!fields[tableCount.length - 1] && <>
        {fields.length < 5 ? <Button sx={{ mt: "20px" }} onClick={() => addTable()}>Add new Table</Button> : <p>Max count of tables(5/5)</p>}
      </>}
    </div>
  </div>
}

export default App;
