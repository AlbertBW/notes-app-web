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
  setSelectedNote: (noteId: number | null) => void;
  selectedNote: number | null;
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
      // Create New Note
      if (newNote.newNote) {
        addNewNote();
        handleNewNoteState(null);
        if (newNote.folderId !== null) {
          return openFolder(newNote.folderId);
        }
        return;
      }

      // Create New Folder
      if (newFolder.newFolder) {
        addNewFolder();
        handleNewFolderState(null);
        if (newFolder.leadingFolderId !== null) {
          return openFolder(newFolder.leadingFolderId);
        }
        return;
      }

      // Rename Note
      if (renameNoteIdState !== null) {
        if (notesFolderId) {
          handleRenameNote(notesFolderId);
        } else {
          handleRenameNote(null);
        }
        setRenameNoteIdState(null);
        return;
      }

      // Rename Folder
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
  const handleDrop = (e: React.DragEvent, targetNoteId: number) => {
    const draggedNoteId = parseInt(e.dataTransfer.getData("text/plain"), 10);

    // Handle the logic to move or reorder the notes
    if (draggedNoteId !== targetNoteId) {
      // For example, you could update the state to reorder the notes
      console.log(`Dropped note ${draggedNoteId} onto note ${targetNoteId}`);
      // Add your custom logic here to rearrange or move notes
    }
  };

  // Called when the drag operation starts
  const handleFolderDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    folderId: number
  ) => {
    e.dataTransfer.setData("text/plain", folderId.toString()); // Set the dragged note's ID
    e.dataTransfer.effectAllowed = "move";
  };

  // Called when the dragged element is over a valid drop target
  const handleFolderDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
    e.dataTransfer.dropEffect = "move";
  };

  // Called when the dragged element is dropped onto a target
  const handleFolderDrop = (e: React.DragEvent, targetId: number) => {
    const draggedFolderId = parseInt(e.dataTransfer.getData("text/plain"), 10);

    // Handle the logic to move or reorder the notes
    if (draggedFolderId !== targetId) {
      // For example, you could update the state to reorder the notes
      console.log(`Dropped folder ${draggedFolderId} onto note ${targetId}`);
      // Add your custom logic here to rearrange or move notes
    }
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
            className="absolute top-0 right-0 border-r w-2 z-10 hover:bg-zinc-800 active:bg-zinc-800 transition-colors border-zinc-600 h-full cursor-col-resize"
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
            handleFolderDragStart={handleFolderDragStart}
            handleFolderDragOver={handleFolderDragOver}
            handleFolderDrop={handleFolderDrop}
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
