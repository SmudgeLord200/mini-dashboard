import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react'; // Added 'within'
import Dashboard from './index'; // Import the Dashboard component
import { useFetchData } from '@/hooks/useFetchData';
import { SampleData } from '@/type';
import { CustomThemeProvider } from '@/context/ThemeProvider';

// --- Mocks ---
// Mock the useFetchData hook
vi.mock('@/hooks/useFetchData');
const mockUseFetchData = useFetchData as Mock;


// Mock ResizeObserver used by recharts/ResponsiveContainer
global.ResizeObserver = vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }));

const renderWithTheme = (component: React.ReactElement) => render(<CustomThemeProvider>{component}</CustomThemeProvider>);

// --- Mock Data ---
const mockData: SampleData[] = [
    {
        id: `1`,
        box_id: `BOX_A`,
        sensor_type: 'TEMP',
        unit: '°C',
        name: `Sensor 1`,
        range_l: 0,
        range_u: 100,
        longitude: 10,
        latitude: 20,
        reading: 25.5,
        reading_ts: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    {
        id: `2`,
        box_id: `BOX_B`,
        sensor_type: 'HUMIDITY',
        unit: '%',
        name: `Sensor 2`,
        range_l: 0,
        range_u: 100,
        longitude: 11,
        latitude: 21,
        reading: 60.0,
        reading_ts: new Date('2023-10-26T10:05:00Z').toISOString(),
    },
    {
        id: `3`,
        box_id: `BOX_A`, // Same box_id as first item
        sensor_type: 'TEMP',
        unit: '°C',
        name: `Sensor 3`,
        range_l: 0,
        range_u: 100,
        longitude: 10,
        latitude: 20,
        reading: 26.5, // Different reading
        reading_ts: new Date('2023-10-26T10:10:00Z').toISOString(),
    },
];

// --- Test Suite ---
describe('Dashboard Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Default mock implementation (loading state)
        mockUseFetchData.mockReturnValue({
            data: [],
            loading: true,
            error: null,
        });
    });

    it('should render loading state initially', () => {
        renderWithTheme(<Dashboard />); // Changed to renderWithTheme
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText(/Total Readings/i)).not.toBeInTheDocument(); // Stat cards shouldn't be there
        expect(screen.queryByLabelText('Time Period Line Charts')).not.toBeInTheDocument();
    });

    it('should render error state', () => {
        const errorMessage = 'Network Error';
        mockUseFetchData.mockReturnValue({
            data: [],
            loading: false,
            error: new Error(errorMessage),
        });

        renderWithTheme(<Dashboard />); // Changed to renderWithTheme
        expect(screen.getByText(`Error loading dashboard data: ${errorMessage}`)).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(); // Loading indicator shouldn't be there
        expect(screen.queryByLabelText('Time Period Line Charts')).not.toBeInTheDocument();
    });

    it('should render loaded state with stats and charts', () => {
        mockUseFetchData.mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
        });

        renderWithTheme(<Dashboard />); // Use theme provider for child components

        // Check for stats
        expect(screen.getByText(/Total Readings/i)).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Total Readings value
        expect(screen.getByText(/Unique Boxes/i)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Unique Boxes value
        expect(screen.getByText(/Avg\. Reading/i)).toBeInTheDocument();
        expect(screen.getByText('37.33')).toBeInTheDocument(); // Avg Reading value (25.5 + 60 + 26.5) / 3
        expect(screen.getByText(/Min Reading/i)).toBeInTheDocument();
        expect(screen.getByText('25.50')).toBeInTheDocument(); // Min Reading value
        expect(screen.getByText(/Max Reading/i)).toBeInTheDocument();
        expect(screen.getByText('60.00')).toBeInTheDocument(); // Max Reading value

        // Check for actual chart components rendering something
        // We look for titles or container elements rendered by the children
        expect(screen.getByText(/Sensor Readings Over Time/i)).toBeInTheDocument(); // Title from TimePeriodLineChart
        expect(screen.getByText(/Sensor Type Distribution \(All Time\)/i)).toBeInTheDocument(); // Title from SensorDistributionPieChart
        expect(screen.getByText(/Average Sensor Readings/i)).toBeInTheDocument(); // Title from SensorReadingRadialBarChart

        // Check for the presence of chart components by their aria-labels or roles
        expect(screen.getByLabelText('Time Period Line Charts')).toBeInTheDocument(); 
        expect(screen.getByLabelText('Sensor Distribution Pie Chart')).toBeInTheDocument(); 
        expect(screen.getByLabelText('Sensor Reading Radial Bar Chart')).toBeInTheDocument(); 

        // Ensure loading/error are not present
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByText(/Error loading dashboard data/i)).not.toBeInTheDocument();
    });

    it('should render correctly with empty data', () => {
        mockUseFetchData.mockReturnValue({
            data: [],
            loading: false,
            error: null,
        });

        renderWithTheme(<Dashboard />); // Use theme provider

        // Check stats show 0 or N/A
        expect(screen.getAllByText('0')).toHaveLength(2); // Total Readings and Unique Boxes
        expect(screen.getAllByText('N/A')).toHaveLength(3); // Avg, Min, Max

        // Check that chart components render their empty/no data states correctly
        // Time period line chart
        expect(screen.getByText(/Sensor Readings Over Time/i)).toBeInTheDocument();
        expect(screen.getByLabelText("No data")).toBeInTheDocument();

        // Sensor distribution pie chart
        expect(screen.getByText(/Sensor Type Distribution \(All Time\)/i)).toBeInTheDocument();
        expect(screen.getByText(/No sensor distribution data available./i)).toBeInTheDocument(); // Empty state from Pie Chart

        // Sensor reading radial bar chart
        expect(screen.getByText(/Average Sensor Readings/i)).toBeInTheDocument(); // Radial chart title still renders
        expect(screen.getByText(/No sensor reading data available./i)).toBeInTheDocument(); // Empty state from Radial Bar Chart
    });
});