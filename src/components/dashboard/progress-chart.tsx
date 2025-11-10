"use client";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { month: 'Jan', score: 65 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 70 },
  { month: 'Apr', score: 78 },
  { month: 'May', score: 85 },
  { month: 'Jun', score: 88 },
];

export default function ProgressChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
