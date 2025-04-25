// components/SurveyPie.tsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PieDataItem {
  name: string;
  value: number;
}

interface SurveyPieProps {
  data: PieDataItem[];
  width?: number | string;
  height?: number | string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SurveyPie: React.FC<SurveyPieProps> = ({
  data,
  width = '100%',
  height = 300,
}) => (
  <ResponsiveContainer width={width} height={height}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        label={({ name, percent }) =>
          `${name}: ${(percent! * 100).toFixed(0)}%`
        }
      >
        {data.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string) => [`${value}`, name]}
      />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
);

export default SurveyPie;
