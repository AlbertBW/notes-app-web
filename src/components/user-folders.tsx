import { useState } from "react";
import { Button } from "./ui/button";
import FolderIcon from "./icons/folder-icon";
import NoteIcon from "./icons/note-icon";
import { Folder } from "./sidebar";
import FolderDropdown from "./folder-dropdown";
import NoteDropdown from "./note-dropdown";

export default function UserFolders({
  folders,
  subfolder,
}: {
  folders: Folder[];
  subfolder?: boolean;
}) {
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleFolder = (folderId: number) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className="flex flex-col">
      {folders.map((folder) => {
        const isExpanded = expandedFolders[folder.id] || false;
        return (
          <>
            <div className="w-full flex flex-row px-2 group">
              <Button
                draggable
                onClick={() => toggleFolder(folder.id)}
                className="bg-black gap-2 w-full"
              >
                {subfolder && (
                  <div className="border-zinc-600 border-l h-full ml-2" />
                )}
                <FolderIcon /> <p>{folder.name}</p>
              </Button>

              <Button className="bg-black px-2">
                <FolderDropdown />
              </Button>
            </div>

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
                      <NoteIcon /> <p>{note.name}</p>
                    </Button>

                    <Button className="bg-black px-2">
                      <NoteDropdown />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="h-0" />
            )}

            {isExpanded &&
              folder.subfolders &&
              folder.subfolders.length > 0 && (
                <UserFolders folders={folder.subfolders} subfolder />
              )}
          </>
        );
      })}
    </div>
  );
}
