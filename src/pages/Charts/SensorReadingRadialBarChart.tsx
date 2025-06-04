import { useState, useEffect, useCallback } from 'react';
import {
    RadialBarChart,
    RadialBar,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import { SampleData } from '@/type';
import { StyledPaper } from '@/StyledComponents';

const SensorReadingRadialBarChart = ({ data }: { data: SampleData[] }) => {
    const [chartData, setChartData] = useState<{ name: string; value: number; fill: string }[]>([]);
    const theme = useTheme();


    const generateChartData = useCallback((sensorData: SampleData[]) => {
        const sensorAverages: { [sensorType: string]: { total: number; count: number } } = {};

        sensorData.forEach(item => {
            const sensorType = item.sensor_type;
            if (!sensorAverages[sensorType]) {
                sensorAverages[sensorType] = { total: 0, count: 0 };
            }
            sensorAverages[sensorType].total += item.reading;
            sensorAverages[sensorType].count += 1;
        });

        const radialData = Object.entries(sensorAverages).map(([sensorType, { total, count }]) => ({
            name: sensorType,
            value: parseFloat((total / count).toFixed(2)), // Average reading, rounded
            fill:
                sensorType === 'O3'
                    ? theme.palette.primary.main
                    : sensorType === 'NO2'
                        ? theme.palette.secondary.main
                        : sensorType === 'CO'
                            ? theme.palette.error.main
                            : theme.palette.warning.main,
        }));
        return radialData;
    }, [theme.palette.error.main, theme.palette.primary.main, theme.palette.secondary.main, theme.palette.warning.main]);

    useEffect(() => {
        setChartData(generateChartData(data));
    }, [data, generateChartData]);

    const renderTooltipContent = (entry: any) => {
        if (entry && entry.payload && entry.payload.length) {
            const payload = entry.payload[0];
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
                        Sensor Type: <strong>{payload.payload.name}</strong>
                    </Typography>
                    <Typography variant="body1">
                        Avg Reading: <strong>{payload.value}</strong>
                    </Typography>
                </Box>
            );
        }

        return null;
    };
    return (
        <Container maxWidth="lg" aria-label="Sensor Reading Radial Bar Chart">
            <Typography variant="h6">
                Average Sensor Readings
            </Typography>

            <StyledPaper>
                {chartData.length > 0
                    ?
                    (
                        <ResponsiveContainer width="100%" height={400}>
                            <RadialBarChart
                                data={chartData}
                                innerRadius="20%"
                                outerRadius="80%"
                                startAngle={180}
                                endAngle={0}
                            >
                                <RadialBar
                                    dataKey="value"
                                    name="Value"
                                    label={{ fill: theme.palette.text.primary, position: 'insideStart', fontWeight: ' bold' }}
                                    background
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: theme.shape.borderRadius }}
                                    labelStyle={{ color: theme.palette.text.primary }}
                                    itemStyle={{ color: theme.palette.text.primary }}
                                    content={renderTooltipContent}
                                />
                                <Legend
                                    wrapperStyle={{ color: theme.palette.text.primary }}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    )
                    :
                    (
                        <Typography variant="body2" align="center" sx={{ mt: 4, color: theme.palette.text.secondary }}>
                            No sensor reading data available.
                        </Typography>
                    )
                }

            </StyledPaper>
        </Container>
    );
};

export default SensorReadingRadialBarChart;
