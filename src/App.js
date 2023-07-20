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
import { addNewFields, addNewTable, selectWareHouse } from "actions/calculateAction"
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentDate = getCurrentDate()
  const [workbook, setWorkbook] = useState(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [from, setFrom] = useState(currentDate)
  const [to, setTo] = useState(currentDate)
  const options = ["Stock", "COGS", "Months average COGS"]
  const wareHouse = [{ name: "UK", price: 1.2 }, { name: "EU", price: 1.5 }, { name: "United Arab Emirates", price: 2 }, { name: "Australia", price: 1.8 }, { name: "Singapore", price: 1 }]
  const dispatch = useDispatch();

  const { calculationTables, fields, selectedWareHouse } = useSelector(state => state.calculation)

  useEffect(() => {
    setWorkbook(null)
    setSelectedOption("")
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
      let { fields: newFields, formatedData } = orderTableGenerator({ salesData, orderData, skuData, selectedWareHouse: selectedWareHouse.price })

      newFields = selectPeriod(newFields, startFrom, endFrom)

      dispatch(addNewTable(formatedData))
      dispatch(addNewFields(newFields))
    } else {
      notifyError("Please select date.");
    }
  }

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

  const selectingWareHouse = (name) => {
    const selected = wareHouse.find(house => house.name === name)
    dispatch(selectWareHouse(selected))
  }

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <CustomModal data={isModalOpen} setData={setIsModalOpen} />
    <ToastContainer />
    <div id='info_div'>
      <h1>Internal Purchase Pricing and Stock Value Tracking </h1>
      <Box sx={{ minWidth: 500, mt: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label1">Select your warehouse</InputLabel>
          <Select
            labelId="demo-simple-select-label1"
            id="demo-simple-select"
            value={selectedWareHouse.name}
            label="Select your warehouse"
            onChange={e => selectingWareHouse(e.target.value)}
          >
            {wareHouse.map((option, index) => {
              return <MenuItem key={index} value={option.name}>{option.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
      {!!selectedWareHouse.name.length && <Box sx={{ display: 'flex', gap: "50px", justifyContent: "space-around" }}>
        <input id="file-upload" type="file" onChange={hadleFileUpLoad} ref={inputFile} accept=".xlsx" />
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload Excel file
        </label>
        <label className="custom-file-upload" variant="outlined" onClick={() => setIsModalOpen(true)}>Do it Manually</label>
      </Box>}
      {workbook &&
        <Box sx={{ minWidth: 500, mt: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select What you want to calculate</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedOption}
              label="Select What you want to calculate"
              onChange={e => setSelectedOption(e.target.value)}
            >
              {options.map((option, index) => {
                return <MenuItem key={index} value={option}>{option}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>}

      {!!selectedOption.length &&
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
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

      {fields.map((_, index) => {
        return <MuiTable key={index} fields={fields[index]} data={calculationTables[index]} tableIndex={index} />
      })}

    </div>
  </div>
}

export default App;
