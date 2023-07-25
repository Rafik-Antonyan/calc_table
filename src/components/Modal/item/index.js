import { Box, Button, TextField } from "@mui/material"
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

    return <Box>
        <Box>
            <TextField label="SKU" variant="outlined" value={sku} onChange={(e) => setSku(e.target.value)} sx={{ width: "50%" }} />
            <TextField label="Stock Threshold" variant="outlined" value={stock} onChange={(e) => setStock(+e.target.value)} sx={{ width: "50%" }} type="number" />
        </Box>
        <Box sx={{ mt: "10px" }}>
            <Button sx={{ width: "50%" }} variant="outlined" disabled>Back</Button>
            <Button onClick={nextStep} sx={{ width: "50%" }} variant="contained">Next</Button>
        </Box >
    </Box>
}