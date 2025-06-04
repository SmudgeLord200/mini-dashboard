import AnimateWrapper from "@/components/AnimateWrapper";
import { StatisticRowValue } from "@/StyledComponents";
import { Statistics } from "@/type";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2'

interface StatisticsRowProps {
    stats: Statistics
}

const StatisticsRow = ({ stats }: StatisticsRowProps) => {
    return (
        <AnimateWrapper>
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
                                <StatisticRowValue>{stats.totalReadings.toLocaleString()}</StatisticRowValue>
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
                                <StatisticRowValue>{stats.uniqueBoxes.toLocaleString()}</StatisticRowValue>
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
                                <StatisticRowValue>{stats.avgReading ?? 'N/A'}</StatisticRowValue>
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
                                <StatisticRowValue>{stats.minReading ?? 'N/A'}</StatisticRowValue>
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
                                <StatisticRowValue>{stats.maxReading ?? 'N/A'}</StatisticRowValue>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </AnimateWrapper>
    )
}

export default StatisticsRow;