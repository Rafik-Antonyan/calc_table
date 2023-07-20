import React, { useEffect, useRef, useState } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { Input } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOutSideClick, useEnter } from 'hooks';
import { notifyError } from 'utils'
import "./muiTable.css"
import { useDispatch } from 'react-redux';
import { CALCULATION_TYPES } from 'actions/actionType';
import { removeTable } from 'actions/calculateAction';

const createHeader = (fields) => {
    let columns = [];

    fields.forEach(field => {
        columns.push({ id: field, label: field.toUpperCase(), minWidth: field === "SKU" ? 170 : 120 })
    })

    return columns
}

const MuiTable = ({ data, fields, tableIndex }) => {
    const callRef = useRef(null)
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [tableHeight, setTableHeight] = useState("max");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCall, setSelectedCell] = useState(null)
    const [columns, setColumns] = useState([])
    const [currentPrice, setCurrentPrice] = useState(0)
    const [lastChangedStock, setLastChangedStock] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (fields.length) {
            setColumns(createHeader(fields))
            setRows(data)
        }
    }, [data])


    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const minimizeTable = () => {
        setTableHeight(tableHeight === "min" ? "max" : "min")
    }

    const closeTable = () => {
        dispatch(removeTable(tableIndex))
    }

    const openInput = (id, field, price) => {
        if (field !== "SKU") {
            setSelectedCell(id)
            setCurrentPrice(price)
            setLastChangedStock(id.split(" ")[0])
        }
    }

    const tableCallOnChange = (e, index, columnId) => {
        if (e.target.value.match(/[a-zA-Z]/g)) {
            notifyError("Unexpected character.")
            return
        }
        const formattedValue = e.target.value.replace(/,/g, "");
        const numbers = formattedValue.split(".")[0]
        const decemals = formattedValue.split(".")[1]
        const copyRows = [...rows]
        if (typeof decemals === "string") {
            copyRows[index][columnId] = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decemals
        } else {
            copyRows[index][columnId] = (numbers * 100 / 100).toLocaleString()
        }

        setRows(copyRows)
    }

    const initValue = () => {
        setRows(rows.map(row => {
            if (row.SKU === lastChangedStock) {
                row.eof = +row.stock * +currentPrice
            }
            return row
        }))
        setSelectedCell('')
    }

    const setColor = (id, row) => {
        return id === "stock" && row.stock < row["Stock Threshold"] ? { background: "#ff4d4d" } : id === "stock" ? { background: "green" } : {}
    }

    useEnter(initValue)
    useOutSideClick(callRef, initValue)

    return (
        <>
            {
                Object.keys(data).length ?
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: "10px" }}>
                        <div style={{ textAlign: "end" }}>
                            {tableHeight === "min" ? <AddIcon className='table_menu_button' onClick={minimizeTable} /> : <RemoveIcon className='table_menu_button' onClick={minimizeTable} />}
                            <CloseIcon className='table_menu_button' onClick={closeTable} />
                        </div>
                        <TableContainer id='table_container' sx={tableHeight === "min" ? { maxHeight: 200 } : {}}>
                            <Table stickyHeader aria-label="sticky table" sx={{ border: 1 }}>
                                <TableHead>
                                    <TableRow>
                                        {columns && columns.map((column) => (
                                            <TableCell
                                                sx={{ fontWeight: 'bold', borderBottom: "1px solid black" }}
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {columns && !!rows.length && rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    {row && columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell style={setColor(column.id, row)} key={column.id} align={column.align} onDoubleClick={() => openInput(row.SKU + " " + column.id, column.id, (row.eof / row.stock))}>
                                                                {row.SKU + " " + column.id === selectedCall ?
                                                                    <Input ref={callRef} value={value} onChange={(e) => tableCallOnChange(e, index, column.id)} />
                                                                    :
                                                                    <>
                                                                        {!(column.id === "SKU" || column.id === "stock" || column.id === "Stock Threshold") && "$"}
                                                                        {column.format && typeof value === 'number'
                                                                            ? column.format(value)
                                                                            : value}
                                                                    </>
                                                                }
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length ? rows.length : 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                    : <></>
            }
        </>
    )
}

export default MuiTable