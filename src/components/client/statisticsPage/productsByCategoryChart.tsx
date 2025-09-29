"use client";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { type ChartTypeProductsByCategory } from "~/types/statisticsCharts";

const ProductsByCategoryChart = ({
  data,
}: {
  data: ChartTypeProductsByCategory;
}) => {
  console.log(data);
  return (
    <>
      <div className="text-md text-center font-semibold my-2">
        Top Spending Categories
      </div>
      <div className="mb-4 h-120 w-full lg:mx-12 lg:mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-90}
              textAnchor="end"
              height={80}
            />
            <YAxis dataKey="dy" />
            <Tooltip />
            <Bar
              dataKey="dy"
              fill="#2a2d70"
              activeBar={<Rectangle fill="#fabc60" stroke="#2a2d70" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ProductsByCategoryChart;
