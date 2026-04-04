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
    const [{ data: user }, { data: rankLinks }, { data: awardLinks }] = await Promise.all([
      supabase.from("users").select("id, full_name, avatar_url").eq("id", userId).maybeSingle(),
      supabase.from("user_ranks").select("rank_id").eq("user_id", userId),
      supabase.from("user_awards").select("award_id").eq("user_id", userId).limit(3),
    ]);

    const rankIds = (rankLinks ?? []).map((entry) => entry.rank_id);
    const awardIds = (awardLinks ?? []).map((entry) => entry.award_id);
    const [{ data: ranks }, { data: awards }] = await Promise.all([
      rankIds.length
        ? supabase.from("ranks").select("name, color_hex, hierarchy_order").in("id", rankIds)
        : Promise.resolve({ data: [] }),
      awardIds.length
        ? supabase.from("awards").select("name, emblem_url").in("id", awardIds)
        : Promise.resolve({ data: [] }),
    ]);

    return {
      user,
      ranks: (ranks ?? []).sort((a, b) => b.hierarchy_order - a.hierarchy_order),
      awards: awards ?? [],
    };
  }, {
    user: null,
    ranks: [],
    awards: [],
  });

  const user = result.user as
    | {
        id: string;
        full_name: string;
        avatar_url: string | null;
      }
    | null;

  if (!user) {
    return null;
  }

  const { avatar, text } = sizeMap[size];
  const initials = user.full_name
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={`${user.full_name} avatar`}
          width={avatar}
          height={avatar}
          style={{ width: avatar, height: avatar }}
          className="rounded-full object-cover"
        />
      ) : (
        <Avatar style={{ width: avatar, height: avatar }}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
      <div className="space-y-1">
        <div className={`font-semibold ${text}`}>{user.full_name}</div>
        <div className="flex flex-wrap items-center gap-2">
          {result.ranks[0] ? <RankChip rank={result.ranks[0]} /> : null}
          {result.awards.slice(0, 3).map((award: { name: string; emblem_url: string | null }) => (
            <AwardEmblem
              key={`${user.id}-${award.name}`}
              award={{ name: award.name, emblem_url: award.emblem_url }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
