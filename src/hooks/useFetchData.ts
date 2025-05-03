import { useState, useEffect, useCallback } from 'react';
import { SampleData } from '@/type'; // Assuming your type is correctly aliased or adjust the path
import { generateRandomSampleData } from '@/mocks/mock-data'; // <-- Import the generator

interface UseFetchDataReturn {
    data: SampleData[];
    loading: boolean;
    error: Error | null;
    reloadData: () => Promise<void>; // Explicitly type the reload function
}

// Define how many mock records to generate
const MOCK_DATA_COUNT = 150; 
const SIMULATED_DELAY_MS = 500; // Simulate network latency (milliseconds)

export const useFetchData = (): UseFetchDataReturn => {
    // 1. State within the hook
    const [data, setData] = useState<SampleData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // 2. The fetching logic, modified to use the mock generator
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null); 

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));

        try {
            // Generate mock data instead of fetching
            const generatedData = generateRandomSampleData(MOCK_DATA_COUNT);
            setData(generatedData);

        } catch (err) {
            // Although less likely with mock data, keep error handling
            console.error("Failed to generate mock data:", err);
            setError(err instanceof Error ? err : new Error('An error occurred during mock data generation'));
        } finally {
            setLoading(false); 
        }
    }, []); 

    // 3. Trigger the fetch on mount 
    useEffect(() => {
        loadData();
    }, [loadData]); 

    return { data, loading, error, reloadData: loadData };
};