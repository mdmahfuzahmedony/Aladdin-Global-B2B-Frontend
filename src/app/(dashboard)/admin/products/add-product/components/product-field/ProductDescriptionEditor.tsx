"use client";


import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Unlink,
} from "lucide-react";

type ProductDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProductDescriptionEditor({
  value,
  onChange,
}: ProductDescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        },
      }),

      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],

    content: value || "",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex h-32 items-center justify-center text-xs text-slate-400">
          Loading editor...
        </div>
      </div>
    );
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt(
      "Enter URL",
      previousUrl || "https://",
    );

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url.trim(),
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");

    if (!url || !url.trim()) {
      return;
    }

    editor
      .chain()
      .focus()
      .setImage({
        src: url.trim(),
      })
      .run();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {/* Toolbar */}

      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        {/* Headings */}

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run();
            }}
            className={
              editor.isActive("heading", { level: 1 })
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run();
            }}
            className={
              editor.isActive("heading", { level: 2 })
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: 3 })
                .run();
            }}
            className={
              editor.isActive("heading", { level: 3 })
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>
        </div>

        {/* Text formatting */}

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBold().run();
            }}
            className={
              editor.isActive("bold")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
            }}
            className={
              editor.isActive("italic")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
            }}
            className={
              editor.isActive("strike")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* Lists */}

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBulletList().run();
            }}
            className={
              editor.isActive("bulletList")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={
              editor.isActive("orderedList")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={
              editor.isActive("blockquote")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Blockquote"
          >
            <Quote size={16} />
          </button>
        </div>

        {/* Link / Image */}

        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          <button
            type="button"
            onClick={addLink}
            className={
              editor.isActive("link")
                ? "flex h-8 w-8 items-center justify-center rounded-md bg-[#12233F] text-white transition"
                : "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            }
            title="Add Link"
          >
            <LinkIcon size={16} />
          </button>

          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-rose-500"
              title="Remove Link"
            >
              <Unlink size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={addImage}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            title="Add Image"
          >
            <ImageIcon size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
            title="Horizontal Line"
          >
            <Minus size={16} />
          </button>
        </div>

        {/* Undo / Redo */}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().undo().run();
            }}
            disabled={
              !editor.can().chain().focus().undo().run()
            }
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().redo().run();
            }}
            disabled={
              !editor.can().chain().focus().redo().run()
            }
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}

      <EditorContent editor={editor} />

      {/* Editor styling */}

      <style jsx global>{`
        .ProseMirror {
          min-height: 320px;
          padding: 16px;
          outline: none;
          font-size: 13px;
          line-height: 1.7;
          color: #334155;
        }

        .ProseMirror p {
          margin: 0 0 12px;
        }

        .ProseMirror h1 {
          margin: 20px 0 12px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
          color: #0f172a;
        }

        .ProseMirror h2 {
          margin: 18px 0 10px;
          font-size: 22px;
          line-height: 1.3;
          font-weight: 700;
          color: #0f172a;
        }

        .ProseMirror h3 {
          margin: 16px 0 8px;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 700;
          color: #0f172a;
        }

        .ProseMirror ul {
          margin: 8px 0 14px;
          padding-left: 24px;
          list-style-type: disc;
        }

        .ProseMirror ol {
          margin: 8px 0 14px;
          padding-left: 24px;
          list-style-type: decimal;
        }

        .ProseMirror li {
          margin: 4px 0;
        }

        .ProseMirror blockquote {
          margin: 16px 0;
          border-left: 3px solid #12233f;
          padding-left: 14px;
          color: #64748b;
          font-style: italic;
        }

        .ProseMirror hr {
          margin: 20px 0;
          border: 0;
          border-top: 1px solid #e2e8f0;
        }

        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 16px 0;
          border-radius: 8px;
        }

        .ProseMirror img.ProseMirror-selectednode {
          outline: 2px solid #12233f;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror s {
          text-decoration: line-through;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: "Write your product description...";
          color: #cbd5e1;
          float: left;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

