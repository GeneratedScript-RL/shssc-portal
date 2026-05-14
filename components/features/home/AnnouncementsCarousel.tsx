import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";
import { extractTextFromRichContent } from "@/components/shared/RichTextRenderer";
import type { PostRecord } from "@/types";

interface AnnouncementsCarouselProps {
  posts: PostRecord[];
}

export default function AnnouncementsCarousel({ posts }: AnnouncementsCarouselProps) {
  if (!posts.length) {
    return (
      <div className="panel-hero">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-orange">
          Announcements
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-brand-green">Council broadcast board</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Published announcements will appear here automatically once the council posts them.
        </p>
      </div>
    );
  }

  return (
    <section className="panel-hero overflow-hidden">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
            Announcements
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-brand-green">Council broadcast board</h2>
        </div>
        <Badge variant="secondary">Auto-updating</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="forum-card animate-panel-glow"
            style={{ animationDelay: `${index * 0.25}s` }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
              {formatDate(post.published_at ?? post.created_at, "MMM d")}
            </p>
            <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-brand-green">{post.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
              {extractTextFromRichContent(post.body).slice(0, 120)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
