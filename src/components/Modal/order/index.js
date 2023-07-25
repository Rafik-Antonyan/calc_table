import { Box, Button, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { notifyError } from 'utils'
import { useEnter } from 'hooks'
import { useDispatch, useSelector } from 'react-redux'
import { activeValues, increaseTabAccess } from 'actions/calculateAction'
import "./order.css"

export const Order = ({ next, setManualOrderData, back }) => {
    const [orders, setOrders] = useState([
        { qty: "", unitPrice: "" },
    ])
    const { active } = useSelector(state => state.calculation)

    const dispatch = useDispatch()

    useEffect(() => {
        let activeOrders = Object.keys(active).filter(elm => elm.includes("Order"))
        let actives = []
        activeOrders.forEach((order, index) => {
            actives.push({ qty: active[order], unitPrice: active[`__EMPTY_${index + 1}`] })
        })

        setOrders(actives.length ? [...actives] : [...orders])
    }, [])

    const nextStep = () => {
        orders.forEach(order => {
            let values = Object.values(order)
            values.forEach(value => {
                if (!value) {
                    notifyError("Please complete all fields.")
                } else if (value < 0) {
                    notifyError("Each field must be positive.")
                } else {
                    let obj = {}
                    orders.forEach((order, index) => {
                        obj[`Order ${index + 1}`] = order.qty
                        obj[`__EMPTY_${index + 1}`] = order.unitPrice
                    })
                    setManualOrderData([obj])
                    dispatch(activeValues(obj))
                    dispatch(increaseTabAccess(2))
                    next()
                }
            })
        })
    }

    const setText = (text, index, field) => {
        let ordersCopy = [...orders]
        ordersCopy[index] = { ...ordersCopy[index], [field]: text }
        setOrders(ordersCopy)
    }

    useEnter(nextStep)

    return (
        <>
            {orders.map((order, index) => {
                return <div key={index} className='modal_order_container'>
                    <h3>Order {index + 1}</h3>
                    <TextField className='modal_order_container_input' label="QTY" variant="outlined" value={order.qty} onChange={(e) => setText(+e.target.value, index, "qty")} type="number" />
                    <TextField className='modal_order_container_input' label="Unit Price" variant="outlined" value={order.unitPrice} onChange={(e) => setText(+e.target.value, index, "unitPrice")} type="number" />
                </div>
            })}
            {orders.length < 3 && <button onClick={() => setOrders([...orders, { qty: "", unitPrice: "" }])} id='plus_button'>+</button>}
            <Box sx={{ mt: "10px" }}>
                <Button onClick={back} sx={{ width: "50%" }} variant="outlined">Back</Button>
                <Button onClick={nextStep} sx={{ width: "50%" }} variant="contained">Next</Button>
            </Box >
        </>
    )
}
