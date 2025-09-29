"use client";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";
import { type ChartTypeSpendingsOverTime } from "~/types/statisticsCharts";

const SpendingsOverTimeChart = ({
  data,
}: {
  data: ChartTypeSpendingsOverTime;
}) => {
  return (
    <>
      <LineChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 15, right: 30, left: 20, bottom: 35 }}
      >
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="name" />
        <YAxis dataKey="dy" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="dy" stroke="#8884d8" />
      </LineChart>
    </>
  );
};

export default SpendingsOverTimeChart;
