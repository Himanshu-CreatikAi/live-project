import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'UI', projects: 10, earnings: 10.6 },
  { name: 'UX', projects: 14, earnings: 14.2 },
  { name: 'Web', projects: 15, earnings: 20.5 },
  { name: 'App', projects: 16, earnings: 18.3 },
  { name: 'SEO', projects: 8, earnings: 13 },
];

const SmallGraph = () => {
  return (
    <div className=" shadow-md h-full sm:w-full   lg:w-[440px] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto  overflow-hidden">
      {/* Chart Section */}
      <div className="w-full bg-gradient-to-r from-emerald-500 to-emerald-800">
  <div className="w-full h-[250px] sm:h-[280px] md:h-[392px] lg:h-[330px] xl:h-[380px] 
                  min-w-[100px] min-h-[100px] flex items-center justify-center">
    <ResponsiveContainer width="100%" height={250}>

      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="0" stroke="#fff" opacity={0.2} vertical={false} />
        <XAxis
          dataKey="name"
          axisLine={false}
          stroke="#fff"
          tickLine={false}
          tick={{ fill: "#fff", fontSize: 12 }}
        />
        <YAxis
          type="number"
          domain={[6, 18]}
          ticks={[6, 8, 10, 12, 14, 16, 18]}
          tickCount={7}
          axisLine={false}
          tickLine={false}
          width={30}
          stroke="#fff"
          tick={{ fill: "#fff", fontSize: 12 }}
          allowDecimals={false}
          interval={0}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
          labelStyle={{ color: '#fff' }}
          formatter={(value, name) => [`${value}`, name]}
        />
        <Bar dataKey="projects" fill="#fff" barSize={16} name="Projects" />
        <Bar dataKey="earnings" fill="#fff" name="Earnings ($M)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


      {/* Info Footer */}
      <div className="bg-white p-4 ">
        <h2 className="text-sm text-neutral-600 mb-4 text-center sm:text-left">
          Total completed projects and earnings
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0 px-3 py-5">
          <div className="border-b sm:border-b-0 sm:border-r border-neutral-400 pb-2 sm:pb-0 sm:pr-6 text-center sm:text-left">
            <p className="text-xs text-gray-500">Completed Projects</p>
            <p className="text-lg font-bold">175</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-gray-500 whitespace-nowrap">Total Earnings</p>
            <p className="text-lg font-bold">$76.6M</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallGraph;
