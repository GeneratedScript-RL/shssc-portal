import Image from "next/image";
import type { Tables } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AwardEmblemProps {
  award: Pick<Tables<"awards">, "name" | "emblem_url">;
}

export default function AwardEmblem({ award }: AwardEmblemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-green/10 bg-brand-yellow/10">
            {award.emblem_url ? (
              <Image
                src={award.emblem_url}
                alt={`${award.name} emblem`}
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              />
            ) : (
              <span className="text-[10px] font-bold text-brand-green">A</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>{award.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
