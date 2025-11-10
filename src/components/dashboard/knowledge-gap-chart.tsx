
"use client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

type KnowledgeGapChartProps = {
  data: {
    topic: string;
    score: number;
    fullMark: number;
  }[];
}

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function KnowledgeGapChart({ data }: KnowledgeGapChartProps) {
   if (!data || data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      <p>Not enough data to display topics.</p>
    </div>
  );
  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="topic" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'hsl(var(--chart-2) / 0.1)' }} content={<ChartTooltipContent />} />
            <Radar name="Score" dataKey="score" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
