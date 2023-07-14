import React, { useRef, useState } from 'react'
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
import "./muiTable.css"
import useEnter from '../../hooks/useEnter';
import { useOutSideClick } from '../../hooks/useOutSideClick';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}

const MuiTable = ({ close }) => {
    const callRef = useRef(null)
    const [rows, setRows] = useState([
        createData('India', 'IN', 1324171354, 3287263),
        createData('China', 'CN', 1403500365, 9596961),
        createData('Italy', 'IT', 60483973, 301340),
        createData('United States', 'US', 327167434, 9833520),
        createData('Canada', 'CA', 37602103, 9984670),
        createData('Australia', 'AU', 25475400, 7692024),
        createData('Germany', 'DE', 83019200, 357578),
        createData('Ireland', 'IE', 4857000, 70273),
        createData('Mexico', 'MX', 126577691, 1972550),
        createData('Japan', 'JP', 126317000, 377973),
        createData('France', 'FR', 67022000, 640679),
        createData('United Kingdom', 'GB', 67545757, 242495),
        createData('Russia', 'RU', 146793744, 17098246),
        createData('Nigeria', 'NG', 200962417, 923768),
        createData('Brazil', 'BR', 210147125, 8515767),
    ]);

    const [page, setPage] = useState(0);
    const [tableHeight, setTableHeight] = useState("max");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedCall, setSelectedCell] = useState(null)

    const handleChangePage = (event, newPage) => {
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
        close()
    }

    const tableCallOnChange = (e, index, columnId) => {
        const formattedValue = e.target.value.replace(/,/g, "");
        const copyRows = [...rows]
        copyRows[index][columnId] = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        setRows(copyRows)
    }

    const initValue = () =>{
        setSelectedCell('')
    }

    useEnter(initValue)
    useOutSideClick(callRef, initValue)

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: "10px" }}>
            <div style={{ textAlign: "end" }}>
                <RemoveIcon className='table_menu_button' onClick={minimizeTable} />
                <CloseIcon className='table_menu_button' onClick={closeTable} />
            </div>
            <TableContainer sx={tableHeight === "min" ? { maxHeight: 200 } : {}}>
                <Table stickyHeader aria-label="sticky table" sx={{ border: 1 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} onDoubleClick={() => setSelectedCell(column.id + row.name)}>
                                                    {column.id + row.name === selectedCall ?
                                                        <Input ref={callRef} value={column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value} onChange={(e) => tableCallOnChange(e, index, column.id)} />
                                                        :
                                                        <>
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default MuiTable