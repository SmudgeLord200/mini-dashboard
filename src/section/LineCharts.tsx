import { SampleData } from "@/type"
import { useEffect } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface LineChartsProps {
    data: SampleData[];
}

const LineCharts = ({ data }: LineChartsProps) => {
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    return (
        <ResponsiveContainer width="99%" height={400}>
            <LineChart data={data}>
                <XAxis dataKey="reading_ts" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reading" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineCharts