import { SampleData } from "@/type";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table"; 
import dayjs from "dayjs";
import { Typography, Tooltip } from "@mui/material"; 

// Helper to format date part from timestamp (can be shared or redefined here)
const formatDate = (timestamp: string): string => {
    try {
        // Ensure consistent formatting, handle potential null/undefined
        if (!timestamp) return "";
        return new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (e) {
        console.error("Error formatting date:", timestamp, e);
        return ""; // Return empty string on error
    }
};

// Custom filter function for dates
const dateArrIncludesSome: FilterFn<SampleData> = (row: Row<SampleData>, columnId: string, filterValue: string[]): boolean => {
    if (!filterValue || filterValue.length === 0) return true; // No filter applied

    const rowValue = row.getValue(columnId);
    const rowDate = formatDate(String(rowValue)); // Extract date part from row's timestamp
    return filterValue.includes(rowDate); // Check if the row's date is in the selected dates
};

export const columns: ColumnDef<SampleData>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: "ID",
        enableHiding: false,
        cell: (props) => {
            const id = props.row.original.id;
            return (
                <Typography variant="body2">{id}</Typography>
            );
        }
    },
    {
        id: 'box_id',
        accessorKey: 'box_id',
        header: "Box ID",
        enableHiding: true,
        cell: (props) => {
            const boxId = props.row.original.box_id;
            return (
                <Typography variant="body2">{boxId}</Typography>
            );
        }
    },
    {
        id: 'sensor_type',
        accessorKey: 'sensor_type',
        header: "Sensor Type",
        enableHiding: false,
        filterFn: 'arrIncludesSome', // Add built-in filter for array inclusion
        enableSorting: true,
        sortingFn: (a, b) => {
            const sensorTypeA = a.original.sensor_type;
            const sensorTypeB = b.original.sensor_type;
            return sensorTypeA.localeCompare(sensorTypeB);
        },
        cell: (props) => {
            const sensorType = props.row.original.sensor_type;
            return (
                <Typography variant="body2">{sensorType}</Typography>
            );
        }
    },
    {
        id: 'unit',
        accessorKey: 'unit',
        header: "Unit",
        enableHiding: true, // Keep hidden by default, as it's shown with readings/ranges
        cell: (props) => {
            const unit = props.row.original.unit;
            return (
                <Typography variant="body2">{unit}</Typography>
            );
        }
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: "Name",
        enableHiding: false,
        enableColumnFilter: false, // Disable filtering for name if not used
        enableSorting: true,
        sortingFn: (a, b) => {
            const nameA = a.original.name;
            const nameB = b.original.name;
            return nameA.localeCompare(nameB);
        },
        cell: (props) => {
            const name = props.row.original.name;
            return (
                <Typography variant="body2">{name}</Typography>
            );
        }
    },
    {
        id: 'range_l',
        accessorKey: 'range_l',
        header: "Range L",
        size: 200,
        enableHiding: true,
        cell: (props) => {
            const rangeL = props.getValue() as number;
            const unit = props.row.original.unit;
            return (
                <Tooltip title="Sensor Measurement Lower Range Bound" placement="top" arrow>
                    {/* Display value and unit */}
                    <Typography variant="body2">{`${rangeL} ${unit}`}</Typography>
                </Tooltip>
            );
        }
    },
    {
        id: 'range_u',
        accessorKey: 'range_u',
        header: "Range U",
        size: 200,
        enableHiding: true,
        cell: (props) => {
            const rangeU = props.getValue() as number;
            const unit = props.row.original.unit;
            return (
                <Tooltip title="Sensor Measurement Upper Range Bound" placement="top" arrow>
                    {/* Display value and unit */}
                    <Typography variant="body2">{`${rangeU} ${unit}`}</Typography>
                </Tooltip>
            );
        }
    },
    {
        id: 'longitude',
        accessorKey: 'longitude',
        header: "Longitude",
        enableHiding: true,
        cell: (props) => {
            const longitude = props.getValue() as number;
            return (
                <Tooltip title="Box Location Longitude" placement="top" arrow>
                    {/* Add degree symbol */}
                    <Typography variant="body2">{`${longitude}°`}</Typography>
                </Tooltip>
            );
        }
    },
    {
        id: 'latitude',
        accessorKey: 'latitude',
        header: "Latitude",
        enableHiding: true,
        cell: (props) => {
            const latitude = props.getValue() as number;
            return (
                <Tooltip title="Box Location Latitude" placement="top" arrow>
                    {/* Add degree symbol */}
                    <Typography variant="body2">{`${latitude}°`}</Typography>
                </Tooltip>
            );
        }
    },
    {
        id: 'reading',
        accessorKey: 'reading',
        header: "Reading",
        enableHiding: true, 
        cell: (props) => {
            const reading = props.getValue() as number;
            const unit = props.row.original.unit;
            return (
                // Display value and unit
                <Typography variant="body2">{`${reading} ${unit}`}</Typography>
            );
        }
    },
    {
        id: 'reading_ts',
        accessorKey: 'reading_ts',
        header: "Reading TS",
        enableHiding: true,
        filterFn: dateArrIncludesSome, // Add custom filter for date array inclusion
        enableSorting: true,
        sortingFn: (a, b) => {
            const readingTsA = a.original.reading_ts;
            const readingTsB = b.original.reading_ts;
            return readingTsA.localeCompare(readingTsB);
        },
        cell: (props) => {
            const readingTs = props.row.original.reading_ts;
            return (
                // Keep the detailed format
                <Typography variant="body2">{dayjs(readingTs).format("DD/MM/YYYY HH:mm:ss")}</Typography>
            );
        }
    },
];