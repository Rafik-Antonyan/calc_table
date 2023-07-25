import { Box, Button, Modal, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { saveEdit, setTableIndex } from 'actions/calculateAction';
import './editModal.css'

export const EditModal = ({ value, setValue, rowIndex, tableIndex, sku }) => {
  const [fields, setFields] = useState([])
  const [values, setValues] = useState([])
  const { editValues, initData } = useSelector(state => state.calculation)
  const dispatch = useDispatch()

  useEffect(() => {
    setFields(Object.keys(editValues).slice(2))
    setValues(Object.values(editValues).slice(2))
  }, [])

  const edit = (text, index) => {
    setValues(values.map((value, ind) => {
      if (ind === index) {
        return text
      }
      return value
    }))
  }

  const save = () => {
    let copy = JSON.parse(JSON.stringify(initData))
    copy[tableIndex].salesData.map((data, ind) => {
      if (ind === rowIndex) {
        fields.forEach((field, index) => {
          data[field] = values[index]
        })
      }
      return data
    })
    setValue(false)
    dispatch(saveEdit(copy))
    dispatch(setTableIndex(tableIndex))
  }

  return (
    <Modal
      open={value}
      onClose={() => setValue(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box id="modal" sx={{ width: '100%' }}>
        <Box id='edit_modal_header' sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <h3>{sku}</h3>
          <Button onClick={() => setValue(false)}>
            <CloseIcon sx={{ color: "black" }} />
          </Button>
        </Box>
        {fields.map((field, index) => {
          return <TextField label={field} key={index} value={values[index]} onChange={(e) => edit(+e.target.value, index)} variant="outlined" sx={{ width: "100%", mb:"10px" }} />
        })}
        <Button onClick={save} sx={{width:"100%", mt:"10px"}} variant='contained'>Save</Button>
      </Box>
    </Modal>
  )
}
