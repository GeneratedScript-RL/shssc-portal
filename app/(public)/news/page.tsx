import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import RichTextRenderer, { extractTextFromRichContent } from "@/components/shared/RichTextRenderer";
import { formatDate } from "@/lib/utils/formatDate";
import { getPublishedPosts } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="container py-10">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Newsroom</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Council stories laid out like a forum board.</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {rest.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="forum-card">
                <Badge variant="outline">{post.post_type}</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-brand-green">{post.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {extractTextFromRichContent(post.body).slice(0, 180)}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(post.published_at ?? post.created_at, "PPP")}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <aside className="panel sticky top-28 h-fit">
          {featured ? (
            <>
              <Badge>{featured.post_type}</Badge>
              <h2 className="mt-4 text-3xl font-semibold text-brand-green">{featured.title}</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {formatDate(featured.published_at ?? featured.created_at, "PPP")}
              </p>
              <RichTextRenderer className="mt-6" content={featured.body as never} />
              <Link href={`/news/${featured.slug}`} className="mt-6 inline-flex text-sm font-semibold text-brand-green">
                Open full article
              </Link>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No published posts yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
