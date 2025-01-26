import { useState, useEffect } from "react";
import { SampleData } from "@/type";
import { flexRender, Table as TanstackTable } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Stack,
    Typography,
    InputLabel,
    Button,
} from "@mui/material";

type ReactTableProps = {
    table: TanstackTable<SampleData>;
};

const ReactTable = ({ table }: ReactTableProps) => {
    const [sensorTypeFilter, setSensorTypeFilter] = useState<string>("");
    const [nameFilter, setNameFilter] = useState<string>("");

    const rows = table.getRowModel().rows; // Get rows from Tanstack Table
    const headerGroups = table.getHeaderGroups(); // Get header groups from Tanstack Table

    useEffect(() => {
        table.getColumn("sensor_type")?.setFilterValue(sensorTypeFilter);
        table.getColumn("name")?.setFilterValue(nameFilter);
    }, [sensorTypeFilter, nameFilter, table]);

    return (
        <TableContainer component={Paper} sx={{ overflowX: "auto", p: 1 }}>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={2}>
                <TextField
                    label="Filter by Sensor Type"
                    value={sensorTypeFilter}
                    onChange={(e) => setSensorTypeFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                />
                <TextField
                    label="Filter by Name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                />
            </Stack>
            <Table>
                {/* Render Table Header */}
                <TableHead>
                    {headerGroups.map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                    onClick={header.column.getToggleSortingHandler()}
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: " 🔼",
                                        desc: " 🔽",
                                    }[header.column.getIsSorted() as string] ?? null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>

                {/* Render Table Body */}
                <TableBody>
                    {rows.length > 0 ? (
                        rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={headerGroups[0].headers.length} align="center" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                                No records found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={2}>
                <Button
                    variant="outlined"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage() || rows.length === 0}
                >
                    {"<<"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage() || rows.length === 0}
                >
                    {"<"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage() || rows.length === 0}
                >
                    {">"}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage() || rows.length === 0}
                >
                    {">>"}
                </Button>
                <Typography
                    variant="body1"
                    component="span"
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                    Page <strong>{table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}</strong>
                </Typography>
                <Typography
                    variant="body1"
                    component="span"
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                    | Go to page:
                    <TextField
                        type="number"
                        inputProps={{ min: 1, max: table.getPageCount() }}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            table.setPageIndex(page);
                        }}
                        variant="outlined"
                        size="small"
                        style={{ width: "64px" }}
                        disabled={rows.length === 0}
                    />
                </Typography>
                <FormControl variant="outlined" size="small">
                    <InputLabel>Rows per page</InputLabel>
                    <Select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        label="Rows per page"
                        disabled={rows.length === 0}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <MenuItem key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </TableContainer>
    );
};

export default ReactTable;
