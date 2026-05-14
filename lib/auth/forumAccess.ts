import type { CurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Tables } from "@/types";

type ForumChannelAccessTarget = Pick<
  Tables<"forum_channels">,
  "id" | "is_locked" | "min_post_level_id" | "min_view_level_id"
>;

interface ForumChannelAccess {
  canView: boolean;
  canPost: boolean;
}

export async function getForumChannelAccess(
  channel: ForumChannelAccessTarget,
  context: CurrentUserContext,
): Promise<ForumChannelAccess> {
  if (context.isSysadmin) {
    return {
      canView: true,
      canPost: !!context.user && !channel.is_locked,
    };
  }

  const levelIds = [...new Set([channel.min_view_level_id, channel.min_post_level_id].filter(Boolean))] as string[];
  const requiredOrders = new Map<string, number>();

  if (levelIds.length) {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("access_levels")
      .select("id, hierarchy_order")
      .in("id", levelIds);

    for (const level of data ?? []) {
      requiredOrders.set(level.id, level.hierarchy_order);
    }
  }

  const currentOrder = context.accessLevel?.hierarchy_order ?? null;
  const minViewOrder = channel.min_view_level_id ? requiredOrders.get(channel.min_view_level_id) ?? null : null;
  const minPostOrder = channel.min_post_level_id ? requiredOrders.get(channel.min_post_level_id) ?? null : null;

  const canView =
    minViewOrder === null || (currentOrder !== null && currentOrder >= minViewOrder);
  const canPost =
    !!context.user &&
    !channel.is_locked &&
    (minPostOrder === null || (currentOrder !== null && currentOrder >= minPostOrder));

  return { canView, canPost };
}
