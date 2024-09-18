import React, { useState } from "react";
import UserFolders from "./user-folders";
import NewDropdown from "./new-dropdown";

export type Folder = {
  id: number;
  name: string;
  notes: Note[];
  subfolders: Folder[];
};

export type Note = {
  id: number;
  name: string;
  content: string;
};

const notes: Note[] = [
  {
    id: 1,
    name: "Note 1",
    content: "Content 1",
  },
  {
    id: 2,
    name: "Note 2",
    content: "Content 2",
  },
  {
    id: 3,
    name: "Note 3",
    content: "Content 3",
  },
  {
    id: 4,
    name: "Note 4",
    content: "Content 4",
  },
  {
    id: 5,
    name: "Note 5",
    content: "Content 5",
  },
  {
    id: 6,
    name: "Note 6",
    content: "Content 6",
  },
];

const subfolders: Folder[] = [
  {
    id: 4,
    name: "Subfolder 1",
    notes: [notes[5]],
    subfolders: [],
  },
  {
    id: 5,
    name: "Subfolder 2",
    notes: [notes[4]],
    subfolders: [],
  },
];

const folders: Folder[] = [
  {
    id: 1,
    name: "Folder 1",
    notes: [notes[0], notes[1]],
    subfolders: [],
  },
  {
    id: 2,
    name: "Folder 2",
    notes: [notes[2], notes[3], notes[4], notes[5]],
    subfolders: [],
  },
  {
    id: 3,
    name: "Folder 3",
    notes: [notes[0], notes[1], notes[2], notes[3], notes[4], notes[5]],
    subfolders: [subfolders[0], subfolders[1]],
  },
];

export default function Sidebar() {
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          style={{ width: sidebarWidth }}
          className="text-white flex-shrink-0 relative"
        >
          <div className="p-4 flex justify-between">
            <p>Your Notes</p>
            <NewDropdown />
          </div>
          {/* Resize handle */}
          <div
            className="absolute top-0 right-0 border-r w-2 hover:bg-zinc-800 transition-colors border-zinc-600 h-full cursor-col-resize"
            onMouseDown={handleMouseDown}
          />
          <UserFolders folders={folders} />
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
