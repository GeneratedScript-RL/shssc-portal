import Image from "next/image";
import type { JSONContent } from "@tiptap/react";
import type { Json } from "@/types";
import { cn } from "@/lib/utils/cn";

interface RichTextRendererProps {
  content: JSONContent | Record<string, unknown> | Json | null;
  className?: string;
}

function renderMarks(text: string, marks?: JSONContent["marks"]) {
  return (marks ?? []).reduce<React.ReactNode>((acc, mark, index) => {
    switch (mark.type) {
      case "bold":
        return <strong key={`${mark.type}-${index}`}>{acc}</strong>;
      case "italic":
        return <em key={`${mark.type}-${index}`}>{acc}</em>;
      case "link":
        return (
          <a
            key={`${mark.type}-${index}`}
            href={(mark.attrs as { href?: string })?.href ?? "#"}
            className="text-brand-green underline"
            target="_blank"
            rel="noreferrer"
          >
            {acc}
          </a>
        );
      default:
        return acc;
    }
  }, text);
}

function renderNode(node: JSONContent, key: string): React.ReactNode {
  const children = node.content?.map((child, index) => renderNode(child, `${key}-${index}`)) ?? null;

  switch (node.type) {
    case "heading":
      return (
        <h3 key={key} className="mt-6 text-2xl font-semibold text-brand-green">
          {children}
        </h3>
      );
    case "paragraph":
      return (
        <p key={key} className="leading-7 text-foreground/90">
          {children}
        </p>
      );
    case "bulletList":
      return (
        <ul key={key} className="ml-5 list-disc space-y-2">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="ml-5 list-decimal space-y-2">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="rounded-2xl border-l-4 border-brand-yellow bg-brand-yellow/10 px-4 py-3 italic text-brand-green"
        >
          {children}
        </blockquote>
      );
    case "image":
      return (
        <Image
          key={key}
          src={(node.attrs as { src?: string })?.src ?? ""}
          alt={(node.attrs as { alt?: string })?.alt ?? "Embedded content image"}
          width={1200}
          height={675}
          className="h-auto rounded-2xl"
        />
      );
    case "text":
      return <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>;
    default:
      return children;
  }
}

export function extractTextFromRichContent(
  content: JSONContent | Record<string, unknown> | Json | null,
) {
  if (!content || typeof content !== "object") {
    return "";
  }

  const walk = (node: JSONContent): string => {
    const text = node.text ?? "";
    return `${text} ${(node.content ?? []).map(walk).join(" ")}`.trim();
  };

  return walk(content as JSONContent).replace(/\s+/g, " ").trim();
}

export default function RichTextRenderer({ content, className }: RichTextRendererProps) {
  if (!content || typeof content !== "object") {
    return <p className="text-sm text-muted-foreground">No content available.</p>;
  }

  const document = content as JSONContent;

  return (
    <div className={cn("prose prose-neutral max-w-none space-y-4", className)}>
      {(document.content ?? []).map((node, index) => renderNode(node, `node-${index}`))}
    </div>
  );
}
