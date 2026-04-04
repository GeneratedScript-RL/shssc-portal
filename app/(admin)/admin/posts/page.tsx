"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/utils/slugify";
import type { Tables } from "@/types";

const postSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(4),
  post_type: z.enum(["news", "memorandum", "announcement", "resolution", "minutes"]),
  status: z.enum(["draft", "published", "archived"]),
  body: z.custom<JSONContent>(),
});

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Tables<"posts">[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      post_type: "news",
      status: "draft",
      body: { type: "doc", content: [{ type: "paragraph" }] },
    },
  });

  useEffect(() => {
    void fetch("/api/posts?all=1")
      .then((response) => response.json())
      .then((data) => setPosts(data.posts ?? []));
  }, []);

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setErrorMessage(null);
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => null);
    if (response.ok) {
      setPosts((current) => [data.post, ...current]);
      form.reset({
        title: "",
        slug: "",
        post_type: "news",
        status: "draft",
        body: { type: "doc", content: [{ type: "paragraph" }] },
      });
      return;
    }

    setErrorMessage(data?.error ?? "Unable to create post right now.");
  }

  async function handleDelete(postId: string, postTitle: string) {
    if (!window.confirm(`Delete "${postTitle}"?`)) {
      return;
    }

    setDeletingId(postId);
    setErrorMessage(null);

    const response = await fetch(`/api/posts?id=${postId}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (response.ok) {
      setPosts((current) => current.filter((post) => post.id !== postId));
      setDeletingId(null);
      return;
    }

    setErrorMessage(data?.error ?? "Unable to delete this post right now.");
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Posts</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Publish announcements, news, memorandums, and minutes.</h1>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="panel space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              {...form.register("title")}
              onChange={(event) => {
                form.register("title").onChange(event);
                form.setValue("slug", slugify(event.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-slug">Slug</Label>
            <Input id="post-slug" {...form.register("slug")} />
          </div>
          <div className="space-y-2">
            <Label>Post type</Label>
            <Select value={form.watch("post_type")} onValueChange={(value) => form.setValue("post_type", value as z.infer<typeof postSchema>["post_type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="memorandum">Memorandum</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="resolution">Resolution</SelectItem>
                <SelectItem value="minutes">Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as z.infer<typeof postSchema>["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <RichTextEditor value={form.watch("body")} onChange={(value) => form.setValue("body", value)} />
        <Button type="submit">Create post</Button>
      </form>
      <section className="roblox-panel grid gap-3">
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="rounded-2xl border border-brand-green/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/admin/posts/${post.id}`} className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">{post.status}</p>
                <h2 className="mt-2 text-2xl font-semibold text-brand-green">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.post_type}</p>
              </Link>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deletingId === post.id}
                onClick={() => void handleDelete(post.id, post.title)}
              >
                {deletingId === post.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
