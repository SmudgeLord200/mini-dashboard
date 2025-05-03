import { faker } from '@faker-js/faker';

interface SampleData {
    id: string;
    box_id: string;
    sensor_type: string;
    unit: string;
    name: string;
    range_l: number;
    range_u: number;
    longitude: number;
    latitude: number;
    reading: number;
    reading_ts: string;
}

export const generateRandomSampleData = (count: number): SampleData[] => {
    const sensorTypes = ['O3', 'NO2', 'CO', 'TEMP'];
    const units = ['ppm', 'ppm', 'ppm', '°C'];
    const names = ['Ozone', 'Nitrogen Dioxide', 'Carbon Monoxide', 'Temperature'];
    const data: SampleData[] = [];

    for (let i = 0; i < count; i++) {
        const sensorTypeIndex = faker.number.int({ min: 0, max: sensorTypes.length - 1 });
        const sensorType = sensorTypes[sensorTypeIndex];

        data.push({
            id: faker.string.uuid(),
            box_id: `Box-${faker.string.alphanumeric(3)}`,
            sensor_type: sensorType,
            unit: units[sensorTypeIndex],
            name: names[sensorTypeIndex],
            range_l: faker.number.float({ min: 0, max: 10 }),
            range_u: faker.number.float({ min: 100, max: 1000 }),
            longitude: faker.location.longitude(),
            latitude: faker.location.latitude(),
            reading: faker.number.float({ min: 0, max: 500 }),
            reading_ts: faker.date.recent().toISOString(),
        });
    }
    return data;
};
