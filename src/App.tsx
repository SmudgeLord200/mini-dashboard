import { useEffect, useState } from 'react'
import './App.css'
import { SampleData } from './type'
import ReactTable from './section/ReactTable'
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, useReactTable } from '@tanstack/react-table'
import { columns } from './section/Columns'
import { Container, Stack, CircularProgress, Tab, Tabs, Box } from '@mui/material'
import LineCharts from './section/LineCharts'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [data, setData] = useState<SampleData[]>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  })
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Fetch and parse data from sensor_readings.json
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const response = await fetch('../data/sensor_readings.json')
      const text = await response.text()
      const lines = text.split('\n').filter(line => line.trim() !== '')
      const parsedData = lines.map(line => JSON.parse(line))
      console.log(parsedData)
      setData(parsedData)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Render the table
  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  return (
    <Container maxWidth="xl">
      <Stack direction="column" spacing={4}>
        <Tabs
          value={value}
          onChange={handleChange}
        >
          <Tab label="Table" />
          <Tab label="Chart" />
        </Tabs>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <CustomTabPanel value={value} index={0}>
              <ReactTable table={table} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <LineCharts data={data} />
            </CustomTabPanel>
          </>
        )}
      </Stack>
    </Container>
  )
}

export default App
