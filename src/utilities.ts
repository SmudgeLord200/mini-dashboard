import { SampleData } from "./type";

// Helper function to calculate stats
export const calculateStats = (data: SampleData[]) => {
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

export const CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeInOut' } },
};