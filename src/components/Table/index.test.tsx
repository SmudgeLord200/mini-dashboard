import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    FilterFn,
    sortingFns,
} from '@tanstack/react-table';

import ReactTable from './index';
import { SampleData } from '@/type';
import { CustomThemeProvider } from '@/context/ThemeProvider'; // Import ThemeProvider

// --- Mock Data ---
const mockData: SampleData[] = [
    { id: '1', box_id: 'BOX_A', sensor_type: 'TEMP', unit: '°C', name: 'Sensor 1', range_l: 0, range_u: 100, longitude: 10, latitude: 20, reading: 25.5, reading_ts: '2023-10-26T10:00:00Z' },
    { id: '2', box_id: 'BOX_B', sensor_type: 'HUMIDITY', unit: '%', name: 'Sensor 2', range_l: 0, range_u: 100, longitude: 11, latitude: 21, reading: 60.0, reading_ts: '2023-10-27T11:05:00Z' },
    { id: '3', box_id: 'BOX_B', sensor_type: 'TEMP', unit: '°C', name: 'Sensor 3', range_l: 0, range_u: 100, longitude: 10, latitude: 20, reading: 26.5, reading_ts: '2023-10-26T10:10:00Z' },
    { id: '4', box_id: 'BOX_C', sensor_type: 'PRESSURE', unit: 'Pa', name: 'Sensor 4', range_l: 900, range_u: 1100, longitude: 12, latitude: 22, reading: 1013.1, reading_ts: '2023-10-28T12:15:00Z' },
    { id: '5', box_id: 'BOX_B', sensor_type: 'TEMP', unit: '°C', name: 'Sensor 5', range_l: -10, range_u: 50, longitude: 11, latitude: 21, reading: 15.0, reading_ts: '2023-10-27T11:20:00Z' },
];

// Helper to format date part from timestamp for filtering
const formatDate = (timestamp: string): string => {
    try {
        return new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (e) {
        return "Invalid Date";
    }
};

// --- Tanstack Table Setup ---
const columnHelper = createColumnHelper<SampleData>();

// Custom filter function for array inclusion
const arrIncludesSomeFilterFn: FilterFn<SampleData> = (row, columnId, filterValue: string[]) => {
    if (!filterValue || filterValue.length === 0) {
        return true;
    }
    const rowValue = row.getValue(columnId);
    return filterValue.includes(String(rowValue));
};

// Custom filter function for date matching (YYYY-MM-DD)
const dateFilterFn: FilterFn<SampleData> = (row, columnId, filterValue: string[]) => {
    if (!filterValue || filterValue.length === 0) {
        return true;
    }
    const rowValue = row.getValue(columnId);
    const rowDate = formatDate(String(rowValue)); // Format the date from the row
    return filterValue.includes(rowDate);
};

const columns = [
    columnHelper.accessor('box_id', { header: 'Box ID', cell: info => info.getValue() }),
    columnHelper.accessor('name', { header: 'Sensor Name', cell: info => info.getValue() }),
    columnHelper.accessor('sensor_type', {
        header: 'Sensor Type',
        cell: info => info.getValue(),
        filterFn: arrIncludesSomeFilterFn, // Use custom filter
    }),
    columnHelper.accessor('reading', { header: 'Reading', cell: info => info.getValue() }),
    columnHelper.accessor('unit', { header: 'Unit', cell: info => info.getValue() }),
    columnHelper.accessor('reading_ts', {
        header: 'Timestamp',
        cell: info => new Date(info.getValue()).toLocaleString(),
        filterFn: dateFilterFn, // Use custom date filter
        sortingFn: sortingFns.datetime, // Use datetime sorting
    }),
];

// --- Test Component Wrapper ---
const TestTableComponent = ({ data = mockData, initialPageSize = 5 }) => {
    const table = useReactTable({
        data,
        columns,
        initialState: {
            pagination: {
                pageSize: initialPageSize,
            },
        },
        filterFns: {
            arrIncludesSome: arrIncludesSomeFilterFn, // Register custom filter
            dateFilter: dateFilterFn,
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false, // Set to true for debugging
    });

    return (
        <CustomThemeProvider>
            <ReactTable table={table} />
        </CustomThemeProvider>
    );
};

// --- Test Suite ---
describe('ReactTable Component', () => {
    const user = userEvent.setup();

    it('should render the table with headers, data rows, filters, and pagination', () => {
        render(<TestTableComponent />);

        // Check headers
        expect(screen.getByRole('columnheader', { name: 'Box ID' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Sensor Name' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Sensor Type' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Reading' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Unit' })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Timestamp' })).toBeInTheDocument();

        // Check filter controls
        expect(screen.getByLabelText('Sensor Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Date')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();

        // Check data rows (check for one specific value from the mock data)
        expect(screen.getByRole('cell', { name: 'BOX_A' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Sensor 1' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'PRESSURE' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '60' })).toBeInTheDocument(); // Reading from Sensor 2

        // Check pagination
        expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();
    });

    it('should filter data based on Sensor Type selection', async () => {
        render(<TestTableComponent />);

        // Find and click the button that opens the Sensor Type dropdown
        const sensorTypeButton = screen.getByLabelText('Sensor Type');
        await user.click(sensorTypeButton);

        // Wait for the dropdown menu (listbox) to appear and select 'TEMP'
        let dropdownUl: HTMLElement | null = null;
        await waitFor(() => {
            // MUI menus often render a UL with role="listbox" or "menu" inside a Popover/Paper element.
            // Adjust the selector if needed based on screen.debug output.
            dropdownUl = document.body.querySelector('ul[role="listbox"]');
            expect(dropdownUl).toBeInTheDocument(); // Wait until the element is found
        });
        // We need to assert dropdownUl is not null for TypeScript safety
        if (!dropdownUl) throw new Error("Dropdown UL element not found using querySelector");
        await user.click(within(dropdownUl).getByRole('option', { name: 'TEMP' }));


        // Close dropdown (optional, clicking an option might close it, but clicking body ensures it)
        await user.click(document.body); // Or await user.keyboard('{Escape}');

        // Verify filtered rows (TEMP sensors: 1, 3, 5)
        // display the table
        const table = screen.getByLabelText('Data Table')

        // Verify filtered rows (Sensors 1,3 and 5 are TEMP)
        await waitFor(() => {
            expect(within(table).queryByText('Sensor 1')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 3')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 5')).toBeInTheDocument();
        });

        // Check pagination reflects filtered count (3 rows, default 5 per page)
        // Check pagination text - using getByText might be fragile if format changes.
        // A more robust way might be to check the state if possible, or use a less specific text match.
        // For now, let's assume the text format is stable:
        expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument(); // Since 3 items fit on one page of size 5
    });

    it('should filter data based on Date selection', async () => {
        render(<TestTableComponent />);

        // Open Date dropdown
        await user.click(screen.getByLabelText('Date'));

        // Select '2023-10-26'
        const listbox = await screen.findByRole('listbox', { name: /date/i });
        await user.click(within(listbox).getByRole('option', { name: '2023-10-26' }));

        // Close dropdown
        await user.click(document.body);

        // display the table
        const table = screen.getByLabelText('Data Table')

        // Verify filtered rows (Sensors 1 and 3 were on 2023-10-26)
        await waitFor(() => {
            expect(within(table).queryByText('Sensor 1')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 3')).toBeInTheDocument();
        });

        // Check pagination reflects filtered count (2 rows)
        expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument();
    });

    it('should clear filters when the clear button is clicked', async () => {
        render(<TestTableComponent />);

        // Apply a filter (e.g., Sensor Type 'HUMIDITY')
        await user.click(screen.getByLabelText('Sensor Type'));
        const sensorListbox = await screen.findByRole('listbox', { name: /sensor type/i });
        await user.click(within(sensorListbox).getByRole('option', { name: 'HUMIDITY' }));
        await user.click(document.body); // Close dropdown

        // display the table
        const table = screen.getByLabelText('Data Table')

        // Verify filter applied (only Sensor 2)
        await waitFor(() => { // Add waitFor to ensure DOM updates after filter
            expect(within(table).queryByText('Sensor 2')).toBeInTheDocument();
        });
        expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument(); // Pagination shows 1 row

        // Click clear filter button
        const clearButton = screen.getByLabelText(/clear filters/i);
        expect(clearButton).not.toBeDisabled();
        await user.click(clearButton);

        // // Verify all rows are back
        await waitFor(() => {
            expect(within(table).queryByText('Sensor 1')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 2')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 3')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 4')).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 5')).toBeInTheDocument();
        });
        expect(screen.getByText(/Page 1 of 1/i)).toBeInTheDocument(); // Pagination shows all 5 rows

        // Verify filter input is cleared (check rendered value)
        const sensorTypeInput = screen.getByLabelText('Sensor Type Select');
        // The input itself doesn't hold the value directly in MUI Select, check the rendered display value
        expect(within(sensorTypeInput).queryByText('1 types')).not.toBeInTheDocument(); // Check if the count display is gone
        expect(within(sensorTypeInput).queryByText('HUMIDITY')).not.toBeInTheDocument(); // Check if the single selection display is gone

        // // Check clear button is disabled
        expect(clearButton).toBeDisabled();
    });

    it('should display "No records found" when data is empty', () => {
        render(<TestTableComponent data={[]} />);
        expect(screen.getByText(/No records found/i)).toBeInTheDocument();
    });

    it('should display "No records found matching your filters" when filters yield no results', async () => {
        render(<TestTableComponent />);

        // Apply a filter that yields no results (e.g., a non-existent sensor type)
        await user.click(screen.getByLabelText('Sensor Type'));
        const listbox = await screen.findByRole('listbox', { name: /sensor type/i });
        // Assuming 'NON_EXISTENT' is not in uniqueSensorTypes
        // We can't directly click a non-existent option, so we'll filter for something valid, then clear and filter for another valid one that doesn't overlap
        await user.click(within(listbox).getByRole('option', { name: 'PRESSURE' })); // Select Pressure (Sensor 4)
        await user.click(document.body);

        await user.click(screen.getByLabelText('Date'));
        const dateListbox = await screen.findByRole('listbox', { name: /date/i });
        await user.click(within(dateListbox).getByRole('option', { name: '2023-10-26' })); // Select Date 2023-10-26 (Sensor 1, 3)
        await user.click(document.body);

        // Now filters are Pressure AND 2023-10-26 - no overlap
        expect(screen.getByText(/No records found matching your filters/i)).toBeInTheDocument();
        expect(screen.queryByRole('cell')).not.toBeInTheDocument(); // No data cells
    });

    // Add tests for pagination (clicking next/prev) and sorting (clicking headers) if needed
    it('should handle pagination correctly', async () => {
        render(<TestTableComponent initialPageSize={2} />); // Render with 2 rows per page
        const table = screen.getByRole('table', { name: /data table/i });

        // Initial state: Page 1 of 3 (5 items, 2 per page)
        expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
        expect(within(table).getByText('Sensor 1')).toBeInTheDocument(); // Row 1
        expect(within(table).getByText('Sensor 2')).toBeInTheDocument(); // Row 2
        expect(within(table).queryByText('Sensor 3')).not.toBeInTheDocument(); // Row 3 should not be visible

        // Go to next page
        const nextPageButton = screen.getByRole('button', { name: /next page/i });
        await user.click(nextPageButton);

        // State after clicking next: Page 2 of 3
        await waitFor(() => {
            expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
            expect(within(table).queryByText('Sensor 1')).not.toBeInTheDocument();
            expect(within(table).getByText('Sensor 3')).toBeInTheDocument(); // Row 3
            expect(within(table).getByText('Sensor 4')).toBeInTheDocument(); // Row 4
            expect(within(table).queryByText('Sensor 5')).not.toBeInTheDocument();
        });

        // Go to previous page
        const prevPageButton = screen.getByRole('button', { name: /previous page/i });
        await user.click(prevPageButton);

        // State after clicking previous: Page 1 of 3
        await waitFor(() => {
            expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
            expect(within(table).getByText('Sensor 1')).toBeInTheDocument(); // Row 1
            expect(within(table).getByText('Sensor 2')).toBeInTheDocument(); // Row 2
            expect(within(table).queryByText('Sensor 3')).not.toBeInTheDocument();
        });

        // Change rows per page
        // 1. Find the FormControl wrapper using the label
        const rowsPerPageControl = screen.getByLabelText(/rows per page/i);
        expect(within(rowsPerPageControl).queryByRole('combobox')).toBeInTheDocument()
        const combobox = within(rowsPerPageControl).getByRole('combobox');
        await user.click(combobox)

        // Now, wait for the listbox to appear and find the option
        const listbox = await screen.findByRole('listbox');
        const option10 = within(listbox).getByRole('option', { name: 'Show 10' });
        await user.click(option10);

        // State after changing rows per page: Page 1 of 1 (5 items, 10 per page)
        await waitFor(() => {
            expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
            expect(within(table).getByText('Sensor 1')).toBeInTheDocument();
            expect(within(table).getByText('Sensor 5')).toBeInTheDocument(); // Check last sensor is visible
        });
    });
});