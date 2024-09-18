export type Folder = {
  id: number;
  name: string;
  notes: Note[];
  subfolders: Folder[];
};

export type Note = {
  id: number;
  name: string;
  content: string;
};

const notes: Note[] = [
  { id: 1, name: "Note 1", content: "Content 1" },
  { id: 2, name: "Note 2", content: "Content 2" },
  { id: 3, name: "Note 3", content: "Content 3" },
  { id: 4, name: "Note 4", content: "Content 4" },
  { id: 5, name: "Note 5", content: "Content 5" },
  { id: 6, name: "Note 6", content: "Content 6" },
];

const subfolders: Folder[] = [
  { id: 4, name: "Subfolder 1", notes: [notes[5]], subfolders: [] },
  { id: 5, name: "Subfolder 2", notes: [notes[4]], subfolders: [] },
];

export const initialFolders: Folder[] = [
  { id: 1, name: "Folder 1", notes: [notes[0], notes[1]], subfolders: [] },
  {
    id: 2,
    name: "Folder 2",
    notes: [notes[2], notes[3], notes[4], notes[5]],
    subfolders: [],
  },
  {
    id: 3,
    name: "Folder 3",
    notes: [notes[0], notes[1], notes[2], notes[3], notes[4], notes[5]],
    subfolders: [subfolders[0], subfolders[1]],
  },
];

type Action =
  | { type: "ADD_FOLDER"; payload: { name: string; parentFolderId?: number } }
  | { type: "ADD_NOTE"; payload: { folderId: number; note: Note } }
  | { type: "DELETE_NOTE"; payload: { folderId: number; noteId: number } }
  | { type: "UPDATE_NOTE"; payload: { noteId: number; content: string } };

export function folderReducer(state: Folder[], action: Action): Folder[] {
  switch (action.type) {
    case "ADD_FOLDER": {
      const newFolder: Folder = {
        id: Date.now(),
        name: action.payload.name,
        notes: [],
        subfolders: [],
      };
      if (action.payload.parentFolderId) {
        // Add the folder to a parent folder's subfolders
        const addFolderToParent = (folders: Folder[]): Folder[] =>
          folders.map((folder) =>
            folder.id === action.payload.parentFolderId
              ? { ...folder, subfolders: [...folder.subfolders, newFolder] }
              : { ...folder, subfolders: addFolderToParent(folder.subfolders) }
          );
        return addFolderToParent(state);
      } else {
        // Add the folder to the root level
        return [...state, newFolder];
      }
    }
    case "ADD_NOTE": {
      const { folderId, note } = action.payload;

      const addNoteToFolder = (folders: Folder[]): Folder[] =>
        folders.map((folder) =>
          folder.id === folderId
            ? { ...folder, notes: [...folder.notes, note] }
            : { ...folder, subfolders: addNoteToFolder(folder.subfolders) }
        );

      return addNoteToFolder(state);
    }
    case "DELETE_NOTE": {
      const { folderId, noteId } = action.payload;

      const deleteNoteFromFolder = (folders: Folder[]): Folder[] =>
        folders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                notes: folder.notes.filter((note) => note.id !== noteId),
              }
            : { ...folder, subfolders: deleteNoteFromFolder(folder.subfolders) }
        );

      return deleteNoteFromFolder(state);
    }
    case "UPDATE_NOTE": {
      const { noteId, content } = action.payload;

      const updateNoteInFolders = (folders: Folder[]): Folder[] =>
        folders.map((folder) => ({
          ...folder,
          notes: folder.notes.map((note) =>
            note.id === noteId ? { ...note, content } : note
          ),
          subfolders: updateNoteInFolders(folder.subfolders),
        }));

      return updateNoteInFolders(state);
    }
    default:
      return state;
  }
}
