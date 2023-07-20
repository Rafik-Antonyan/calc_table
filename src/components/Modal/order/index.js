import { Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { notifyError } from 'utils'
import { useEnter } from 'hooks'
import { useDispatch, useSelector } from 'react-redux'
import { activeValues, increaseTabAccess } from 'actions/calculateAction'
import "./order.css"

export const Order = ({ next, manualOrderData, setManualOrderData }) => {
    const [order1, setOrder1] = useState({ qty: "", unitPrice: "" })
    const [order2, setOrder2] = useState({ qty: "", unitPrice: "" })
    const [order3, setOrder3] = useState({ qty: "", unitPrice: "" })
    const { active } = useSelector(state => state.calculation)

    const dispatch = useDispatch()

    useEffect(() => {
        setOrder1(active["Order 1"] ? { qty: active["Order 1"], unitPrice: active["__EMPTY_1"] } : { qty: "", unitPrice: "" })
        setOrder2(active["Order 2"] ? { qty: active["Order 2"], unitPrice: active["__EMPTY_2"] } : { qty: "", unitPrice: "" })
        setOrder3(active["Order 3"] ? { qty: active["Order 3"], unitPrice: active["__EMPTY_3"] } : { qty: "", unitPrice: "" })
    }, [])

    const nextStep = () => {
        if (order1.qty.length === 0 || order2.qty.length === 0 || order3.qty.length === 0 || order1.unitPrice.length === 0 || order2.unitPrice.length === 0 || order3.unitPrice.length === 0) {
            notifyError("Please complete all fields.")
        } else if (+order1.qty < 0 || +order2.qty < 0 || +order3.qty < 0 || +order1.unitPrice < 0 || +order2.unitPrice < 0 || +order3.unitPrice < 0) {
            notifyError("Each field must be positive.")
        } else {
            setManualOrderData([...manualOrderData, {
                ["Order 1"]: order1.qty,
                ["Order 2"]: order2.qty,
                ["Order 3"]: order3.qty,
                ["__EMPTY_1"]: order1.unitPrice,
                ["__EMPTY_2"]: order2.unitPrice,
                ["__EMPTY_3"]: order3.unitPrice,
            }])
            dispatch(activeValues({
                ["Order 1"]: order1.qty,
                ["Order 2"]: order2.qty,
                ["Order 3"]: order3.qty,
                ["__EMPTY_1"]: order1.unitPrice,
                ["__EMPTY_2"]: order2.unitPrice,
                ["__EMPTY_3"]: order3.unitPrice,
            }))
            dispatch(increaseTabAccess(2))
            next()
        }
    }

    useEnter(nextStep)

    return (
        <>
            <div className='modal_order_container'>
                <h3>Order 1</h3>
                <TextField className='modal_order_container_input' label="QTY" variant="outlined" value={order1.qty} onChange={(e) => setOrder1({ qty: +e.target.value, unitPrice: order1.unitPrice })} type="number" />
                <TextField className='modal_order_container_input' label="Unit Price" variant="outlined" value={order1.unitPrice} onChange={(e) => setOrder1({ qty: order1.qty, unitPrice: +e.target.value })} type="number" />
            </div>
            <div className='modal_order_container'>
                <h3>Order 2</h3>
                <TextField className='modal_order_container_input' label="QTY" variant="outlined" value={order2.qty} onChange={(e) => setOrder2({ qty: +e.target.value, unitPrice: order2.unitPrice })} type="number" />
                <TextField className='modal_order_container_input' label="Unit Price" variant="outlined" value={order2.unitPrice} onChange={(e) => setOrder2({ qty: order2.qty, unitPrice: +e.target.value })} type="number" />
            </div>
            <div className='modal_order_container'>
                <h3>Order 3</h3>
                <TextField className='modal_order_container_input' label="QTY" variant="outlined" value={order3.qty} onChange={(e) => setOrder3({ qty: +e.target.value, unitPrice: order3.unitPrice })} type="number" />
                <TextField className='modal_order_container_input' label="Unit Price" variant="outlined" value={order3.unitPrice} onChange={(e) => setOrder3({ qty: order3.qty, unitPrice: +e.target.value })} type="number" />
            </div>
            <Button onClick={nextStep} sx={{ height: "56px", width: "100%" }} variant="contained">Next</Button>
        </>
    )
}
