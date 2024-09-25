import { useState } from "react";
import Input from "./components/input";
import Sidebar from "./components/sidebar";
import useRepoStore, { Folder, Note } from "./store/repoStore";
import Header from "./components/header";

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
  } = useRepoStore();

  const [selectedNote, setSelectedNote] = useState<number | null>(null);

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  function findNote() {
    if (!selectedNote) return null;
    let note = repository.notes.find((note) => note.id === selectedNote);

    const findNoteRecursively = (
      folders: Folder[],
      noteId: number
    ): Note | undefined => {
      return folders.reduce<Note | undefined>((foundNote, folder) => {
        if (foundNote) return foundNote;

        const note = folder.notes.find((note) => note.id === noteId);
        if (note) return note;

        return findNoteRecursively(folder.subfolders ?? [], noteId);
      }, undefined);
    };

    if (!note) {
      note = findNoteRecursively(repository.folders, selectedNote);
    }

    return note || null;
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
        />
        <Input note={note} writeNote={writeNote} />
      </div>
    </div>
  );
}
