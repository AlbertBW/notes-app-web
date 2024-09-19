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
  repository: {
    folders: Folder[];
    notes: Note[];
  };
  folderId: number;
  noteId: number;
  incrementFolderId: () => number;
  incrementNoteId: () => number;
  addFolder: (folderId: number | null, folderName: string) => void;
  removeFolder: (folderId: number) => void;
  renameFolder: (folderId: number, newName: string) => void;
  addNote: (folderId: number | null, noteName: string) => void;
  removeNote: (folderId: number | null, noteId: number) => void;
  renameNote: (
    folderId: number | null,
    noteId: number,
    newName: string
  ) => void;
}

const useRepoStore = create<RepoState>((set) => ({
  repository: {
    folders: [],
    notes: [],
  },

  folderId: 0,
  noteId: 0,

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
        parentFolderId: number | null
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

      // If there is a parentFolderId, add the new folder as a subfolder
      if (parentFolderId !== null) {
        return {
          repository: {
            ...state.repository,
            folders: addFolderRecursively(
              state.repository.folders,
              parentFolderId
            ),
          },
        };
      }

      // If there is no parentFolderId, add the new folder as a root folder
      return {
        repository: {
          ...state.repository,
          folders: [...state.repository.folders, newFolder],
        },
      };
    }),

  removeFolder: (folderId) =>
    set((state) => ({
      repository: {
        ...state.repository,
        folders: state.repository.folders.filter(
          (folder) => folder.id !== folderId
        ),
      },
    })),

  renameFolder: (folderId, newName) =>
    set((state) => ({
      repository: {
        ...state.repository,
        folders: state.repository.folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              name: newName,
            };
          }
          return folder;
        }),
      },
    })),

  addNote: (folderId, noteName) =>
    set((state) => {
      const newNote: Note = {
        id: useRepoStore.getState().incrementNoteId(),
        name: noteName,
        content: "",
        folderId: folderId,
      };

      return {
        repository: {
          ...state.repository,
          folders: state.repository.folders.map((folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                notes: [...folder.notes, newNote],
              };
            }
            return folder;
          }),
          notes:
            folderId === null
              ? [...state.repository.notes, newNote]
              : state.repository.notes,
        },
      };
    }),

  removeNote: (folderId, noteId) =>
    set((state) => ({
      repository: {
        ...state.repository,
        folders: state.repository.folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              notes: folder.notes.filter((note) => note.id !== noteId),
            };
          }
          return folder;
        }),
        notes: state.repository.notes.filter((note) => note.id !== noteId),
      },
    })),

  renameNote: (folderId, noteId, newName) =>
    set((state) => ({
      repository: {
        ...state.repository,
        folders: state.repository.folders.map((folder) => {
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
          return folder;
        }),
        notes: state.repository.notes.map((note) => {
          if (note.id === noteId) {
            return {
              ...note,
              name: newName,
            };
          }
          return note;
        }),
      },
    })),
}));

export default useRepoStore;
