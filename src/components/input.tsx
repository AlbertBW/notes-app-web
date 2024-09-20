import ReactCodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { default as ReactMarkdown } from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCallback } from "react";

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
  const onChange = useCallback(
    (val: string) => {
      if (note) writeNote(note.id, val);
    },
    [note, writeNote]
  );

  return (
    <div className=" w-full bg-black z-50 overflow-y-scroll transition-colors">
      {note && (
        <div className="w-full h-full">
          <div className="flex w-full h-full">
            <ReactCodeMirror
              value={note.content}
              theme={"dark"}
              minHeight="100%"
              onChange={onChange}
              extensions={[
                markdown({ base: markdownLanguage, codeLanguages: languages }),
              ]}
              className="w-1/2 h-full codemirror overflow-y-scroll"
            />
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="w-1/2">
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
