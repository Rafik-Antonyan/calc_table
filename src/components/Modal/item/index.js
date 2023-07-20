import { Button, TextField } from "@mui/material"
import { activeValues, increaseTabAccess } from "actions/calculateAction"
import { useEnter } from "hooks"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { notifyError } from "utils"

export const Item = ({ next, skuManagment, setSkuManagment }) => {
    const [sku, setSku] = useState("")
    const [stock, setStock] = useState("")
    const dispatch = useDispatch()
    const { active } = useSelector(state => state.calculation)

    useEffect(() => {
        setSku(active.sku ? active.sku : "")
        setStock(active.stock ? active.stock : "")
    }, [])

    const nextStep = () => {
        if (sku.length === 0 || stock.length === 0) {
            notifyError("Please complete all fields.")
        } else if (+stock < 0) {
            notifyError("Stock count must be positive.")
        } else {
            setSkuManagment([...skuManagment, {
                SKU: sku,
                ["Stock Threshold"]: stock
            }])
            dispatch(activeValues({ sku, stock }))
            dispatch(increaseTabAccess(1))
            next()
        }
    }

    useEnter(nextStep)

    return <>
        <TextField label="SKU" variant="outlined" value={sku} onChange={(e) => setSku(e.target.value)} />
        <TextField label="Stock Threshold" variant="outlined" value={stock} onChange={(e) => setStock(+e.target.value)} type="number" />
        <Button onClick={nextStep} sx={{ height: "56px", width: "200px" }} variant="contained">Next</Button>
    </>
}