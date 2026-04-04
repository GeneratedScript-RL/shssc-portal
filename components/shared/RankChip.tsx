import type { Tables } from "@/types";

interface RankChipProps {
  rank: Pick<Tables<"ranks">, "name" | "color_hex">;
}

export default function RankChip({ rank }: RankChipProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white"
      style={{ backgroundColor: rank.color_hex }}
    >
      {rank.name}
    </span>
  );
}
