import { useMemo } from 'react'; // Import useMemo
import { useFetchData } from "@/hooks/useFetchData"
import { Box, Card, CardContent, CircularProgress, Paper, styled, Typography } from "@mui/material" // Added Card, CardContent
import Grid from '@mui/material/Grid2' // Using Grid v2
import TimePeriodLineChart from "./TimePeriodLineChart"
import SensorDistributionPieChart from "./SensorDistributionPieChart"
import SensorReadingRadialBarChart from "./SensorReadingRadialBarChart"
import { SampleData } from '@/type';

// Use theme colors for the chart container
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.customChart?.background, // Use theme background
    color: theme.palette.customChart?.text,             // Use theme text color
    padding: theme.spacing(2), // Increased padding slightly for better spacing
    textAlign: 'center',
}))

// Helper function to calculate stats (optional, could be inline in useMemo)
const calculateStats = (data: SampleData[]) => {
    if (!data || data.length === 0) {
        return {
            totalReadings: 0,
            uniqueBoxes: 0,
            minReading: null,
            maxReading: null,
            avgReading: null,
        };
    }

    const readings = data.map(d => d.reading);
    const boxIds = new Set(data.map(d => d.box_id));

    const minReading = Math.min(...readings);
    const maxReading = Math.max(...readings);
    const avgReading = readings.reduce((sum, val) => sum + val, 0) / readings.length;

    return {
        totalReadings: data.length,
        uniqueBoxes: boxIds.size,
        minReading: minReading.toFixed(2), // Format as needed
        maxReading: maxReading.toFixed(2), // Format as needed
        avgReading: avgReading.toFixed(2), // Format as needed
    };
};

const Dashboard = () => {
    const { data, loading, error } = useFetchData()

    // Calculate stats using useMemo
    const stats = useMemo(() => calculateStats(data), [data]);

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography variant="h6" color="error">Error loading dashboard data: {error.message}</Typography>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* --- Statistics Row --- */}
            <Grid size={12}>
                <Grid container spacing={2} justifyContent="center">
                    {/* Stat Card 1: Total Readings */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Card
                            variant="outlined"
                            sx={(theme) => ({
                                bgcolor: theme.palette.stats?.totalReadings?.background ?? theme.palette.primary.light, // Use theme color or fallback
                                color: theme.palette.stats?.totalReadings?.text ?? theme.palette.primary.contrastText, // Use theme text color or fallback
                            })}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>Total Readings</Typography>
                                <Typography variant="h5">{stats.totalReadings.toLocaleString()}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Stat Card 2: Unique Boxes */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Card
                            variant="outlined"
                            sx={(theme) => ({
                                bgcolor: theme.palette.stats?.uniqueBoxes?.background ?? theme.palette.secondary.light,
                                color: theme.palette.stats?.uniqueBoxes?.text ?? theme.palette.secondary.contrastText,
                            })}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>Unique Boxes</Typography>
                                <Typography variant="h5">{stats.uniqueBoxes.toLocaleString()}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Stat Card 3: Avg Reading */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Card
                            variant="outlined"
                            sx={(theme) => ({
                                bgcolor: theme.palette.stats?.avgReading?.background ?? theme.palette.success.light,
                                color: theme.palette.stats?.avgReading?.text ?? theme.palette.success.contrastText,
                            })}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>Avg. Reading</Typography>
                                <Typography variant="h5">{stats.avgReading ?? 'N/A'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Stat Card 4: Min Reading */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Card
                            variant="outlined"
                            sx={(theme) => ({
                                bgcolor: theme.palette.stats?.minReading?.background ?? theme.palette.warning.light,
                                color: theme.palette.stats?.minReading?.text ?? theme.palette.warning.contrastText,
                            })}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>Min Reading</Typography>
                                <Typography variant="h5">{stats.minReading ?? 'N/A'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Stat Card 5: Max Reading */}
                    <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                        <Card
                            variant="outlined"
                            sx={(theme) => ({
                                bgcolor: theme.palette.stats?.maxReading?.background ?? theme.palette.info.light,
                                color: theme.palette.stats?.maxReading?.text ?? theme.palette.info.contrastText,
                            })}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>Max Reading</Typography>
                                <Typography variant="h5">{stats.maxReading ?? 'N/A'}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>

            {/* --- Existing Chart Rows --- */}
            <Grid size={12} >
                <Item>
                    <TimePeriodLineChart data={data} />
                </Item>
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Item>
                    <SensorDistributionPieChart data={data} />
                </Item>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                <Item>
                    <SensorReadingRadialBarChart data={data} />
                </Item>
            </Grid>
        </Grid>
    )
}

export default Dashboard