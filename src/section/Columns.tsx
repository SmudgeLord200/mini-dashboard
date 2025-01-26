import { SampleData } from "@/type"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<SampleData>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: "ID",
        enableHiding: false,
        cell: (props) => {
            const id = props.row.original.id
            return (
                <div>{id}</div>
            )
        }
    },
    {
        id: 'box_id',
        accessorKey: 'box_id',
        header: "Box ID",
        enableHiding: true,
        cell: (props) => {
            const boxId = props.row.original.box_id
            return (
                <div>{boxId}</div>
            )
        }
    },
    {
        id: 'sensor_type',
        accessorKey: 'sensor_type',
        header: "Sensor Type",
        enableHiding: false,
        enableSorting: true,
        sortingFn: (a, b) => {
            const sensorTypeA = a.original.sensor_type
            const sensorTypeB = b.original.sensor_type

            return sensorTypeA.localeCompare(sensorTypeB)
        },
        cell: (props) => {
            const sensorType = props.row.original.sensor_type
            return (
                <div>{sensorType}</div>
            )
        }
    },
    {
        id: 'unit',
        accessorKey: 'unit',
        header: "Unit",
        enableHiding: true,
        cell: (props) => {
            const unit = props.row.original.unit
            return (
                <div>{unit}</div>
            )
        }
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: "Name",
        enableHiding: false,
        enableSorting: true,
        sortingFn: (a, b) => {
            const nameA = a.original.name
            const nameB = b.original.name

            return nameA.localeCompare(nameB)
        },
        cell: (props) => {
            const name = props.row.original.name
            return (
                <div>{name}</div>
            )
        }
    },
    {
        id: 'range_l',
        accessorKey: 'range_l',
        header: "Range L",
        enableHiding: true,
        cell: (props) => {
            const rangeL = props.getValue() as number
            return (
                <div>{rangeL}</div>
            )
        }
    },
    {
        id: 'range_u',
        accessorKey: 'range_u',
        header: "Range U",
        enableHiding: true,
        cell: (props) => {
            const rangeU = props.getValue() as number
            return (
                <div>{rangeU}</div>
            )
        }
    },
    {
        id: 'longitude',
        accessorKey: 'longitude',
        header: "Longitude",
        enableHiding: true,
        cell: (props) => {
            const longitude = props.getValue() as number
            return (
                <div>{longitude}</div>
            )
        }
    },
    {
        id: 'latitude',
        accessorKey: 'latitude',
        header: "Latitude",
        enableHiding: true,
        cell: (props) => {
            const latitude = props.getValue() as number
            return (
                <div>{latitude}</div>
            )
        }
    },
    {
        id: 'reading',
        accessorKey: 'reading',
        header: "Reading",
        enableHiding: true,
        cell: (props) => {
            const reading = props.getValue() as number
            return (
                <div>{reading}</div>
            )
        }
    },
    {
        id: 'reading_ts',
        accessorKey: 'reading_ts',
        header: "Reading TS",
        enableHiding: true,
        enableSorting: true,
        sortingFn: (a, b) => {
            const readingTsA = a.original.reading_ts
            const readingTsB = b.original.reading_ts

            return readingTsA.localeCompare(readingTsB)
        },
        cell: (props) => {
            const readingTs = props.row.original.reading_ts
            return (
                <div>{readingTs}</div>
            )
        }
    },
]