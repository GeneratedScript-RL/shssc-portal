"use client";

import { useRef } from "react";
import type { JSONContent } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { ImagePlus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/lib/supabase/client";

interface RichTextEditorProps {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something meaningful...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "min-h-[220px] rounded-b-[1.25rem] px-4 py-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  async function handleUpload(file: File) {
    const supabase = createBrowserClient();
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { data, error } = await supabase.storage.from("rich-text").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return;
    }

    const { data: publicUrl } = supabase.storage.from("rich-text").getPublicUrl(data.path);
    editor?.chain().focus().setImage({ src: publicUrl.publicUrl, alt: file.name }).run();
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-brand-green/12 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-brand-green/10 bg-brand-green/[0.03] p-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Toggle bold formatting"
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic formatting"
        >
          Italic
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
        >
          List
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const href = window.prompt("Enter a link URL");
            if (href) {
              editor?.chain().focus().setLink({ href }).run();
            }
          }}
          aria-label="Insert link"
        >
          <Link2 className="mr-2 h-4 w-4" />
          Link
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload image"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleUpload(file);
            }
          }}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
