export interface SampleData {
    id: string
    box_id: string
    sensor_type: string
    unit: string
    name: string
    range_l: number
    range_u: number
    longitude: number
    latitude: number
    reading: number
    reading_ts: string
}

export interface Statistics {
    totalReadings: number
    uniqueBoxes: number
    minReading: string | null
    maxReading: string | null
    avgReading: string | null
}

export type MultiLineChartData = {
    time: string // HH:MM format (representing time of day)
    [sensorType: string]: number | string | null
}