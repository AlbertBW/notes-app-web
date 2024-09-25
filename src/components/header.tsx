import useRepoStore, { Folder, Note } from "@/store/repoStore";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Input } from "./ui/input";

export default function Header() {
  const { repository, importRepo, clearRepo } = useRepoStore();
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptyRepo =
    repository.folders.length === 0 && repository.notes.length === 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          importRepo(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setError(`Error importing file: ${error}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  function handleOpenModal() {
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
  }

  return (
    <>
      <div className="border-b border-zinc-600 h-16 flex items-center justify-between px-8">
        <div className="flex items-center space-x-1">
          <h1 className="font-semibold text-xl">
            Free Markdown Note Taking App{" "}
          </h1>
          <p className="text-zinc-300">
            {" "}
            - Download your notes to your computer
          </p>
        </div>

        <div className="space-x-4 flex">
          <Button onClick={clearRepo} variant={"secondary"}>
            New
          </Button>
          <div className="border-r " />
          {error && <p className="text-red-500">{error}</p>}
          <Button
            onClick={handleOpenModal}
            variant={"secondary"}
            disabled={emptyRepo}
          >
            Export
          </Button>

          <input
            type="file"
            accept=".notes"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button variant="secondary" onClick={handleButtonClick}>
            Import
          </Button>
        </div>
      </div>
      {openModal && (
        <Modal
          heading="Export your notes"
          subheading="Name your file and download it"
          closeModal={closeModal}
          repository={repository}
        />
      )}
    </>
  );
}

export function Modal({
  heading,
  subheading,
  children,
  closeModal,
  repository,
}: {
  heading: string;
  subheading: string;
  children?: React.ReactNode;
  closeModal: () => void;
  repository: {
    folders: Folder[];
    notes: Note[];
  };
}) {
  const [fileName, setFileName] = useState("");

  const handleExport = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(repository)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${fileName}.notes`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-4 gap-2 rounded-lg max-w-md w-full justify-center items-center flex flex-col border-2 border-zinc-500">
        <h1 className="font-bold">{heading}</h1>
        <h1 className="text-zinc-400">{subheading}</h1>
        <div>{children}</div>
        <Input
          placeholder="Your notes"
          onChange={(e) => setFileName(e.target.value)}
          className="w-1/2"
        />
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button onClick={closeModal} variant={"destructive"}>
            Close
          </Button>
          <Button
            disabled={fileName === ""}
            variant={"secondary"}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
