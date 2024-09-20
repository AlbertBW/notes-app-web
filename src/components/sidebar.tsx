import React, { useEffect, useRef, useState } from "react";
import UserFolders from "./user-folders";
import { Folder, Note } from "@/store/repoStore";
import Dropdown from "./dropdown";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import NoteIcon from "./icons/note-icon";
import { SidebarClose, SidebarOpen } from "lucide-react";

export type NewNoteState = {
  newNote: boolean;
  folderId: number | null;
};

export type NewFolderState = {
  newFolder: boolean;
  leadingFolderId: number | null;
};

type SidebarProps = {
  repository: {
    folders: Folder[];
    notes: Note[];
  };
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
};

export default function Sidebar({
  repository,
  addFolder,
  removeFolder,
  addNote,
  removeNote,
  renameNote,
  renameFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: number]: boolean;
  }>({});
  const inputRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [newNote, setNewNote] = useState<NewNoteState>({
    newNote: false,
    folderId: null,
  });
  const [newFolder, setNewFolder] = useState<NewFolderState>({
    newFolder: false,
    leadingFolderId: null,
  });
  const [renameNoteIdState, setRenameNoteIdState] = useState<number | null>(
    null
  );
  const [renameFolderIdState, setRenameFolderIdState] = useState<number | null>(
    null
  );
  const [newNoteName, setNewNoteName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");

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

  // Handle sidebar resize
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    const newWidth = e.clientX;
    if (newWidth > 160 && newWidth < 500) {
      setSidebarWidth(newWidth);
    }
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }

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

  function handleNewNoteState(folderId: number | null) {
    setNewNote({ newNote: !newNote.newNote, folderId });
  }

  function handleNewFolderState(leadingFolderId: number | null) {
    setNewFolder({ newFolder: !newFolder.newFolder, leadingFolderId });
  }

  function addNewNote() {
    addNote(newNote.folderId, newNoteName);
  }

  function handleRemoveNote({
    folderId,
    noteId,
  }: {
    folderId: number | null;
    noteId: number;
  }) {
    removeNote(folderId, noteId);
  }

  function handleRenameNote(folderId: number | null) {
    if (renameNoteIdState === null) return;
    renameNote(folderId, renameNoteIdState, newNoteName);
  }

  function addNewFolder() {
    addFolder(newFolder.leadingFolderId, newFolderName);
  }

  function handleRemoveFolder(folderId: number) {
    removeFolder(folderId);
  }

  function handleRenameFolder() {
    if (renameFolderIdState === null) return;
    renameFolder(renameFolderIdState, newFolderName);
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          style={{ width: sidebarWidth }}
          className="text-white flex-shrink-0 relative"
        >
          <div className="p-4 flex justify-between select-none">
            <p>Your Notes</p>
            <Dropdown
              handleNewNoteState={handleNewNoteState}
              folderId={null}
              handleRemoveNote={handleRemoveNote}
              noteId={-1}
              variant="new"
              handleNewFolderState={handleNewFolderState}
              handleRemoveFolder={handleRemoveFolder}
              setRenameNoteIdState={setRenameNoteIdState}
              setRenameFolderIdState={setRenameFolderIdState}
            />
          </div>
          {/* Resize handle */}
          <div
            className="absolute top-0 right-0 border-r w-2 z-10 hover:bg-zinc-800 active:bg-zinc-800 transition-all border-zinc-600 h-full cursor-col-resize"
            onMouseDown={handleMouseDown}
          />

          {repository.folders.length === 0 &&
            repository.notes.length === 0 &&
            !newNote.newNote &&
            !newFolder.newFolder && (
              <div className="w-full flex flex-row">
                <div className="bg-black text-center gap-2 w-full text-zinc-600 select-none">
                  <p>No folders or notes</p>
                </div>
              </div>
            )}
          {/* New Note at top level (Not in folder) */}
          {newNote.newNote && newNote.folderId === null && (
            <div ref={inputRef}>
              <div className="bg-black w-full px-2">
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
              <div className="bg-black w-full px-2">
                <Input
                  placeholder="Folder Title"
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}
          <UserFolders
            folders={repository.folders}
            handleNewNoteState={handleNewNoteState}
            handleNewFolderState={handleNewFolderState}
            newNote={newNote}
            setNewNote={setNewNote}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
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
            handleKeyDown={handleKeyDown}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            openFolder={openFolder}
            inputRef={inputRef}
          />
          {repository.notes.length > 0 &&
            repository.notes.map((note) => (
              <div key={note.id} className="w-full flex flex-row group px-2">
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
      )}

      {/* Toggle Button for Mobile */}
      <Button
        className="md:hidden p-2 fixed top-4 left-4"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <SidebarClose /> : <SidebarOpen />}
      </Button>
    </div>
  );
}
