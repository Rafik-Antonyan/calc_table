import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider, MonthCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useEnter } from 'hooks';
import "./sales.css"

export const Sales = ({ next, manualSalesData, setManualSalesData }) => {
    const [dateType, setDateType] = useState("")
    const [salesOrder, setSalesOrder] = useState({})
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState("")
    // dzel es masy
    const [send, setSend] = useState(false)

    const selectMonth = (month) => {
        setSelectedMonth(month)
        setIsOpenModal(true)
    }

    const save = () => {
        setManualSalesData([...manualSalesData, salesOrder])
        setIsOpenModal(false)
        setSend(true)
    }

    // dzel es masy
    useEffect(() => {
        if (send) {
            next()
        }
    }, [send])

    const closeModal = () => setIsOpenModal(false)

    useEnter(closeModal)

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Date Type</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={dateType}
                    label="Select Date Type"
                    onChange={(e) => setDateType(e.target.value)}
                >
                    <MenuItem value={"Daily"}>Daily</MenuItem>
                    <MenuItem value={"Monthly"}>Monthly</MenuItem>
                </Select>
            </FormControl>
            <Box>
                {dateType === "Daily" &&
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker className='date_picker' label="Days" />
                            <Button>see result</Button>
                        </DemoContainer>
                    </LocalizationProvider>
                }
                {dateType === "Monthly" &&
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MonthCalendar']}>
                            <MonthCalendar id="month_calendar" onChange={(e) => selectMonth(e.$d.toString().split(" ")[1])} />
                            <Modal
                                open={isOpenModal}
                                onClose={closeModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box id='month_modal'>
                                    <Box id='month_modal_header' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <h2>How many items you sold in <span id='selected_month'>{selectedMonth}</span> ?</h2>
                                        <Button onClick={closeModal}>
                                            <CloseIcon sx={{ color: "black" }} />
                                        </Button>
                                    </Box>
                                    <Box>
                                        <TextField sx={{ width: "100%" }} label="Sales" variant="outlined" type="number" value={salesOrder[selectedMonth] ? salesOrder[selectedMonth] : ""} onChange={(e) => setSalesOrder({ ...salesOrder, [selectedMonth]: +e.target.value })} />
                                    </Box>
                                </Box>
                            </Modal>
                            <Button onClick={save}>see result</Button>
                        </DemoContainer>
                    </LocalizationProvider>
                }
            </Box>
        </Box>
    )
}
