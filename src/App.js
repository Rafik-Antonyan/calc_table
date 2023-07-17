import React, { useState, useRef } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import { Vector, Vector1 } from './assets/images';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getCurrentDate } from './utils/dateFormators/getCurrentDate';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MuiTable from './components/MuiTable/MuiTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';


function App() {
  const notifySuccess = (text) => toast.success(text);
  const notifyError = (text) => toast.error(text);
  const currentDate = getCurrentDate()
  // const [age, setAge] = useState("");
  // const [status, setStatus] = useState("")
  const [data, setData] = useState({})
  const [options, setOptions] = useState(["Stock", "COGS", "Months average COGS"])
  const [selectedOption, setSelectedOption] = useState("")
  const [from, setFrom] = useState(currentDate)
  const [to, setTo] = useState(currentDate)
  const [openTable, setOpenTable] = useState(false)
  // const [openModal, setOpenModal] = useState(false)
  // const [openFromCalendar, setOpenFromCalendar] = useState(true)
  // const [openToCalendar, setOpenToCalendar] = useState(false)
  const handleFile = (e) => {
    ExcelRenderer(e.target.files[0], (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setData(resp)
      }
    });
  };

  const open = () => {
    const formatedToValue = to.$d.toISOString().substring(0, 10).split("-")
    const formatedFromValue = from.$d.toISOString().substring(0, 10).split("-")

    if (+formatedFromValue[0] > +formatedToValue[0]) {
      notifyError("Please select correct date!")
      return
    } else if (+formatedFromValue[0] === +formatedToValue[0] && +formatedFromValue[1] > +formatedToValue[1]) {
      notifyError("Please select correct date!")
      return
    } else if (+formatedFromValue[0] === +formatedToValue[0] && +formatedFromValue[1] === +formatedToValue[1] && +formatedFromValue[2] > +formatedToValue[2]) {
      notifyError("Please select correct date!")
      return
    }

    if (typeof from !== "string" && typeof to !== "string") {
      console.log("---------");
      setOpenTable(true)
    }
  }


  // const inputFile = useRef(null);

  // const [csvFile, setCsvFile] = useState("");

  // const hadleFileUpLoad = e => {

  //   const { files } = e.target;

  //   if (files) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const json = XLSX.utils.sheet_to_json(worksheet);

  //       const sheetName1 = workbook.SheetNames[1];
  //       const worksheet1 = workbook.Sheets[sheetName1];
  //       const json1 = XLSX.utils.sheet_to_json(worksheet1);
  //       console.log(json,'json', sheetName);
  //       console.log(json1,'json1', sheetName1);

  //       // dispatch({ type: MARKETPLACE_TYPES.GET_IMPORT_DATA, payload: json });
  //       // dispatch({ type: MARKETPLACE_TYPES.GET_IMPORT_DATA_NAME, payload: files[0].name })
  //     };
  //     console.log(reader.readAsArrayBuffer(e.target.files[0]),'----');
      
  //   }

  // }

  // const onButtonClick = () => {
  //   console.log(111);
  //   inputFile.current.click();
  // };


  // return (
  //   <React.Fragment>
  //     <input
  //       ref={inputFile}
  //       type="file"
  //       id={"csvFileInput"}
  //       accept=".xlsx"
  //       onChange={hadleFileUpLoad}
  //     />
 


  //   </React.Fragment>
  // );

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <ToastContainer />
    <div id='info_div'>
      <h1>Internal Purchase Pricing and Stock Value Tracking </h1>
      {/* <h3>
        <img src={filter} />
        <div className="filters" id='dt_brand'>
          <span>DT-Brand</span>
          <img src={cross} />
        </div>
        <div className="filters" id='price'>
          <span>$1200</span>
          <img src={cross} />
        </div>
        <div className="filters">
          <img src={btnsSet} />
        </div>
      </h3>
      <p>Showing <span className='numbers'>198</span> from <span className='numbers'>893</span> results</p> */}
      <input id="file-upload" type="file" onChange={handleFile} />
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload Excel file
      </label>
      {!!Object.keys(data).length &&
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
          {/* ---------------1---------------- */}
          {/* <FormGroup sx={{ display: 'flex', flexDirection: "row" }}>
            <FormControlLabel control={
              <Switch checked={openFromCalendar} onChange={() => setOpenFromCalendar(!openFromCalendar)} />
            } label="From" />
            <FormControlLabel control={
              <Switch checked={openToCalendar} onChange={() => setOpenToCalendar(!openToCalendar)} />
            } label="To" />
          </FormGroup>
          <div id='calendar_container'>
            {openFromCalendar && <div>

              <Calendar label="from" className="calendar" onChange={() => { }} />
            </div>}
            {openToCalendar && <Calendar className="calendar" onChange={() => { }} />}
          </div> */}

          {/* --------------2----------------- */}
          {/* <div id='open_modal_container'>
            <button id='open_modal_container_button' onClick={() => setOpenModal(true)}>Select Period</button>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box id="modal">
                <div id='modal_header_container'>
                  <h2 id="parent-modal-title">Select date</h2>
                  <img src={cross} onClick={() => setOpenModal(false)} />
                </div>
                <div className='date_selected_type'>
                  <p>From:</p>
                  <Button onClick={() => setOpenFromCalendar(!openFromCalendar)}>{currentDate} &nbsp; <CalendarMonthIcon /></Button>
                </div>
                {openFromCalendar && <Calendar className="calendar" onChange={() => { }} />}
                <div className='date_selected_type'>
                  <p>To: &nbsp; </p>
                  <Button onClick={() => setOpenToCalendar(!openToCalendar)}>{currentDate} &nbsp; <CalendarMonthIcon /></Button>
                </div>
                {openToCalendar && <Calendar className="calendar" onChange={() => { }} />}
                <Button id='save_button' onClick={() => setOpenModal(false)}>Save</Button>
              </Box>
            </Modal>
          </div> */}

          {/* -----------------3-------------- */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker className='date_picker' label="From" value={from} onChange={setFrom} />
              <DatePicker
                className='date_picker'
                label="To"
                value={to}
                onChange={setTo}
                inputFormat="E MMM dd yyyy HH:MM:SS O"
              />
              <Button id='see_result' onClick={open}>see result</Button>
            </DemoContainer>
          </LocalizationProvider>
        </>
      }

      {openTable && <MuiTable close={() => setOpenTable(false)} />}
    </div>

    {/* {!!selectedOption.length && <Calendar onChange={() => { }} value={1} />} */}
    {/* <Table data={data} /> */}

  </div>
}

export default App;
