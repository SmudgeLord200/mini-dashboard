import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import App from './App'; 
import { useFetchData } from './hooks/useFetchData';
import { CustomThemeProvider, useThemeContext } from './context/ThemeProvider';
import { SampleData } from './type';

// --- Mocks ---
// Mock the useFetchData hook
vi.mock('./hooks/useFetchData');
const mockUseFetchData = useFetchData as Mock;

// Mock ResizeObserver needed by recharts (used within Dashboard)
global.ResizeObserver = vi.fn().mockImplementation(() => ({ observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }));

// Mock the Theme Context
vi.mock('./context/ThemeProvider', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('./context/ThemeProvider');
    return {
        ...actual, // Keep original exports like CustomThemeProvider
        useThemeContext: vi.fn(), 
    };
});
const mockUseThemeContext = useThemeContext as Mock;

const renderWithTheme = (component: React.ReactElement) => render(<CustomThemeProvider>{component}</CustomThemeProvider>);

// Mock data
const mockData: SampleData[] = [
    {
        id: `1`,
        box_id: `ABCjkfdds`,
        sensor_type:'TEMP',
        unit: '°C',
        name: `COP`,
        range_l: 0,
        range_u: 100,
        longitude: 0,
        latitude: 0,
        reading: Math.random() * 100,
        reading_ts: new Date().toISOString(),
    },
    {
        id: `2`,
        box_id: `54htrhr`,
        sensor_type: 'O3',
        unit: 'ppb',
        name: `BAT`,
        range_l: 0,
        range_u: 100,
        longitude: 0,
        latitude: 0,
        reading: Math.random() * 100,
        reading_ts: new Date().toISOString(),
    }
];

// --- Test Suite ---

describe('App Component', () => {
    // Create a mock function for toggleColorMode
    const mockToggleColorMode = vi.fn();

    // Default mock for theme context
    const defaultThemeContextValue = { mode: 'light', toggleColorMode: mockToggleColorMode };

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Default mock implementations
        mockUseFetchData.mockReturnValue({
            data: [],
            loading: true,
            error: null,
            reloadData: vi.fn(),
        });

        // Reset and provide default implementation for theme context mock
        mockUseThemeContext.mockReturnValue(defaultThemeContextValue);
    });

    it('should render loading state initially', () => {
        renderWithTheme(<App />); 
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        // Tabs should be visible, but their content should not
        expect(screen.getByRole('tab', { name: 'Chart' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Table' })).toBeInTheDocument();
        expect(screen.queryByText(/Total Readings/i)).not.toBeInTheDocument(); // Check for content from Dashboard
        expect(screen.queryByRole('table')).not.toBeInTheDocument(); // Check for content from ReactTable
    });

    it('should render error state', () => {
        const errorMessage = 'Failed to fetch';
        mockUseFetchData.mockReturnValue({
            data: [],
            loading: false,
            error: new Error(errorMessage),
            reloadData: vi.fn(),
        });

        renderWithTheme(<App />); 
        expect(screen.getByText(`Error loading dashboard data: ${errorMessage}`)).toBeInTheDocument();
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByText('Chart')).not.toBeInTheDocument(); // Tabs shouldn't be visible on error
    });

    it('should render loaded state with default tab (Chart) active', () => {
        mockUseFetchData.mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
            reloadData: vi.fn(),
        });

        renderWithTheme(<App />); 
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Chart' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Table' })).toBeInTheDocument();
        // Check for Dashboard content (e.g., a stat card)
        expect(screen.getByText(/Total Readings/i)).toBeInTheDocument();
        expect(screen.getAllByText('2')).toHaveLength(2); // Check for unique boxes
        expect(screen.queryByRole('table')).not.toBeInTheDocument(); // Table should not be visible initially
        expect(screen.getByRole('tab', { name: 'Chart', selected: true })).toBeInTheDocument();
    });

    it('should switch tabs and render correct content', async () => {
        mockUseFetchData.mockReturnValue({
            data: mockData,
            loading: false,
            error: null,
            reloadData: vi.fn(),
        });
        const user = userEvent.setup();
        renderWithTheme(<App />); 

        // Initially Chart is visible
        expect(screen.getByText(/Sensor Readings Over Time/i)).toBeInTheDocument(); // Check for Chart content
        expect(screen.queryByRole('table')).not.toBeInTheDocument();

        // Click Table tab
        const tableTab = screen.getByRole('tab', { name: 'Table' });
        await act(async () => {
            await user.click(tableTab);
        });

        // Now Table should be visible
        expect(screen.queryByText(/Sensor Readings Over Time/i)).not.toBeInTheDocument(); // Chart content should be hidden
        expect(screen.getByRole('table')).toBeInTheDocument(); // Check for the actual table element
        // Check for some table content (e.g., a header or a cell value)
        expect(screen.getByRole('columnheader', { name: 'Sensor Type' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Table', selected: true })).toBeInTheDocument();
    });

    it('should call toggleColorMode when theme button is clicked', async () => {
        mockUseFetchData.mockReturnValue({ data: mockData, loading: false, error: null, reloadData: vi.fn() });
        const user = userEvent.setup();

        // Ensure the mock context hook returns our spy function
        mockUseThemeContext.mockReturnValue({ mode: 'light', toggleColorMode: mockToggleColorMode });

        renderWithTheme(<App />); 

        const themeToggleButton = screen.getByRole('button', { name: /toggle color mode/i });
        await user.click(themeToggleButton);
        expect(mockToggleColorMode).toHaveBeenCalledTimes(1); // Assert that the function was called
    });
});