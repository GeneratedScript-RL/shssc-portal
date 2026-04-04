import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AwardEmblem from "@/components/shared/AwardEmblem";
import RankChip from "@/components/shared/RankChip";
import { createServiceRoleClient, safeQuery } from "@/lib/supabase/server";

interface UserBadgeProps {
  userId: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { avatar: 36, text: "text-sm" },
  md: { avatar: 44, text: "text-sm" },
  lg: { avatar: 60, text: "text-base" },
};

export default async function UserBadge({ userId, size = "md" }: UserBadgeProps) {
  const result = await safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const [{ data: user }, { data: rankRows }, { data: awardRows }] = await Promise.all([
      supabase.from("users").select("id, full_name, avatar_url").eq("id", userId).maybeSingle(),
      supabase
        .from("user_ranks")
        .select("ranks(name, color_hex, hierarchy_order)")
        .eq("user_id", userId),
      supabase
        .from("user_awards")
        .select("awards(name, emblem_url)")
        .eq("user_id", userId)
        .limit(3),
    ]);

    return {
      user,
      ranks:
        rankRows
          ?.map((entry) => entry.ranks)
          .filter(Boolean)
          .sort((a, b) => (b?.hierarchy_order ?? 0) - (a?.hierarchy_order ?? 0)) ?? [],
      awards: awardRows?.map((entry) => entry.awards).filter(Boolean) ?? [],
    };
  }, {
    user: null,
    ranks: [],
    awards: [],
  });

  if (!result.user) {
    return null;
  }

  const { avatar, text } = sizeMap[size];
  const initials = result.user.full_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {result.user.avatar_url ? (
        <Image
          src={result.user.avatar_url}
          alt={`${result.user.full_name} avatar`}
          width={avatar}
          height={avatar}
          className="rounded-full object-cover"
        />
      ) : (
        <Avatar className={`h-[${avatar}px] w-[${avatar}px]`}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-1">
        <div className={`font-semibold ${text}`}>{result.user.full_name}</div>
        <div className="flex flex-wrap items-center gap-2">
          {result.ranks[0] ? <RankChip rank={result.ranks[0]} /> : null}
          {result.awards.slice(0, 3).map((award) => (
            <AwardEmblem
              key={`${result.user?.id}-${award?.name}`}
              award={{ name: award?.name ?? "Award", emblem_url: award?.emblem_url ?? null }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
