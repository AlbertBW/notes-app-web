import { Folder } from "lucide-react";
import { create } from "zustand";

export type Note = {
  id: number;
  name: string;
  content: string;
  folderId: number | null;
};

export type Folder = {
  id: number;
  name: string;
  notes: Note[];
  subfolders: Folder[] | [];
  parentFolderId: number | null;
};

export interface RepoState {
  repository: Folder;
  folderId: number;
  noteId: number;
  clearRepo: () => void;
  importRepo: (repo: Folder) => void;
  incrementFolderId: () => number;
  incrementNoteId: () => number;
  addFolder: (folderId: number, folderName: string) => void;
  removeFolder: (folderId: number) => void;
  renameFolder: (folderId: number, newName: string) => void;
  addNote: (folderId: number, noteName: string) => void;
  removeNote: (folderId: number, noteId: number) => void;
  renameNote: (folderId: number, noteId: number, newName: string) => void;
  writeNote: (noteId: number, content: string) => void;
  moveNote: (noteId: number, folderId: number | null) => void;
}

const rootFolder: Folder = {
  id: 0,
  name: "Root",
  notes: [],
  subfolders: [],
  parentFolderId: null,
};

const useRepoStore = create<RepoState>((set) => ({
  repository: rootFolder,

  // Root folder has id 0
  folderId: 1,
  noteId: 0,

  clearRepo: () => {
    set({
      repository: rootFolder,
    });
  },

  importRepo: (repo) => {
    set({
      repository: repo,
    });
  },

  incrementFolderId: () => {
    let updatedFolderId = 0;
    set((state) => {
      updatedFolderId = state.folderId + 1;
      return {
        folderId: updatedFolderId,
      };
    });
    return updatedFolderId;
  },

  incrementNoteId: () => {
    let updatedNoteId = 0;
    set((state) => {
      updatedNoteId = state.noteId + 1;
      return {
        noteId: updatedNoteId,
      };
    });
    return updatedNoteId;
  },

  addFolder: (parentFolderId, folderName) =>
    set((state) => {
      const newFolder: Folder = {
        id: useRepoStore.getState().incrementFolderId(),
        name: folderName,
        subfolders: [],
        notes: [],
        parentFolderId: parentFolderId,
      };

      // Recursive function to add the new folder to the correct parent folder
      const addFolderRecursively = (
        folders: Folder[],
        parentFolderId: number
      ): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === parentFolderId) {
            return {
              ...folder,
              subfolders: [...folder.subfolders, newFolder],
            };
          }
          return {
            ...folder,
            subfolders: addFolderRecursively(folder.subfolders, parentFolderId),
          };
        });
      };

      return parentFolderId === state.repository.id
        ? {
            repository: {
              ...state.repository,
              subfolders: [...state.repository.subfolders, newFolder],
            },
          }
        : {
            repository: {
              ...state.repository,
              subfolders: addFolderRecursively(
                state.repository.subfolders,
                parentFolderId
              ),
            },
          };
    }),

  removeFolder: (folderId) =>
    set((state) => {
      const removeFolderRecursively = (
        folders: Folder[],
        folderId: number
      ): Folder[] => {
        return folders
          .filter((folder) => folder.id !== folderId)
          .map((folder) => ({
            ...folder,
            subfolders: removeFolderRecursively(
              folder.subfolders ?? [],
              folderId
            ),
          }));
      };

      return {
        repository: {
          ...state.repository,
          subfolders: removeFolderRecursively(
            state.repository.subfolders,
            folderId
          ),
        },
      };
    }),

  renameFolder: (folderId, newName) =>
    set((state) => {
      const renameFolderRecursively = (
        folders: Folder[],
        folderId: number,
        newName: string
      ): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              name: newName,
            };
          }
          return {
            ...folder,
            subfolders: renameFolderRecursively(
              folder.subfolders ?? [],
              folderId,
              newName
            ),
          };
        });
      };

      return {
        repository: {
          ...state.repository,
          subfolders: renameFolderRecursively(
            state.repository.subfolders,
            folderId,
            newName
          ),
        },
      };
    }),

  addNote: (folderId, noteName) =>
    set((state) => {
      const newNote: Note = {
        id: useRepoStore.getState().incrementNoteId(),
        name: noteName,
        content: "",
        folderId: folderId,
      };

      const addNoteRecursively = (
        folders: Folder[],
        folderId: number
      ): Folder[] =>
        folders.map((folder) =>
          folder.id === folderId
            ? { ...folder, notes: [...folder.notes, newNote] }
            : {
                ...folder,
                subfolders: addNoteRecursively(folder.subfolders, folderId),
              }
        );

      return folderId === state.repository.id
        ? {
            repository: {
              ...state.repository,
              notes: [...state.repository.notes, newNote],
            },
          }
        : {
            repository: {
              ...state.repository,
              subfolders: addNoteRecursively(
                state.repository.subfolders,
                folderId
              ),
            },
          };
    }),

  removeNote: (folderId, noteId) =>
    set((state) => {
      const removeNoteRecursively = (
        folders: Folder[],
        folderId: number,
        noteId: number
      ): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              notes: folder.notes.filter((note) => note.id !== noteId),
            };
          }
          return {
            ...folder,
            subfolders: removeNoteRecursively(
              folder.subfolders,
              folderId,
              noteId
            ),
          };
        });
      };

      return folderId === state.repository.id
        ? {
            repository: {
              ...state.repository,
              notes: state.repository.notes.filter(
                (note) => note.id !== noteId
              ),
            },
          }
        : {
            repository: {
              ...state.repository,
              subfolders: removeNoteRecursively(
                state.repository.subfolders,
                folderId,
                noteId
              ),
            },
          };
    }),

  renameNote: (folderId, noteId, newName) =>
    set((state) => {
      const renameNoteRecursively = (
        folders: Folder[],
        folderId: number,
        noteId: number,
        newName: string
      ): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              notes: folder.notes.map((note) => {
                if (note.id === noteId) {
                  return {
                    ...note,
                    name: newName,
                  };
                }
                return note;
              }),
            };
          }
          return {
            ...folder,
            subfolders: renameNoteRecursively(
              folder.subfolders,
              folderId,
              noteId,
              newName
            ),
          };
        });
      };

      return folderId === state.repository.id
        ? {
            repository: {
              ...state.repository,
              notes: state.repository.notes.map((note) =>
                note.id === noteId ? { ...note, name: newName } : note
              ),
            },
          }
        : {
            repository: {
              ...state.repository,
              subfolders: renameNoteRecursively(
                state.repository.subfolders,
                folderId,
                noteId,
                newName
              ),
            },
          };
    }),

  writeNote: (noteId, content) =>
    set((state) => {
      const writeNoteRecursively = (
        folders: Folder[],
        noteId: number,
        content: string
      ): Folder[] => {
        return folders.map((folder) => {
          return {
            ...folder,
            notes: folder.notes.map((note) => {
              if (note.id === noteId) {
                return {
                  ...note,
                  content: content,
                };
              }
              return note;
            }),
            subfolders: writeNoteRecursively(
              folder.subfolders,
              noteId,
              content
            ),
          };
        });
      };

      return {
        repository: {
          ...state.repository,
          notes: state.repository.notes.map((note) =>
            note.id === noteId ? { ...note, content: content } : note
          ),
          subfolders: writeNoteRecursively(
            state.repository.subfolders,
            noteId,
            content
          ),
        },
      };
    }),

  moveNote: (noteId, folderId) => {
    set((state) => {
      console.log("Moving note", noteId, "to folder", folderId);
      return state;
    });
  },
}));

export default useRepoStore;
