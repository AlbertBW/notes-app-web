import Input from "./components/input";
import Sidebar from "./components/sidebar";
import useRepoStore from "./store/repoStore";

export default function App() {
  const {
    repository,
    addFolder,
    removeFolder,
    addNote,
    removeNote,
    renameNote,
    renameFolder,
  } = useRepoStore();

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  console.log(repository);

  return (
    <div className="w-full h-lvh flex">
      <Sidebar
        addFolder={addFolder}
        addNote={addNote}
        removeFolder={removeFolder}
        removeNote={removeNote}
        renameNote={renameNote}
        renameFolder={renameFolder}
        repository={repository}
      />
      <Input />
    </div>
  );
}
