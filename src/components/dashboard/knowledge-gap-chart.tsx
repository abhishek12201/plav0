"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const data = [
  { subject: 'Algebra', score: 80, fullMark: 100 },
  { subject: 'Calculus', score: 65, fullMark: 100 },
  { subject: 'Statistics', score: 90, fullMark: 100 },
  { subject: 'Geometry', score: 75, fullMark: 100 },
  { subject: 'Trigonometry', score: 55, fullMark: 100 },
  { subject: 'Logic', score: 95, fullMark: 100 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function KnowledgeGapChart() {
  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'hsl(var(--chart-2) / 0.1)' }} content={<ChartTooltipContent />} />
            <Radar name="Score" dataKey="score" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
