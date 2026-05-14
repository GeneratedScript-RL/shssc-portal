"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectorProps {
  years: string[];
  currentYear: string;
}

export default function YearSelector({ years, currentYear }: YearSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="max-w-xs">
      <Select
        value={currentYear}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("year", value);
          router.push(`/legacy?${params.toString()}`);
        }}
      >
        <SelectTrigger aria-label="Select school year">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
