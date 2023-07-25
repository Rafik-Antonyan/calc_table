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
import { Box, Button, Input, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOutSideClick, useEnter, useDebounce } from 'hooks';
import { notifyError } from 'utils'
import "./muiTable.css"
import { useDispatch, useSelector } from 'react-redux';
import { editRow, removeTable } from 'actions/calculateAction';
import EditIcon from '@mui/icons-material/Edit';
import { EditModal } from './editModal';

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
    const [searchedSku, setSearchedSku] = useState("")
    const [dataFromSearch, setDataFromSearch] = useState([])
    const [page, setPage] = useState(0);
    const [tableHeight, setTableHeight] = useState("max");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCall, setSelectedCell] = useState(null)
    const [columns, setColumns] = useState([])
    const [currentPrice, setCurrentPrice] = useState(0)
    const [lastChangedStock, setLastChangedStock] = useState(null)
    const [filteredFields, setFilteredFields] = useState([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [editSku, setEditSku] = useState("")
    const dispatch = useDispatch()
    const { initData } = useSelector(state => state.calculation)
    useEffect(() => {
        let copy = JSON.parse(JSON.stringify(fields))
        if (copy.at(-1) === "manual") {
            copy.pop()
        }
        setFilteredFields(copy)
    }, [fields, data])

    useEffect(() => {
        if (filteredFields.length) {
            setColumns(createHeader(filteredFields))
            setRows(data)
        }
    }, [filteredFields])

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

    const search = () => {
        setDataFromSearch(data.filter(elm => elm.SKU.toLowerCase().startsWith(debounced)))
    }

    const debounced = useDebounce(searchedSku, 300)

    useEffect(() => {
        search()
    }, [debounced, data])

    useEnter(initValue)
    useOutSideClick(callRef, initValue)

    const editColumn = (sku) => {
        let copy = initData[tableIndex]
        let index = copy.skuData.findIndex(elm => elm.SKU === sku)
        let sales = copy.salesData.find((_, ind) => ind === index)
        setEditSku(sku)
        setEditIndex(index)
        setIsEditModalOpen(true)
        dispatch(editRow(sales))
    }
    return (
        <>
            {editSku && <EditModal value={isEditModalOpen} setValue={setIsEditModalOpen} rowIndex={editIndex} tableIndex={tableIndex} sku={editSku} />}
            {
                Object.keys(data).length ?
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: "10px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <TextField label="Search by sku" variant="outlined" sx={{ my: 1, width: "40%" }} value={searchedSku} onChange={(e) => setSearchedSku(e.target.value)} />
                            <Box>
                                {tableHeight === "min" ? <AddIcon className='table_menu_button' onClick={minimizeTable} /> : <RemoveIcon className='table_menu_button' onClick={minimizeTable} />}
                                <CloseIcon className='table_menu_button' onClick={closeTable} />
                            </Box>
                        </Box>
                        <TableContainer id='table_container' sx={tableHeight === "min" ? { maxHeight: 200 } : {}}>
                            <Table stickyHeader aria-label="sticky table" sx={{ border: 2 }}>
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
                                    {debounced.length ? dataFromSearch
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index} sx={{ alignItems: "center" }}>
                                                    {row && columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell style={setColor(column.id, row)} key={column.id} align={column.align}>
                                                                {!(column.id === "SKU" || column.id === "stock" || column.id === "Stock Threshold") && "$"}
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    {fields.at(-1) !== "manual" &&
                                                        <TableCell>
                                                            <Button variant='contained' onClick={() => editColumn(row.SKU)}>
                                                                <EditIcon />
                                                            </Button>
                                                        </TableCell>}
                                                </TableRow>
                                            );
                                        }) :
                                        <>
                                            {columns && !!rows.length && rows
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            {row && columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <TableCell style={setColor(column.id, row)} key={column.id} align={column.align}>
                                                                        {!(column.id === "SKU" || column.id === "stock" || column.id === "Stock Threshold") && "$"}
                                                                        {column.format && typeof value === 'number'
                                                                            ? column.format(value)
                                                                            : value}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                        </>}
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