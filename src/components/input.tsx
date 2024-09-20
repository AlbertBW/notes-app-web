import ReactCodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { default as ReactMarkdown } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dot } from "lucide-react";
import { githubDark } from "@uiw/codemirror-theme-github";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dark,
  coldarkDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Input({
  note,
  writeNote,
}: {
  note: {
    id: number;
    name: string;
    content: string;
    folderId: number | null;
  } | null;
  writeNote: (noteId: number, content: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [codemirrorWidth, setCodemirrorWidth] = useState(400);

  const onChange = useCallback(
    (val: string) => {
      if (note) writeNote(note.id, val);
    },
    [note, writeNote]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth =
        e.clientX - containerRef.current.getBoundingClientRect().left;
      if (newWidth > containerWidth * 0.2 && newWidth < containerWidth * 0.8) {
        setCodemirrorWidth(newWidth);
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;

      setCodemirrorWidth(containerWidth / 2);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (codemirrorWidth > entry.contentRect.width * 0.81) {
          setCodemirrorWidth(entry.contentRect.width * 0.81);
          return;
        }
        if (codemirrorWidth < entry.contentRect.width * 0.2) {
          setCodemirrorWidth(entry.contentRect.width * 0.2);
          return;
        }
      }
    });

    const currentContainer = containerRef.current;

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, [containerRef, codemirrorWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-black z-50 overflow-y-scroll transition-colors"
    >
      {note && (
        <div className="w-full h-full flex">
          <div className="flex h-full">
            <div
              className="relative flex-shrink-0"
              style={{ width: codemirrorWidth }}
            >
              <div className="p-2 h-full">
                <ReactCodeMirror
                  value={note.content}
                  theme={githubDark}
                  minHeight="100%"
                  onChange={onChange}
                  extensions={[
                    markdown({
                      base: markdownLanguage,
                      codeLanguages: languages,
                    }),
                  ]}
                  className="h-full codemirror overflow-y-scroll border-2 rounded-md p-1 border-zinc-800"
                />
              </div>
            </div>
          </div>

          {/* Resizer */}
          <div
            className="group w-2 z-40 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700 transition-colors border-zinc-600 h-[calc(100%-20px)] my-auto cursor-col-resize justify-center flex items-center rounded"
            onMouseDown={handleMouseDown}
          >
            <Dot size={48} color="#52525b" />
          </div>

          <div className="w-full overflow-auto p-2">
            {/* <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="overflow-x-auto border-2 rounded-md p-4 border-zinc-800 h-full prose w-full bg-black"
            >
              {note.content}
            </ReactMarkdown> */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              // rehypePlugins={[rehypeRaw]}
              className="overflow-x-auto border-2 rounded-md p-4 border-zinc-800 h-full prose w-full bg-black"
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={coldarkDark}
                      PreTag="div"
                      language={match[1]}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {!note && (
        <div className="text-zinc-400 justify-center flex items-center h-screen">
          Select a note
        </div>
      )}
    </div>
  );
}
