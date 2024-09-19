import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import FolderIcon from "./icons/folder-icon";
import NoteIcon from "./icons/note-icon";
import Dropdown from "./dropdown";
import { Input } from "./ui/input";
import { Folder, Note } from "@/store/repoStore";
import { NewFolderState, NewNoteState } from "./sidebar";

type UserFoldersProps = {
  folders: Folder[];
  notes: Note[];
  subfolder?: boolean;
  newNote: NewNoteState;
  setNewNoteName: (name: string) => void;
  setNewFolderName: (name: string) => void;
  handleNewNoteState: (folderId: number | null) => void;
  handleNewFolderState: (folderId: number | null) => void;
  addNewNote: () => void;
  handleRemoveNote: (params: {
    folderId: number | null;
    noteId: number;
  }) => void;
  setNewNote: (newNote: NewNoteState) => void;
  newFolder: NewFolderState;
  setNewFolder: (newFolder: NewFolderState) => void;
  addNewFolder: () => void;
  handleRemoveFolder: (folderId: number) => void;
  renameNoteIdState: number | null;
  setRenameNoteIdState: (noteId: number | null) => void;
  handleRenameNote: (folderId: number | null) => void;
  setRenameFolderIdState: (folderId: number | null) => void;
  renameFolderIdState: number | null;
  handleRenameFolder: () => void;
};

export default function UserFolders({
  folders,
  notes,
  subfolder,
  newNote,
  setNewNoteName,
  setNewFolderName,
  handleNewNoteState,
  handleNewFolderState,
  addNewNote,
  handleRemoveNote,
  setNewNote,
  newFolder,
  setNewFolder,
  addNewFolder,
  handleRemoveFolder,
  renameNoteIdState,
  setRenameNoteIdState,
  handleRenameNote,
  setRenameFolderIdState,
  renameFolderIdState,
  handleRenameFolder,
}: UserFoldersProps) {
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: number]: boolean;
  }>({});
  const inputRef = useRef<HTMLDivElement>(null);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setNewNote({ newNote: false, folderId: null });
        setNewFolder({ newFolder: false, leadingFolderId: null });
        setRenameFolderIdState(null);
        setRenameNoteIdState(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setNewNote, setNewFolder, setRenameFolderIdState, setRenameNoteIdState]);

  const toggleFolder = (folderId: number) => {
    console.log("toggleFolder", folderId);
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const openFolder = (folderId: number) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: true,
    }));
  };

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    notesFolderId?: number
  ) {
    if (e.key === "Enter") {
      if (newNote.newNote) {
        addNewNote();
        handleNewNoteState(null);
        if (newNote.folderId !== null) {
          return openFolder(newNote.folderId);
        }
        return;
      }
      if (newFolder.newFolder) {
        addNewFolder();
        handleNewFolderState(null);
        return;
      }
      if (renameNoteIdState !== null) {
        if (notesFolderId) {
          handleRenameNote(notesFolderId);
        } else {
          handleRenameNote(null);
        }
        setRenameNoteIdState(null);
        return;
      }
      if (renameFolderIdState !== null) {
        handleRenameFolder();
        setRenameFolderIdState(null);
        return;
      }
    }
  }

  return (
    <div className="flex flex-col">
      {/* New Note at top level (Not in folder) */}
      {newNote.newNote && newNote.folderId === null && (
        <div ref={inputRef}>
          <div className="bg-black px-2 w-full">
            <Input
              placeholder="Note Title"
              onChange={(e) => setNewNoteName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {newFolder.newFolder && newFolder.leadingFolderId === null && (
        <div ref={inputRef}>
          <div className="bg-black px-2 w-full">
            <Input
              placeholder="Folder Title"
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}

      {folders.length === 0 &&
        notes.length === 0 &&
        !newNote.newNote &&
        !newFolder.newFolder && (
          <div className="w-full flex flex-row px-2">
            <div className="bg-black text-center gap-2 w-full text-zinc-600 select-none">
              <p>No folders or notes</p>
            </div>
          </div>
        )}

      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id] || false;
        return (
          <>
            <div key={folder.id} className="w-full flex flex-row px-2 group">
              <Button
                draggable
                onClick={() => toggleFolder(folder.id)}
                className="bg-black gap-2 w-full"
              >
                {subfolder && (
                  <div className="border-zinc-600 border-l h-full ml-2" />
                )}
                <FolderIcon />{" "}
                {renameFolderIdState && renameFolderIdState === folder.id ? (
                  <div ref={inputRef}>
                    <Input
                      placeholder="New Folder Title"
                      onChange={(e) => {
                        setNewFolderName(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                ) : (
                  <p>{folder.name}</p>
                )}
              </Button>

              {!renameFolderIdState && (
                <Dropdown
                  handleNewNoteState={handleNewNoteState}
                  folderId={folder.id}
                  handleRemoveNote={handleRemoveNote}
                  noteId={-1}
                  variant="folder"
                  handleNewFolderState={handleNewFolderState}
                  handleRemoveFolder={handleRemoveFolder}
                  setRenameNoteIdState={() => {}}
                  setRenameFolderIdState={setRenameFolderIdState}
                />
              )}
            </div>

            {isExpanded &&
              folder.subfolders &&
              folder.subfolders.length > 0 && (
                <UserFolders
                  folders={folder.subfolders}
                  subfolder
                  handleNewNoteState={handleNewNoteState}
                  handleNewFolderState={handleNewFolderState}
                  newNote={newNote}
                  setNewNote={setNewNote}
                  newFolder={newFolder}
                  setNewFolder={setNewFolder}
                  notes={notes}
                  setNewNoteName={setNewNoteName}
                  addNewNote={addNewNote}
                  handleRemoveNote={handleRemoveNote}
                  setNewFolderName={setNewFolderName}
                  addNewFolder={addNewFolder}
                  handleRemoveFolder={handleRemoveFolder}
                  renameNoteIdState={renameNoteIdState}
                  setRenameNoteIdState={setRenameNoteIdState}
                  handleRenameNote={handleRenameNote}
                  setRenameFolderIdState={setRenameFolderIdState}
                  renameFolderIdState={renameFolderIdState}
                  handleRenameFolder={handleRenameFolder}
                />
              )}

            {newNote.newNote && newNote.folderId === folder.id && (
              <div className="w-full flex flex-row px-2 group">
                {subfolder && <div className="border-zinc-600 border-l ml-8" />}
                <div
                  className={`border-l border-zinc-600 ${!subfolder && "ml-6"}`}
                />
                <Button draggable className="bg-black gap-2 w-full">
                  <Input
                    placeholder="Note Title"
                    onChange={(e) => {
                      setNewNoteName(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                </Button>
              </div>
            )}

            {newFolder.newFolder && newFolder.leadingFolderId === folder.id && (
              <div className="w-full flex flex-row px-2 group">
                {subfolder && <div className="border-zinc-600 border-l ml-8" />}
                <div
                  className={`border-l border-zinc-600 ${!subfolder && "ml-6"}`}
                />
                <Button draggable className="bg-black gap-2 w-full">
                  <div ref={inputRef}>
                    <Input
                      placeholder="Folder Title"
                      onChange={(e) => {
                        setNewFolderName(e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </Button>
              </div>
            )}

            {isExpanded && folder.notes && folder.notes.length > 0 ? (
              folder.notes.map((note) => {
                return (
                  <div
                    key={note.id}
                    className="w-full flex flex-row px-2 group"
                  >
                    {subfolder && (
                      <div className="border-zinc-600 border-l ml-8" />
                    )}
                    <div
                      className={`border-l border-zinc-600 ${
                        !subfolder && "ml-6"
                      }`}
                    />
                    <Button draggable className="bg-black gap-2 w-full">
                      <NoteIcon />{" "}
                      {renameNoteIdState === note.id ? (
                        <div ref={inputRef}>
                          <Input
                            placeholder="New Title"
                            onChange={(e) => setNewNoteName(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, folder.id)}
                          />
                        </div>
                      ) : (
                        <p>{note.name}</p>
                      )}
                    </Button>

                    {renameNoteIdState !== note.id && (
                      <Dropdown
                        folderId={folder.id}
                        noteId={note.id}
                        handleRemoveNote={handleRemoveNote}
                        handleNewNoteState={handleNewNoteState}
                        variant="note"
                        handleNewFolderState={handleNewFolderState}
                        handleRemoveFolder={() => {}}
                        setRenameNoteIdState={setRenameNoteIdState}
                        setRenameFolderIdState={setRenameFolderIdState}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="h-0" />
            )}
          </>
        );
      })}

      {notes.length > 0 &&
        notes.map((note) => (
          <div key={note.id} className="w-full flex flex-row px-2 group">
            <Button draggable className="bg-black gap-2 w-full">
              <NoteIcon />{" "}
              {renameNoteIdState === note.id ? (
                <div ref={inputRef}>
                  <Input
                    placeholder="New Title"
                    onChange={(e) => setNewNoteName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              ) : (
                <p>{note.name}</p>
              )}
            </Button>
            {renameNoteIdState !== note.id && (
              <Dropdown
                folderId={null}
                noteId={note.id}
                handleRemoveNote={handleRemoveNote}
                handleNewNoteState={handleNewNoteState}
                variant="note"
                handleNewFolderState={handleNewFolderState}
                handleRemoveFolder={() => {}}
                setRenameNoteIdState={setRenameNoteIdState}
                setRenameFolderIdState={setRenameFolderIdState}
              />
            )}
          </div>
        ))}
    </div>
  );
}
