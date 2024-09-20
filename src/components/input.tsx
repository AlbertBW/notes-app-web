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
  return (
    <div className="w-full bg-black z-50">
      {note && (
        <input
          className="w-full bg-black"
          value={note.content}
          onChange={(e) => writeNote(note.id, e.target.value)}
        />
      )}

      {!note && (
        <div className="text-zinc-400 justify-center flex items-center h-screen">
          Select a note
        </div>
      )}
    </div>
  );
}
