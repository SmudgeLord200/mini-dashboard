import { calculateStats, CARD_VARIANTS } from './utilities';
import { SampleData, Statistics } from './type';
import { describe, it, expect } from 'vitest';

// Helper function to create sample data with minimal required fields for testing
const createSampleData = (id: string, box_id: string, reading: number): SampleData => ({
    id,
    box_id,
    reading,
    sensor_type: 'test_sensor',
    unit: 'test_unit',
    name: `Test Sensor ${id}`,
    range_l: 0,
    range_u: 100,
    longitude: 10.0,
    latitude: 20.0,
    reading_ts: new Date().toISOString(),
});

describe('utilities', () => {
    describe('calculateStats', () => {
        it('should return zero/null stats for empty data array', () => {
            const data: SampleData[] = [];
            const expectedStats: Statistics = {
                totalReadings: 0,
                uniqueBoxes: 0,
                minReading: null,
                maxReading: null,
                avgReading: null,
            };
            expect(calculateStats(data)).toEqual(expectedStats);
        });

        it('should correctly calculate stats for a single data point', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 25.5),
            ];
            const stats = calculateStats(data);
            expect(stats.totalReadings).toBe(1);
            expect(stats.uniqueBoxes).toBe(1);
            expect(stats.minReading).toBe('25.50');
            expect(stats.maxReading).toBe('25.50');
            expect(stats.avgReading).toBe('25.50');
        });

        it('should correctly calculate stats for multiple data points with unique box_ids', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 10),
                createSampleData('2', 'boxB', 20),
                createSampleData('3', 'boxC', 15),
            ];
            const stats = calculateStats(data);
            expect(stats.totalReadings).toBe(3);
            expect(stats.uniqueBoxes).toBe(3);
            expect(stats.minReading).toBe('10.00');
            expect(stats.maxReading).toBe('20.00');
            expect(stats.avgReading).toBe('15.00'); // (10 + 20 + 15) / 3 = 15
        });

        it('should correctly calculate stats for multiple data points with duplicate box_ids', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 5),
                createSampleData('2', 'boxB', 25),
                createSampleData('3', 'boxA', 15),
            ];
            const stats = calculateStats(data);
            expect(stats.totalReadings).toBe(3);
            expect(stats.uniqueBoxes).toBe(2); // boxA, boxB
            expect(stats.minReading).toBe('5.00');
            expect(stats.maxReading).toBe('25.00');
            expect(stats.avgReading).toBe('15.00'); // (5 + 25 + 15) / 3 = 15
        });

        it('should format readings to two decimal places, including rounding', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 10.123), // min
                createSampleData('2', 'boxB', 20.456), // avg: (10.123 + 20.456 + 30.789) / 3 = 61.368 / 3 = 20.456 -> "20.46"
                createSampleData('3', 'boxC', 30.789), // max
            ];
            const stats = calculateStats(data);
            expect(stats.totalReadings).toBe(3);
            expect(stats.uniqueBoxes).toBe(3);
            expect(stats.minReading).toBe('10.12');
            expect(stats.maxReading).toBe('30.79');
            expect(stats.avgReading).toBe('20.46');
        });

        it('should handle readings that result in exact .x0 averages', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 10),
                createSampleData('2', 'boxB', 20),
            ];
            const stats = calculateStats(data);
            expect(stats.avgReading).toBe('15.00');
        });

        it('should handle readings that result in .x5 averages correctly with toFixed', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', 10.55),
                createSampleData('2', 'boxB', 10.55),
            ];
            const stats = calculateStats(data); // avg is 10.55
            expect(stats.avgReading).toBe('10.55');
        });

        it('should handle zero and negative readings', () => {
            const data: SampleData[] = [
                createSampleData('1', 'boxA', -5.789),
                createSampleData('2', 'boxB', 0),
                createSampleData('3', 'boxC', 5.123),
            ];
            // sum = -5.789 + 0 + 5.123 = -0.666
            // avg = -0.666 / 3 = -0.222
            const stats = calculateStats(data);
            expect(stats.totalReadings).toBe(3);
            expect(stats.uniqueBoxes).toBe(3);
            expect(stats.minReading).toBe('-5.79');
            expect(stats.maxReading).toBe('5.12');
            expect(stats.avgReading).toBe('-0.22');
        });
    });

    describe('CARD_VARIANTS', () => {
        it('should be defined', () => {
            expect(CARD_VARIANTS).toBeDefined();
        });

        it('should have a "hidden" property with correct values', () => {
            expect(CARD_VARIANTS.hidden).toBeDefined();
            expect(CARD_VARIANTS.hidden.opacity).toBe(0);
            expect(CARD_VARIANTS.hidden.scale).toBe(0.95);
        });

        it('should have a "visible" property with correct values and transition', () => {
            expect(CARD_VARIANTS.visible).toBeDefined();
            expect(CARD_VARIANTS.visible.opacity).toBe(1);
            expect(CARD_VARIANTS.visible.scale).toBe(1);
            expect(CARD_VARIANTS.visible.transition).toBeDefined();
            expect(CARD_VARIANTS.visible.transition?.duration).toBe(0.4);
            expect(CARD_VARIANTS.visible.transition?.ease).toBe('easeInOut');
        });
    });
});