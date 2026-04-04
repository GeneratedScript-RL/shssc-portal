"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PollResultsChartProps {
  results: Array<{
    label: string;
    votes: number;
  }>;
}

export default function PollResultsChart({ results }: PollResultsChartProps) {
  return (
    <div className="h-[360px] w-full rounded-[1.5rem] border border-brand-green/10 bg-white p-4 shadow-panel">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={results} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="label" type="category" width={140} />
          <Tooltip />
          <Bar dataKey="votes" radius={[0, 16, 16, 0]} fill="#2D7D32" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
