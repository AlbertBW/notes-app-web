import React, { useEffect, useRef, useState } from "react";
import UserFolders from "./user-folders";
import { Folder } from "@/store/repoStore";
import Dropdown from "./dropdown";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SidebarClose, SidebarOpen } from "lucide-react";
import NoteIcon from "./icons/note-icon";

export type NewNoteState = {
  newNote: boolean;
  folderId: number;
};

export type NewFolderState = {
  newFolder: boolean;
  leadingFolderId: number;
};

type SidebarProps = {
  repository: Folder;
  addFolder: (folderId: number, folderName: string) => void;
  removeFolder: (folderId: number) => void;
  renameFolder: (folderId: number, newName: string) => void;
  addNote: (folderId: number, noteName: string) => void;
  removeNote: (folderId: number, noteId: number) => void;
  renameNote: (folderId: number, noteId: number, newName: string) => void;
  setSelectedNote: (noteId: number | null) => void;
  selectedNote: number | null;
  moveNote: (noteId: number, folderId: number | null) => void;
};

export default function Sidebar({
  repository,
  addFolder,
  removeFolder,
  addNote,
  removeNote,
  renameNote,
  renameFolder,
  setSelectedNote,
  selectedNote,
  moveNote,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: number]: boolean;
  }>({});
  const inputRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [newNote, setNewNote] = useState<NewNoteState>({
    newNote: false,
    folderId: repository.id,
  });
  const [newFolder, setNewFolder] = useState<NewFolderState>({
    newFolder: false,
    leadingFolderId: repository.id,
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
        setNewNote({ newNote: false, folderId: repository.id });
        setNewFolder({ newFolder: false, leadingFolderId: repository.id });
        setRenameFolderIdState(null);
        setRenameNoteIdState(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    setNewNote,
    setNewFolder,
    setRenameFolderIdState,
    setRenameNoteIdState,
    repository.id,
  ]);

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
    notesFolderId: number
  ) {
    if (e.key === "Enter") {
      // Create New Note
      if (newNote.newNote) {
        addNewNote();
        handleNewNoteState(newNote.folderId);
        return openFolder(newNote.folderId);
      }

      // Create New Folder
      if (newFolder.newFolder) {
        addNewFolder();
        handleNewFolderState(newFolder.leadingFolderId);
        return openFolder(newFolder.leadingFolderId);
      }

      // Rename Note
      if (renameNoteIdState !== null) {
        handleRenameNote(notesFolderId);
        setRenameNoteIdState(null);
      }

      // Rename Folder
      if (renameFolderIdState !== null) {
        handleRenameFolder();
        setRenameFolderIdState(null);
        return;
      }
    }
  }

  function handleNewNoteState(folderId: number) {
    setNewNote({ newNote: !newNote.newNote, folderId });
  }

  function handleNewFolderState(leadingFolderId: number) {
    setNewFolder({ newFolder: !newFolder.newFolder, leadingFolderId });
  }

  function addNewNote() {
    addNote(newNote.folderId, newNoteName);
  }

  function handleRemoveNote({
    folderId,
    noteId,
  }: {
    folderId: number;
    noteId: number;
  }) {
    removeNote(folderId, noteId);
  }

  function handleRenameNote(folderId: number) {
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

  // Called when the drag operation starts
  const handleDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    noteId: number
  ) => {
    e.dataTransfer.setData("text/plain", noteId.toString()); // Set the dragged note's ID
    e.dataTransfer.effectAllowed = "move";
  };

  // Called when the dragged element is over a valid drop target
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
    e.dataTransfer.dropEffect = "move";
  };

  // Called when the dragged element is dropped onto a target
  const handleDrop = (e: React.DragEvent, targetFolderId: number) => {
    const draggedNoteId = parseInt(e.dataTransfer.getData("text/plain"), 10);

    // For example, you could update the state to reorder the notes
    console.log(`Dropped note ${draggedNoteId} onto folder ${targetFolderId}`);
    // Add your custom logic here to rearrange or move notes
    moveNote(draggedNoteId, targetFolderId);
  };

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          style={{ width: sidebarWidth }}
          className="text-white flex-shrink-0 relative"
        >
          <div className="p-4 flex justify-between items-center select-none">
            <p>Your Notes</p>
            <Dropdown
              handleNewNoteState={handleNewNoteState}
              folderId={repository.id}
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
            className="absolute top-0 right-0 border-r w-2 z-10 hover:bg-zinc-800 active:bg-zinc-800 transition-colors border-zinc-600 h-full cursor-col-resize"
            onMouseDown={handleMouseDown}
          />

          {repository.subfolders.length === 0 &&
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
          {newNote.newNote && newNote.folderId === repository.id && (
            <div ref={inputRef}>
              <div className="bg-black w-full px-2">
                <Input
                  placeholder="Note Title"
                  onChange={(e) => setNewNoteName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, repository.id)}
                />
              </div>
            </div>
          )}
          {newFolder.newFolder &&
            newFolder.leadingFolderId === repository.id && (
              <div ref={inputRef}>
                <div className="bg-black w-full px-2">
                  <Input
                    placeholder="Folder Title"
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, repository.id)}
                  />
                </div>
              </div>
            )}

          <UserFolders
            folders={repository.subfolders}
            handleNewNoteState={handleNewNoteState}
            handleNewFolderState={handleNewFolderState}
            newNote={newNote}
            setNewNote={setNewNote}
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            setNewNoteName={setNewNoteName}
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
            setSelectedNote={setSelectedNote}
            selectedNote={selectedNote}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
          {repository.notes.length > 0 &&
            repository.notes.map((note) => (
              <div key={note.id} className="w-full flex flex-row group px-2">
                <Button
                  onClick={() => setSelectedNote(note.id)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id)} // Start dragging a note
                  onDragOver={handleDragOver} // Required to allow a drop
                  onDrop={(e) => handleDrop(e, note.id)} // Drop a note into a new folder or position
                  className={`bg-black gap-2 w-full ${
                    selectedNote === note.id && "bg-primary"
                  }`}
                >
                  <NoteIcon />{" "}
                  {renameNoteIdState === note.id ? (
                    <div ref={inputRef}>
                      <Input
                        placeholder="New Title"
                        onChange={(e) => setNewNoteName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, repository.id)}
                      />
                    </div>
                  ) : (
                    <p>{note.name}</p>
                  )}
                </Button>
                {renameNoteIdState !== note.id && (
                  <Dropdown
                    folderId={repository.id}
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
