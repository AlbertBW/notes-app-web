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
  writeNote: (noteId: number, content: string) => void;
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
          folders: removeFolderRecursively(state.repository.folders, folderId),
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
          folders: renameFolderRecursively(
            state.repository.folders,
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

      if (folderId === null) {
        return {
          repository: {
            ...state.repository,
            notes: [...state.repository.notes, newNote],
          },
        };
      }

      const addNoteRecursively = (
        folders: Folder[],
        folderId: number
      ): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return {
              ...folder,
              notes: [...folder.notes, newNote],
            };
          }
          return {
            ...folder,
            subfolders: addNoteRecursively(folder.subfolders, folderId),
          };
        });
      };

      return {
        repository: {
          ...state.repository,
          folders: addNoteRecursively(state.repository.folders, folderId),
        },
      };
    }),

  removeNote: (folderId, noteId) =>
    set((state) => {
      if (folderId === null) {
        return {
          repository: {
            ...state.repository,
            notes: state.repository.notes.filter((note) => note.id !== noteId),
          },
        };
      }

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

      return {
        repository: {
          ...state.repository,
          folders: removeNoteRecursively(
            state.repository.folders,
            folderId,
            noteId
          ),
        },
      };
    }),

  renameNote: (folderId, noteId, newName) =>
    set((state) => {
      if (folderId === null) {
        return {
          repository: {
            ...state.repository,
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
        };
      }

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

      return {
        repository: {
          ...state.repository,
          folders: renameNoteRecursively(
            state.repository.folders,
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
        console.log(content);
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

      // If the note was found and updated at the top level, return the updated folder
      const noteFound = state.repository.notes.find(
        (note) => note.id === noteId
      );
      if (noteFound) {
        return {
          repository: {
            ...state.repository,
            notes: state.repository.notes.map((note) => {
              if (note.id === noteId) {
                return {
                  ...note,
                  content: content,
                };
              }
              return note;
            }),
          },
        };
      }

      return {
        repository: {
          ...state.repository,
          folders: writeNoteRecursively(
            state.repository.folders,
            noteId,
            content
          ),
        },
      };
    }),
}));

export default useRepoStore;
