import { useEffect, useState } from "react";
import Input from "./components/input";
import Sidebar from "./components/sidebar";
import useRepoStore, { Folder, Note } from "./store/repoStore";
import Header from "./components/header";
import { addStartingNotes } from "./lib/welcomeNotesUtils";

export default function App() {
  const {
    repository,
    addFolder,
    removeFolder,
    renameFolder,
    addNote,
    removeNote,
    renameNote,
    writeNote,
    moveNote,
    moveFolder,
  } = useRepoStore();

  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Set welcome notes on first load
  useEffect(() => {
    const isFirstLoad = sessionStorage.getItem("isFirstLoad");
    if (!isFirstLoad) {
      addStartingNotes({ addNote, writeNote });
      setSelectedNote(1);

      sessionStorage.setItem("isFirstLoad", "true");
    }
  }, [repository, addNote, writeNote]);

  function findNote() {
    if (!selectedNote) return null;

    const findNoteRecursively = (
      folder: Folder,
      noteId: number
    ): Note | null => {
      const note = folder.notes.find((n) => n.id === noteId);
      if (note) return note;

      return folder.subfolders.reduce<Note | null>((found, subfolder) => {
        return found || findNoteRecursively(subfolder, noteId);
      }, null);
    };

    return findNoteRecursively(repository, selectedNote);
  }

  const note = findNote();

  return (
    <div>
      <Header />
      <div className="w-full h-[calc(100vh-65px)] flex">
        <Sidebar
          addFolder={addFolder}
          addNote={addNote}
          removeFolder={removeFolder}
          removeNote={removeNote}
          renameNote={renameNote}
          renameFolder={renameFolder}
          repository={repository}
          setSelectedNote={setSelectedNote}
          selectedNote={selectedNote}
          moveNote={moveNote}
          moveFolder={moveFolder}
        />
        <Input note={note} writeNote={writeNote} />
      </div>
    </div>
  );
}
