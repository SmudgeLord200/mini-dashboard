# Frontend Programming Exercise

Some environmental sensors have been deployed on the field.
There are various types of sensors (CO, Temperature, O3, SO2, Humidity, …).
Sensors are housed in boxes, and a box contains one sensor of each kind.
Boxes have been placed at various locations.
The sensor data has been collected in a JSON file with the following schema:

```json
{
  "id": "Box-A1-O3", // UUID for this sensor reading
  "box_id": "Box-A1", // UUID of the box
  "sensor_type": "O3", // type of the sensor
  "name": "Ozone", // type of data read by sensor
  "range_l": 0, // measuring range lower bound
  "range_u": 1000, // measuring range upper bound
  "longitude": -0.06507, // location of the box (lon)
  "latitude": 51.51885, // location of the box (lat)
  "reading": 817, // actual value being read
  "unit": "ppm", // measurement unit
  "reading_ts": "2019-09-10T00:00:00" // when the reading was taken
}
```

The file can be found in the data/ directory

#### Basic Task

Write a frontend application which

1.  reads the records from the sensor_readings.json
2.  displays them in a tabular component (nothing too ugly)
3.  allows the user to sort data by time and sensor type

You can use any frameworks/libraries that you feel most comfortable with. 
We work with [Angular 18](https://angular.dev/) so that would our preference but we do have React experience as well and are happy to learn about other frameworks too.

#### Extra Tasks (two maximum)

- allow user to enter new sensor data.
- allows the user to filter data by sensor type/name.
- plot a graph of sensor readings over time.
- allow user to see sensor location on a map(use any lib google maps, openStreetMaps, openLayers, etc).
- aggregate the data from all readings for the same sensor type, and compute the median of all its values. e.g

| Box         | Sensor Type | Median | Unit |
| ----------- | ----------- | ------ | ---- |
| Box-A1-O3   | O3          | 321    | ppm  |
| Box-A1-TEMP | TEMP        |        |      |

#### Submission

Please include with your submission:

- An explanation of any design decisions you've made (e.g. choice of libs, why you left parts out?, how you could improve this further, etc).
- A brief guide on how to run the project.
