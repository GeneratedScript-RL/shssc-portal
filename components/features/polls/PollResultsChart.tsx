"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PollResultsChartProps {
  results: Array<{
    label: string;
    votes: number;
  }>;
}

export default function PollResultsChart({ results }: PollResultsChartProps) {
  const maxVotes = Math.max(...results.map((result) => result.votes), 1);

  return (
    <div className="w-full rounded-[1.5rem] border border-brand-green/10 bg-white p-3 shadow-panel sm:p-4">
      <div className="space-y-3 md:hidden">
        {results.map((result) => (
          <div key={result.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-brand-green">{result.label}</span>
              <span className="font-semibold text-muted-foreground">{result.votes}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-green/10">
              <div
                className="h-full rounded-full bg-brand-green"
                style={{ width: `${(result.votes / maxVotes) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden h-[320px] md:block md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={results} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="label" type="category" width={140} />
            <Tooltip />
            <Bar dataKey="votes" radius={[0, 16, 16, 0]} fill="#2D7D32" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
