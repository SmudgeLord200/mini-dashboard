import { useState } from 'react'
import './App.css'
import ReactTable from './components/Table'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { columns } from './components/Columns'
import { Container, CircularProgress, Tab, Tabs, Box, Typography, styled, Stack, Tooltip, Button } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'; 
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import Dashboard from './components/Charts'
import { useFetchData } from './hooks/useFetchData'
import { CustomThemeProvider, useThemeContext } from './context/ThemeProvider' 

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// --- Styled Components ---
const AppContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: theme.spacing(2), 
  paddingBottom: theme.spacing(2),
}));

const CenteredStatusBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
});

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: '100%', p: 3 }}>{children}</Box>}
    </div>
  )
}

// --- Inner App Component (Consumes Context) ---
function AppContent() {
  // API Hooks
  const { data, loading, error } = useFetchData();
  // Use the theme context
  const { mode, toggleColorMode } = useThemeContext();

  // State
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [value, setValue] = useState<number>(0); // Default tab

  // Render the table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  };

  // error handling
  if (error) {
    return (
      <CenteredStatusBox>
        <Typography variant="h6" color="error">Error loading dashboard data: {error.message}</Typography>
      </CenteredStatusBox>
    );
  }

  return (
    <AppContainer maxWidth="lg">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mb: 2 }} // Ensure full width and add visual separation
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ borderBottom: 'none' }}
        >
          <Tab label="Chart" />
          <Tab label="Table" />
        </Tabs>

        <Tooltip title="Toggle Color Mode" placement="top" arrow>
          <Button onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </Button>
        </Tooltip>
      </Stack>
      {
        loading ? (
          <CenteredStatusBox>
            <CircularProgress />
          </CenteredStatusBox>
        ) : (
          <>
            <CustomTabPanel value={value} index={0}>
              <Dashboard />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <ReactTable table={table} />
            </CustomTabPanel>
          </>
        )
      }
    </AppContainer >
  )
}

// --- Main App Component (Provides Context) ---
function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App
