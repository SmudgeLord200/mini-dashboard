import { useState, useEffect, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import { Box, Container, Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { SampleData } from '@/type';

// --- Styled Components ---
const ChartContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(1), // Reduced top padding slightly
    paddingBottom: theme.spacing(2),
}));

const ChartPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.customChart.background, // Use chart background
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.customChart.text, // Use chart text color
}));

const SensorDistributionPieChart = ({ data }: { data: SampleData[] }) => {
    const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
    const theme = useTheme();

    const generateChartData = useCallback(() => {
        const sensorCounts: { [sensorType: string]: number } = {};
        data.forEach(item => {
            if (item?.sensor_type) {
                sensorCounts[item.sensor_type] = (sensorCounts[item.sensor_type] || 0) + 1;
            }
        });

        const pieData = Object.entries(sensorCounts).map(([sensorType, count]) => ({
            name: sensorType,
            value: count,
        }));
        return pieData;
    }, [data]);

    // Update chart data when the input data changes
    useEffect(() => {
        if (data && data.length > 0) {
            setChartData(generateChartData());
        } else {
            setChartData([]);
        }
    }, [data, generateChartData]);

    // Define colors for the pie chart slices
    const COLORS = useMemo(() => [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.success.main,
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    ], [theme]);

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
                        Count: <strong>{payload.value}</strong>
                    </Typography>
                </Box>
            )
        }
        return null;
    }

    return (
        <ChartContainer maxWidth="lg" aria-label="Sensor Distribution Pie Chart">
            <ChartTitle variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Sensor Type Distribution (All Time)
            </ChartTitle>

            {chartData.length > 0 ? (
                <ChartPaper>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill={theme.palette.primary.main} // Default fill, overridden by Cell
                                dataKey="value"
                                label={({
                                    cx,
                                    cy,
                                    midAngle,
                                    innerRadius,
                                    outerRadius,
                                    value,
                                    index,
                                }: any) => {
                                    const RADIAN = Math.PI / 180;
                                    // Adjust label radius for better positioning if needed
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 30; // Position labels further out
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill={theme.palette.text.primary} // Use theme text color
                                            textAnchor={x > cx ? 'start' : 'end'}
                                            dominantBaseline="central"
                                            fontSize="13px" // Slightly smaller font for labels
                                            fontWeight="bold" // Make label bold
                                        >
                                            {`${chartData[index].name} (${value})`}
                                        </text>
                                    );
                                }}
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={renderTooltipContent}
                                labelStyle={{ color: theme.palette.text.primary, fontWeight: 'bold' }} // Make label bold
                                itemStyle={{ color: theme.palette.text.secondary }} // Use secondary text color for items
                            />
                            <Legend
                                wrapperStyle={{ color: theme.palette.text.primary, paddingTop: '20px' }} // Add padding top to legend
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartPaper>
            ) : (
                <Typography variant="body2" align="center" sx={{ mt: 4, color: theme.palette.text.secondary }}>
                    No sensor distribution data available.
                </Typography>
            )}
        </ChartContainer>
    );
};

export default SensorDistributionPieChart;
