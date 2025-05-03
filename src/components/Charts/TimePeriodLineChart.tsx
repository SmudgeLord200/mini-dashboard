import { useState, useEffect, useCallback, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { CircularProgress, Container, FormControl as MuiFormControl, InputLabel, MenuItem, Stack, styled, Checkbox, ListItemText, Box } from '@mui/material' // Renamed FormControl to avoid conflict
import { Typography, IconButton, Tooltip as MuiTooltip } from '@mui/material' // Added IconButton and Tooltip
import { useTheme } from '@mui/material/styles'
import { Chip } from '@mui/material'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'; // Import clear filter icon
import { Box as MuiBox } from '@mui/material' // Renamed Box
import { SampleData } from '@/type'

type MultiLineChartData = {
    time: string // HH:MM format (representing time of day)
    [sensorType: string]: number | string | null
}

// --- Styled Components ---

const ChartContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));

const FilterStack = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center'
}));

const FilterFormControl = styled(MuiFormControl)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper, // Use paper background for inputs
    minWidth: 200,
    '& .MuiInputBase-root': { // Target input base for text color if needed
        color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root': { // Target label
        color: theme.palette.text.secondary,
    },
}));

const ChipBox = styled(MuiBox)({ // Simple Box for Chip layout
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
});

const EmptyStateTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

const LoadingStack = styled(Stack)(({ theme }) => ({
    marginTop: theme.spacing(4),
    alignItems: 'center',
    spacing: 1,
    color: theme.palette.text.secondary, // Apply secondary text color to the stack
}));

// --- Component ---

const TimePeriodLineChart = ({ data }: { data: SampleData[] }) => {
    const [selectedSensors, setSelectedSensors] = useState<string[]>([])
    const [selectedDates, setSelectedDates] = useState<string[]>([])
    const [chartData, setChartData] = useState<MultiLineChartData[]>([])
    const theme = useTheme()

    // --- Data fetching and processing logic ---
    const availableDates = useMemo(() => {
        if (!data) return []
        const uniqueDates = new Set<string>()
        data.forEach(item => {
            if (item?.reading_ts && typeof item.reading_ts === 'string') {
                const date = item.reading_ts.split('T')[0]
                uniqueDates.add(date)
            }
        })
        // Sort dates, potentially newest first if desired, or oldest first
        return Array.from(uniqueDates).sort()
    }, [data])

    const availableSensors = useMemo(() => {
        if (!data) return []
        const uniqueSensors = new Set<string>()
        data.forEach(item => {
            if (item?.sensor_type) {
                uniqueSensors.add(item.sensor_type)
            }
        })
        return Array.from(uniqueSensors).sort()
    }, [data])

    // Determine which sensors to actually display on the chart
    const sensorsToDisplay = useMemo(() => {
        return selectedSensors.length > 0 ? selectedSensors : availableSensors
    }, [selectedSensors, availableSensors])

    // --- CHANGE 4: Update generateChartData to accept string[] for dateFilter ---
    const generateChartData = useCallback((sensorsForChart: string[], dateFilters: string[]): MultiLineChartData[] => {
        if (sensorsForChart.length === 0 || !data) {
            return []
        }

        let filteredData = data

        // Apply date filters ONLY if specific dates are selected
        if (dateFilters.length > 0) {
            filteredData = filteredData.filter(item =>
                item?.reading_ts && dateFilters.includes(item.reading_ts.split('T')[0])
            )
        }
        // If dateFilters is empty, we process all data

        // Filter by the specific sensors we want to display lines for
        filteredData = filteredData.filter(item => item?.sensor_type && sensorsForChart.includes(item.sensor_type))

        // --- Aggregation logic ---
        const aggregatedData: {
            [time: string]: {
                [sensorType: string]: { total: number; count: number }
            }
        } = {}

        filteredData.forEach(item => {
            try {
                const readingDate = new Date(item.reading_ts)
                if (isNaN(readingDate.getTime())) {
                    return // Skip invalid dates
                }
                const hourKey = readingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                const sensorType = item.sensor_type

                if (!aggregatedData[hourKey]) aggregatedData[hourKey] = {}
                if (!aggregatedData[hourKey][sensorType]) aggregatedData[hourKey][sensorType] = { total: 0, count: 0 }

                const readingValue = typeof item.reading === 'number' ? item.reading : parseFloat(item.reading)
                if (!isNaN(readingValue)) {
                    aggregatedData[hourKey][sensorType].total += readingValue
                    aggregatedData[hourKey][sensorType].count += 1
                } else {
                    console.warn(`Invalid reading value encountered for ${sensorType} at ${item.reading_ts}: ${item.reading}`)
                }
            } catch (error) {
                console.error(`Error processing item timestamp: ${item.reading_ts}`, error)
            }
        })

        // Sort by time of day (HH:MM)
        const sortedTimeKeys = Object.keys(aggregatedData).sort((a, b) => {
            try {
                return new Date(`1970-01-01T${a}:00Z`).getTime() - new Date(`1970-01-01T${b}:00Z`).getTime()
            } catch (e) { return 0 }
        })

        // --- Transformation logic ---
        const finalChartData = sortedTimeKeys.map(timeKey => {
            const timeEntry: MultiLineChartData = { time: timeKey }
            sensorsForChart.forEach(sensorType => {
                const sensorData = aggregatedData[timeKey]?.[sensorType]
                timeEntry[sensorType] = (sensorData && sensorData.count > 0)
                    ? sensorData.total / sensorData.count
                    : null
            })
            return timeEntry
        }) 

        return finalChartData
    }, [data])

    // Recalculate chart data when filters change
    useEffect(() => {
        const newChartData = generateChartData(sensorsToDisplay, selectedDates)
        setChartData(newChartData)
    }, [sensorsToDisplay, selectedDates, generateChartData])

    const handleSensorChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value
        setSelectedSensors(typeof value === 'string' ? value.split(',') : value)
    }

    const handleDateChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value
        // On autofill we get a stringified value.
        setSelectedDates(typeof value === 'string' ? value.split(',') : value)
    }

    const clearFilters = () => {
        setSelectedSensors([])
        setSelectedDates([])
    }

    // Define a color palette for the lines
    const lineColors = useMemo(() => [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.success.main,
        '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2', '#FF8C00',
    ], [theme])

    const renderTooltipContent = (entry: any) => {
        // Check if entry, payload, and the first item exist
        if (entry && entry.payload && entry.payload.length > 0) {
            const pointData = entry.payload[0]; // Data for the specific line/point hovered
            const time = pointData.payload.time; // Get the time from the shared payload object
            const sensorType = pointData.name; // Get the name of the sensor line
            const readingValue = pointData.value; // Get the value for this specific sensor at this time

            // Only render if we have a valid reading value
            if (readingValue !== null && readingValue !== undefined) {
                return (
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        borderRadius: theme.shape.borderRadius,
                        padding: theme.spacing(2),
                        color: theme.palette.text.primary,
                    }}
                >
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Time: <strong>{time}</strong>
                    </Typography>
                    <Typography variant="body1">
                        {sensorType}: <strong>{typeof readingValue === 'number' ? readingValue.toFixed(2) : readingValue}</strong>
                    </Typography>
                </Box>
            );
            }


        }

        return null;
    }

    return (
        <ChartContainer maxWidth="lg" aria-label="Time Period Line Charts">
            <Typography variant="h6">
                Sensor Readings Over Time
            </Typography>

            <FilterStack direction="row" spacing={2} alignItems="center">
                <FilterFormControl>
                    <InputLabel id="date-multi-select-label">Dates</InputLabel>
                    <Select
                        labelId="date-multi-select-label"
                        multiple
                        value={selectedDates}
                        onChange={handleDateChange}
                        renderValue={(selected) => (
                            <ChipBox>
                                {selected.length > 0
                                    ? selected.map((value) => <Chip key={value} label={value} size="small" />)
                                    : ""
                                }
                            </ChipBox>
                        )}
                        displayEmpty
                    >
                        {availableDates.map(date => (
                            <MenuItem key={date} value={date}>
                                <Checkbox checked={selectedDates.indexOf(date) > -1} />
                                <ListItemText primary={date} />
                            </MenuItem>
                        ))}
                    </Select>
                </FilterFormControl>

                <FilterFormControl>
                    <InputLabel id="sensor-filter-label">Sensor Type</InputLabel>
                    <Select
                        labelId="sensor-filter-label"
                        multiple
                        value={selectedSensors}
                        onChange={handleSensorChange}
                        renderValue={(selected) => (
                            <ChipBox>
                                {selected.length > 0
                                    ? selected.map((value) => <Chip key={value} label={value} size="small" />)
                                    : ""
                                }
                            </ChipBox>
                        )}
                        displayEmpty
                    >
                        {availableSensors.map(sensor => (
                            <MenuItem key={sensor} value={sensor}>
                                <Checkbox checked={selectedSensors.indexOf(sensor) > -1} />
                                <ListItemText primary={sensor} />
                            </MenuItem>
                        ))}
                    </Select>
                </FilterFormControl>

                <MuiTooltip title="Clear All Filters" placement="top" arrow>
                    {/* Wrap IconButton in span to prevent Tooltip issues when disabled */}
                    <span>
                        <IconButton onClick={clearFilters} disabled={selectedSensors.length === 0 && selectedDates.length === 0} color="inherit">
                            <FilterAltOffIcon />
                        </IconButton>
                    </span>
                </MuiTooltip>
            </FilterStack>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.customChart.gridLines} />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        interval={'preserveStartEnd'}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        label={{ value: 'Time of Day', position: 'insideBottom', fill: theme.palette.text.secondary }}
                    />
                    <YAxis
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        label={{ value: 'Avg. Reading', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }}
                    />
                    <Tooltip
                        labelStyle={{ color: theme.palette.text.primary, marginBottom: '5px', fontWeight: 'bold' }}
                        itemStyle={{ color: theme.palette.text.secondary }}
                        content={renderTooltipContent}
                    />
                    <Legend wrapperStyle={{ color: theme.palette.text.primary, paddingTop: '10px' }} />

                    {sensorsToDisplay.map((sensorType, index) => (
                        <Line
                            key={sensorType}
                            type="monotone"
                            dataKey={sensorType}
                            name={sensorType}
                            stroke={lineColors[index % lineColors.length]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 1, fill: lineColors[index % lineColors.length] }}
                            connectNulls={true}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {sensorsToDisplay.length > 0 && chartData.length === 0 && (
                <EmptyStateTypography variant="body2" align="center">
                    No data available for the current filter settings {selectedDates.length > 0 ? `on selected dates` : '(all dates)'}.
                </EmptyStateTypography>
            )}
            {availableSensors.length === 0 && data && data.length > 0 && (
                <EmptyStateTypography variant="body2" align="center">
                    No sensor types found in the data source.
                </EmptyStateTypography>
            )}
            {(!data || data.length === 0) && (
                <LoadingStack>
                    <Typography variant="body2" align="center" aria-label="No data">
                        Loading data or no data available...
                    </Typography>
                    <CircularProgress />
                </LoadingStack>
            )}
        </ChartContainer>
    )
}

export default TimePeriodLineChart
