import { Button } from "./ui/button";
import FolderIcon from "./icons/folder-icon";
import NoteIcon from "./icons/note-icon";
import Dropdown from "./dropdown";
import { Input } from "./ui/input";
import { Folder } from "@/store/repoStore";
import { NewFolderState, NewNoteState } from "./sidebar";

type UserFoldersProps = {
  subfolder?: boolean;
  folders: Folder[];
  newNote: NewNoteState;
  setNewNoteName: (name: string) => void;
  setNewFolderName: (name: string) => void;
  handleNewNoteState: (folderId: number) => void;
  handleNewFolderState: (folderId: number) => void;
  handleRemoveNote: (params: { folderId: number; noteId: number }) => void;
  setNewNote: (newNote: NewNoteState) => void;
  newFolder: NewFolderState;
  setNewFolder: (newFolder: NewFolderState) => void;
  addNewFolder: () => void;
  handleRemoveFolder: (folderId: number) => void;
  renameNoteIdState: number | null;
  setRenameNoteIdState: (noteId: number | null) => void;
  handleRenameNote: (folderId: number) => void;
  setRenameFolderIdState: (folderId: number | null) => void;
  renameFolderIdState: number | null;
  handleRenameFolder: () => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    notesFolderId: number
  ) => void;
  expandedFolders: { [key: number]: boolean };
  toggleFolder: (folderId: number) => void;
  openFolder: (folderId: number) => void;
  inputRef: React.RefObject<HTMLDivElement>;
  setSelectedNote: (noteId: number) => void;
  selectedNote: number | null;
  handleDragStart: (
    e: React.DragEvent<HTMLButtonElement>,
    noteId: number
  ) => void;
  handleDragOver: (e: React.DragEvent<HTMLButtonElement>) => void;
  handleDrop: (
    e: React.DragEvent<HTMLButtonElement>,
    noteId: number,
    isFolder: boolean
  ) => void;
  hoveredFolderId: number | null;
  handleDragEnter: (folderId: number) => void;
  handleDragLeave: () => void;
};

export default function UserFolders({
  subfolder,
  folders,
  newNote,
  setNewNoteName,
  setNewFolderName,
  handleNewNoteState,
  handleNewFolderState,
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
  handleKeyDown,
  expandedFolders,
  toggleFolder,
  inputRef,
  openFolder,
  setSelectedNote,
  selectedNote,
  handleDragStart,
  handleDragOver,
  handleDrop,
  hoveredFolderId,
  handleDragEnter,
  handleDragLeave,
}: UserFoldersProps) {
  return (
    <div className="flex flex-col">
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id] || false;
        return (
          <div key={folder.id}>
            <div className="w-full flex flex-row group px-2">
              {subfolder && <div className={``} />}
              <Button
                draggable
                onClick={() => toggleFolder(folder.id)}
                onDragStart={(e) => handleDragStart(e, folder.id)} // Start dragging a folder
                onDragOver={handleDragOver} // Required to allow a drop
                onDrop={(e) => handleDrop(e, folder.id, true)} // Drop a note or folder into this folder
                onDragEnter={() => handleDragEnter(folder.id)} // Highlight folder on drag enter
                onDragLeave={handleDragLeave} // Remove highlight on drag leave
                className={`bg-black gap-2 w-full ${
                  hoveredFolderId === folder.id && "bg-zinc-600"
                }`} // Apply highlight class
              >
                <FolderIcon />{" "}
                {renameFolderIdState && renameFolderIdState === folder.id ? (
                  <div ref={inputRef}>
                    <Input
                      placeholder="New Folder Title"
                      onChange={(e) => {
                        setNewFolderName(e.target.value);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, folder.id)}
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
                <div className="ml-6 border-l border-zinc-600">
                  <UserFolders
                    subfolder
                    folders={folder.subfolders}
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
                    inputRef={inputRef}
                    openFolder={openFolder}
                    setSelectedNote={setSelectedNote}
                    selectedNote={selectedNote}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    hoveredFolderId={hoveredFolderId}
                    handleDragEnter={handleDragEnter}
                    handleDragLeave={handleDragLeave}
                  />
                </div>
              )}

            {newNote.newNote && newNote.folderId === folder.id && (
              <div className="w-full flex flex-row group">
                <div className={`ml-6`} />
                <Button draggable className="bg-black gap-2 w-full">
                  <Input
                    placeholder="Note Title"
                    onChange={(e) => {
                      setNewNoteName(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, folder.id)}
                  />
                </Button>
              </div>
            )}

            {newFolder.newFolder && newFolder.leadingFolderId === folder.id && (
              <div className="w-full flex flex-row group">
                <div className={` ml-6`} />
                <Button draggable className="bg-black gap-2 w-full">
                  <div ref={inputRef}>
                    <Input
                      placeholder="Folder Title"
                      onChange={(e) => {
                        setNewFolderName(e.target.value);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, folder.id)}
                    />
                  </div>
                </Button>
              </div>
            )}

            {isExpanded && folder.notes && folder.notes.length > 0 ? (
              folder.notes.map((note) => {
                return (
                  <div key={note.id} className="w-full flex flex-row group">
                    <div className={`border-l border-zinc-600 ml-6`} />
                    <Button
                      draggable
                      onClick={() => setSelectedNote(note.id)}
                      onDragStart={(e) => handleDragStart(e, note.id)} // Start dragging a note
                      onDragOver={handleDragOver} // Required to allow a drop
                      onDrop={(e) => handleDrop(e, note.id, false)} // Drop a note into a new folder or position
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
          </div>
        );
      })}
    </div>
  );
}
