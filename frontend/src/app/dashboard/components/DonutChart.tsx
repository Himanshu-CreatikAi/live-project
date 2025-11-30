import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Interested", value: 25 },
  { name: "Not Interested", value: 75 },
  { name: "", value: 40 },
  { name: "Happy", value: 55 },
];

const COLORS = ["#F87171", "#0EA5E9", "#10B981", "#FBBF24"];

const DonutChart = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white  shadow-md">
      <h2 className="text-base sm:text-lg font-bold  text-blue-600 text-center">
        Status Type
      </h2>

      <ResponsiveContainer
        width="100%"
        height={220}
        className="sm:h-[260px] md:h-[300px]"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={3}
            stroke="white"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{ fontSize: "0.8rem", borderRadius: "8px" }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              marginTop: "10px",
              fontSize: "0.75rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
