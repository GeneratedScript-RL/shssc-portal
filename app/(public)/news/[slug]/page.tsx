import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import RichTextRenderer, { extractTextFromRichContent } from "@/components/shared/RichTextRenderer";
import { formatDate } from "@/lib/utils/formatDate";
import { getPostBySlug, getPublishedPosts } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [post, posts] = await Promise.all([getPostBySlug(params.slug), getPublishedPosts()]);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Forum-style feed</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Browse the latest SHSSC posts</h1>
          </div>
          <div className="grid gap-4">
            {posts.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className={`forum-card ${item.slug === post.slug ? "border-brand-yellow bg-brand-yellow/10" : ""}`}
              >
                <h2 className="text-xl font-semibold text-brand-green">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {extractTextFromRichContent(item.body).slice(0, 160)}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <aside className="panel sticky top-28 h-fit">
          <Badge>{post.post_type}</Badge>
          <h2 className="mt-4 text-4xl font-semibold text-brand-green">{post.title}</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {formatDate(post.published_at ?? post.created_at, "PPP p")}
          </p>
          <RichTextRenderer className="mt-6" content={post.body as never} />
        </aside>
      </div>
    </div>
  );
}
