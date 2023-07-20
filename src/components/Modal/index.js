import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Tab, Tabs } from '@mui/material';
import { Item } from './item';
import { Order } from './order';
import './modal.css'
import { Sales } from './sales';
import { notifyError, orderTableGenerator } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { CALCULATION_TYPES } from 'actions/actionType';
import { addNewFields, addNewTable } from 'actions/calculateAction';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ px: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const CustomModal = ({ data, setData }) => {
    const dispatch = useDispatch()
    const [value, setValue] = useState(0);
    const [skuManagment, setSkuManagment] = useState([])
    const [manualOrderData, setManualOrderData] = useState([])
    const [manualSalesData, setManualSalesData] = useState([])

    const { tabAccess, selectedWareHouse } = useSelector(state => state.calculation)

    const save = () => {
        let { fields, formatedData } = orderTableGenerator({ salesData: manualSalesData, orderData: manualOrderData, skuData: skuManagment, type: "manual", selectedWareHouse: selectedWareHouse.price })
        dispatch(addNewTable(formatedData))
        dispatch(addNewFields(fields))
        setData(false)
    }

    const handleChange = (_, newValue) => {
        if (tabAccess >= newValue) {
            setValue(newValue);
        } else {
            notifyError("Please complete previous steps.");
        }
    };

    return (
        <Modal
            open={data}
            onClose={() => setData(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box id="modal" sx={{ width: '100%' }}>
                <Box id='modal_header' sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Item" />
                        <Tab label="Orders" />
                        <Tab label="Sales" />
                    </Tabs>
                    <Button onClick={() => setData(false)}>
                        <CloseIcon sx={{ color: "black" }} />
                    </Button>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Item next={() => setValue(value + 1)} skuManagment={skuManagment} setSkuManagment={setSkuManagment} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Order next={() => setValue(value + 1)} manualOrderData={manualOrderData} setManualOrderData={setManualOrderData} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <Sales next={save} manualSalesData={manualSalesData} setManualSalesData={setManualSalesData} />
                </CustomTabPanel>
            </Box>
        </Modal>
    )
}
