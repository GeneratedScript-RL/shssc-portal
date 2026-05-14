"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const postSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(4),
  post_type: z.enum(["news", "memorandum", "announcement", "resolution", "minutes"]),
  status: z.enum(["draft", "published", "archived"]),
  body: z.custom<JSONContent>(),
});

export default function AdminPostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
    void fetch(`/api/posts?id=${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        const post = data.post;
        if (post) {
          form.reset({
            title: post.title,
            slug: post.slug,
            post_type: post.post_type,
            status: post.status,
            body: post.body,
          });
        }
      });
  }, [form, params.id]);

  async function onSubmit(values: z.infer<typeof postSchema>) {
    setMessage(null);
    const response = await fetch("/api/posts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id, ...values }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.error ?? "Unable to save this post right now.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) {
      return;
    }

    setDeleting(true);
    setMessage(null);

    const response = await fetch(`/api/posts?id=${params.id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(data?.error ?? "Unable to delete this post right now.");
      setDeleting(false);
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Edit Post</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Update post content and publish status.</h1>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="panel space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="post-title-edit">Title</Label>
            <Input id="post-title-edit" {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-slug-edit">Slug</Label>
            <Input id="post-slug-edit" {...form.register("slug")} />
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
        {message ? <p className="text-sm text-destructive">{message}</p> : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={deleting}>
            Save post
          </Button>
          <Button type="button" variant="destructive" disabled={deleting} onClick={() => void handleDelete()}>
            {deleting ? "Deleting..." : "Delete post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
