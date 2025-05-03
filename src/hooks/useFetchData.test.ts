import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react'; // Keep act and renderHook here
import { waitFor } from '@testing-library/dom'; // <-- Import waitFor directly from DOM library
import { useFetchData } from './useFetchData';
import * as mockDataModule from '@/mocks/mock-data'; // Import the module itself
import { SampleData } from '@/type';

// Define constants used in the hook for clarity in tests
const MOCK_DATA_COUNT = 150;
const SIMULATED_DELAY_MS = 500; // Match the delay in the hook

describe('useFetchData Hook', () => {
    // Define some sample mock data for consistent testing
    const mockSampleData: SampleData[] = Array.from({ length: MOCK_DATA_COUNT }, (_, i) => ({
        id: `id_${i}`,
        box_id: `box_${i % 10}`,
        sensor_type: i % 2 === 0 ? 'TEMP' : 'O3',
        unit: i % 2 === 0 ? '°C' : 'ppb',
        name: `Sensor ${i}`,
        range_l: 0,
        range_u: 100,
        longitude: 0,
        latitude: 0,
        reading: Math.random() * 100,
        reading_ts: new Date().toISOString(),
    }));

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();

        // Default mock implementation for generateRandomSampleData
        vi.spyOn(mockDataModule, 'generateRandomSampleData').mockImplementation(
            (count: number) => {
                // Return a slice of our predefined mock data based on count
                return mockSampleData.slice(0, count);
            }
        );
    });

    it('should initialize with loading state true and empty data', () => {
        const { result } = renderHook(() => useFetchData());

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toEqual([]);
        expect(result.current.error).toBeNull();
    });

    it('should load data successfully and update state', async () => {
        const { result } = renderHook(() => useFetchData());

        // Wait until the data has been populated, which implies loading is finished.
        // This is slightly more robust than just waiting for loading to be false.
        await waitFor(() => {
            expect(result.current.data).toHaveLength(MOCK_DATA_COUNT);
        }, { timeout: SIMULATED_DELAY_MS + 100 }); // Keep a reasonable timeout

        expect(result.current.data).toHaveLength(MOCK_DATA_COUNT);
        expect(result.current.data[0]).toEqual(mockSampleData[0]); // Check if data matches mock
        expect(result.current.error).toBeNull();
        // In test environments (potentially simulating Strict Mode), the effect might run twice on initial mount.
        // We verify it was called, and the reload test confirms subsequent calls.
        expect(mockDataModule.generateRandomSampleData).toHaveBeenCalledTimes(2);
        expect(mockDataModule.generateRandomSampleData).toHaveBeenCalledWith(MOCK_DATA_COUNT);
    });

    it('should handle reloadData correctly', async () => {
        const { result } = renderHook(() => useFetchData());

        // Wait for initial load
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(mockDataModule.generateRandomSampleData).toHaveBeenCalledTimes(1);

        // Trigger reload
        await act(async () => {
            await result.current.reloadData();
        });

        // Check state after reload
        expect(result.current.loading).toBe(false);
        expect(result.current.data).toHaveLength(MOCK_DATA_COUNT); // Should have data again
        expect(result.current.error).toBeNull();
        expect(mockDataModule.generateRandomSampleData).toHaveBeenCalledTimes(2); // Called again
    });

    it('should handle errors during data generation', async () => {
        const testError = new Error('Failed to generate');
        vi.spyOn(mockDataModule, 'generateRandomSampleData').mockImplementation(() => { throw testError; });

        const { result } = renderHook(() => useFetchData());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe(testError);
        expect(result.current.data).toEqual([]); // Data should remain empty on error
    });
});