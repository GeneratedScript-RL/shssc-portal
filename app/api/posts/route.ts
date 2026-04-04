import { NextResponse } from "next/server";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { slugify } from "@/lib/utils/slugify";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const postSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(4).optional(),
  post_type: z.enum(["news", "memorandum", "announcement", "resolution", "minutes"]),
  status: z.enum(["draft", "published", "archived"]),
  body: z.custom<JSONContent>(),
});

const permissionMap = {
  news: PERMISSIONS.POST_NEWS,
  memorandum: PERMISSIONS.POST_MEMORANDUM,
  announcement: PERMISSIONS.POST_ANNOUNCEMENT,
  resolution: PERMISSIONS.MANAGE_RESOLUTIONS,
  minutes: PERMISSIONS.MANAGE_MINUTES,
} as const;

const managePostPermissions = Object.values(permissionMap);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const includeAll = url.searchParams.get("all") === "1";
  const supabase = createServiceRoleClient();

  if (id || includeAll) {
    const context = await getCurrentUserContext();
    const canManagePosts =
      !!context.user &&
      (context.isSysadmin ||
        managePostPermissions.some((permission) => context.permissions.includes(permission)));

    if (!canManagePosts) {
      return jsonError("Forbidden", 403);
    }
  }

  if (id) {
    const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
    return NextResponse.json({ post });
  }

  if (includeAll) {
    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    return NextResponse.json({ posts: posts ?? [] });
  }

  const posts = await getPublishedPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const payload = postSchema.parse(await request.json());
  const { error, context } = await requireApiUser(permissionMap[payload.post_type]);
  if (error || !context) {
    return error;
  }

  const supabase = createServiceRoleClient();
  const { data: post, error: createError } = await supabase
    .from("posts")
    .insert({
      title: payload.title,
      slug: payload.slug || slugify(payload.title),
      post_type: payload.post_type,
      status: payload.status,
      body: payload.body,
      author_id: context.user.id,
      published_at: payload.status === "published" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ post }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const payload = postSchema.extend({ id: z.string().uuid() }).parse(body);
  const { error, context } = await requireApiUser(permissionMap[payload.post_type]);
  if (error || !context) {
    return error;
  }

  const supabase = createServiceRoleClient();
  const { data: post, error: updateError } = await supabase
    .from("posts")
    .update({
      title: payload.title,
      slug: payload.slug,
      post_type: payload.post_type,
      status: payload.status,
      body: payload.body,
      published_at: payload.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({ post });
}
