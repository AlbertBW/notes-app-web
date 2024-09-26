const notes = [
  {
    id: 1,
    name: "Welcome to Notes",
    content: `# Welcome to Notes 🎉 `,
  },
  {
    id: 2,
    name: "Getting Started",
    content: `# Getting Started 🚀`,
  },
];

export const addStartingNotes = ({
  addNote,
  writeNote,
}: {
  addNote: (folderId: number, noteName: string) => void;
  writeNote: (noteId: number, content: string) => void;
}) => {
  notes.forEach((note) => {
    addNote(0, note.name);
    writeNote(note.id, note.content);
  });
};
