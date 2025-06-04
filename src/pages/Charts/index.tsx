import { useMemo } from 'react'
import { useFetchData } from "@/hooks/useFetchData"
import { Box, CircularProgress, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2'
import TimePeriodLineChart from "./TimePeriodLineChart"
import SensorDistributionPieChart from "./SensorDistributionPieChart"
import SensorReadingRadialBarChart from "./SensorReadingRadialBarChart"
import StatisticsRow from './StatisticsRow'
import { calculateStats } from '@/utilities'
import { Item } from '@/StyledComponents'

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
            <StatisticsRow stats={stats} />

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