import { useState, useRef, useEffect } from "react";
import DropdownIcon from "./icons/dropdown-icon";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type DropdownVariant = "folder" | "note" | "new";

export default function Dropdown({
  handleNewNoteState,
  handleNewFolderState,
  variant,
  handleRemoveNote,
  handleRemoveFolder,
  folderId,
  noteId,
  setRenameNoteIdState,
  setRenameFolderIdState,
}: {
  handleNewNoteState: (folderId: number | null) => void;
  handleNewFolderState: (folderId: number | null) => void;
  variant: DropdownVariant;
  handleRemoveNote: (params: {
    folderId: number | null;
    noteId: number;
  }) => void;
  handleRemoveFolder: (folderId: number) => void;
  folderId: number | null;
  noteId: number;
  setRenameNoteIdState: (noteId: number | null) => void;
  setRenameFolderIdState: (folderId: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {(variant === "folder" || variant === "note") && (
        <Button
          onClick={toggleDropdown}
          className="bg-black justify-center"
          size="icon"
        >
          <DropdownIcon isOpen={isOpen} />
        </Button>
      )}

      {variant === "new" && (
        <button onClick={toggleDropdown}>
          <Plus />
        </button>
      )}

      <div
        className={`absolute right-0 mt-2 w-48 bg-zinc-900 border -z-10 border-zinc-700 rounded-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-64 z-10 opacity-100" : "max-h-0 w-0 opacity-0"
        }`}
      >
        <ul className="py-0">
          {variant === "new" && (
            <>
              <li>
                <button
                  onClick={() => {
                    handleNewNoteState(null);
                    toggleDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Create Note
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNewFolderState(null);
                    toggleDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Create Folder
                </button>
              </li>
            </>
          )}

          {variant === "note" && (
            <>
              <li>
                <button
                  onClick={() => setRenameNoteIdState(noteId)}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Rename
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    handleRemoveNote({ folderId: folderId, noteId: noteId })
                  }
                  className="block px-4 py-2 hover:bg-zinc-800 w-full hover:text-red-500 transition-colors"
                >
                  Delete Note
                </button>
              </li>
            </>
          )}

          {variant === "folder" && folderId && (
            <>
              <li>
                <button
                  onClick={() => {
                    handleNewNoteState(folderId);
                    toggleDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Create Note
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNewFolderState(folderId);
                    toggleDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Create Subfolder
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRenameFolderIdState(folderId);
                    toggleDropdown();
                  }}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full"
                >
                  Rename Folder
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRemoveFolder(folderId)}
                  className="block px-4 py-2 hover:bg-zinc-800 w-full hover:text-red-500 transition-colors"
                >
                  Delete Folder
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
