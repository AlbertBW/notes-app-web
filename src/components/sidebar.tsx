import React, { useState } from "react";
import UserFolders from "./user-folders";
import { Folder, Note } from "@/store/repoStore";
import Dropdown from "./dropdown";

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
            className="absolute top-0 right-0 border-r w-2 z-10 hover:bg-zinc-800 transition-colors border-zinc-600 h-full cursor-col-resize"
            onMouseDown={handleMouseDown}
          />
          <UserFolders
            folders={repository.folders}
            subfolder={false}
            handleNewNoteState={handleNewNoteState}
            handleNewFolderState={handleNewFolderState}
            newNote={newNote}
            setNewNote={setNewNote}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            notes={repository.notes}
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
        </div>
      )}

      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden p-2 fixed top-4 left-4 bg-blue-500 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Open"} Sidebar
      </button>
    </div>
  );
}
