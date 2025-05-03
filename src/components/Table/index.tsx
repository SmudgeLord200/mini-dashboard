import { useState, useEffect, useMemo } from "react";
import { SampleData } from "@/type";
import { Table as TanstackTable } from "@tanstack/react-table";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
    InputLabel,
    FormControl,
    IconButton,
    Tooltip,
    styled,
    Container,
} from "@mui/material";
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'; // Import clear filter icon
import TableRowComponent from "./TableRowComponent";
import TableHeaderComponent from "./TableHeaderComponent";
import TablePaginationComponent from "./TablePaginationComponent";

type ReactTableProps = {
    table: TanstackTable<SampleData>;
};
// Helper to format date part from timestamp
const formatDate = (timestamp: string): string => {
    try {
        return new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (e) {
        return "Invalid Date"; // Handle potential errors
    }
};

// --- Styled Components ---
const FilterBar = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    gap: theme.spacing(1), // Reduced gap slightly
    alignItems: 'center', // Align items vertically
    justifyContent: 'center',
    flexWrap: 'wrap',
}));

const FilterControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(0.5), // Use margin for spacing
    minWidth: 180, // Adjust width as needed
    maxWidth: 250,
}));

const NoRecordsCell = styled(TableCell)(({ theme }) => ({
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    textAlign: 'center',
}));

const ReactTable = ({ table }: ReactTableProps) => {
    // State for multi-select filters
    const [sensorTypeFilter, setSensorTypeFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<string[]>([]);

    const rows = table.getRowModel().rows; // Get rows from Tanstack Table
    const headerGroups = table.getHeaderGroups(); // Get header groups from Tanstack Table

    // Derive unique values for filters
    const { uniqueSensorTypes, uniqueDates } = useMemo(() => {
        const types = new Set<string>();
        const dates = new Set<string>();
        // Use pre-filtered rows to get all possible values
        table.getPreFilteredRowModel().rows.forEach(row => {
            types.add(row.original.sensor_type);
            dates.add(formatDate(row.original.reading_ts)); // Assuming 'timestamp' field exists
        });
        return {
            uniqueSensorTypes: Array.from(types).sort(),
            uniqueDates: Array.from(dates).sort().reverse(), // Sort dates descending
        };
    }, [table.getPreFilteredRowModel().rows]); // Recalculate if rows change

    useEffect(() => {
        // NOTE: Ensure column definitions use filter functions supporting arrays (e.g., 'arrIncludesSome')
        table.getColumn("sensor_type")?.setFilterValue(sensorTypeFilter.length > 0 ? sensorTypeFilter : undefined);
        table.getColumn("reading_ts")?.setFilterValue(dateFilter.length > 0 ? dateFilter : undefined); // Filter on 'reading_ts' column
    }, [sensorTypeFilter, dateFilter, table]);

    const clearFilters = () => {
        setSensorTypeFilter([]);
        setDateFilter([]);
    };

    const filtersApplied = sensorTypeFilter.length > 0 || dateFilter.length > 0;

    return (
        <Container maxWidth="lg" sx={{
            padding: 0, margin: 0, mx: 'auto', // Center horizontally (margin left/right auto)
            overflowX: 'auto', // Keep horizontal scroll for table content
            boxSizing: 'border-box'
        }}>
            <TableContainer component={Paper}>
                <FilterBar>
                    {/* Sensor Type MultiSelect */}
                    <FilterControl size="small">
                        <InputLabel id="sensor-type-multi-select-label">Sensor Type</InputLabel>
                        <Select
                            labelId="sensor-type-multi-select-label"
                            id="sensor-type-multi-select"
                            aria-label="Sensor Type Select"
                            multiple
                            value={sensorTypeFilter}
                            onChange={(e) => setSensorTypeFilter(e.target.value as string[])}
                            input={<OutlinedInput label="Sensor Type" />}
                            renderValue={(selected) => selected.length > 1 ? `${selected.length} types` : selected.join(', ')}
                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }} // Limit dropdown height
                        >
                            {uniqueSensorTypes.map((type) => (
                                <MenuItem key={type} value={type} aria-label={type}>
                                    <Checkbox checked={sensorTypeFilter.indexOf(type) > -1} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FilterControl>

                    {/* Date MultiSelect */}
                    <FilterControl size="small">
                        <InputLabel id="date-multi-select-label">Date</InputLabel>
                        <Select
                            labelId="date-multi-select-label"
                            id="date-multi-select"
                            multiple
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as string[])}
                            input={<OutlinedInput label="Date" />}
                            renderValue={(selected) => selected.length > 1 ? `${selected.length} dates` : selected.join(', ')}
                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }} // Limit dropdown height
                        >
                            {uniqueDates.map((date) => (
                                <MenuItem key={date} value={date}>
                                    <Checkbox checked={dateFilter.indexOf(date) > -1} />
                                    <ListItemText primary={date} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FilterControl>

                    {/* Clear Filters Button */}
                    <Tooltip title="Clear All Filters" placement="top" arrow>
                        <span>
                            <IconButton onClick={clearFilters} disabled={!filtersApplied} color="inherit" size="small" aria-label="clear filters">
                                <FilterAltOffIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </FilterBar>

                <Table size="small" sx={{ width: '100%' }} aria-label="Data Table">
                    <TableHeaderComponent headerGroups={headerGroups} />
                    <TableBody>
                        {rows.length > 0 ? (
                            <TableRowComponent rows={rows} />
                        ) : (
                            <TableRow>
                                <NoRecordsCell colSpan={headerGroups[0].headers.length}>
                                    No records found {filtersApplied ? 'matching your filters' : ''}
                                </NoRecordsCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePaginationComponent
                    table={table}
                    rows={rows}
                />
            </TableContainer>
        </Container>
    );
};

export default ReactTable;