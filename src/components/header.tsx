import useRepoStore from "@/store/repoStore";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Input } from "./ui/input";

export default function Header() {
  const { repository, importRepo, clearRepo } = useRepoStore();
  const [exportModal, setExportModal] = useState(false);
  const [newModal, setNewModal] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const emptyRepo =
    repository.subfolders.length === 0 && repository.notes.length === 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          importRepo(json);
          setError(null);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setError(`Error: Could not open file.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportNotes = () => {
    fileInputRef.current?.click();
  };

  function closeExportModal() {
    setExportModal(false);
  }

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
    closeExportModal();
  };

  function handleClearRepo() {
    clearRepo();
    setNewModal(false);
  }

  return (
    <>
      <div className="border-b border-zinc-600 h-16 flex items-center justify-between px-8">
        <div className="flex items-center space-x-8">
          <h1 className="font-semibold text-xl p-2">
            Free Markdown Note Taking
          </h1>
          <p className="text-zinc-400"> Download your notes to your computer</p>
        </div>

        <div className="space-x-4 flex">
          {error && <p className="text-red-500 flex items-center">{error}</p>}
          <Button
            onClick={() => setNewModal(true)}
            variant={"secondary"}
            disabled={emptyRepo}
          >
            New
          </Button>
          <div className="border-r " />
          <Button
            onClick={() => setExportModal(true)}
            variant={"secondary"}
            disabled={emptyRepo}
          >
            Save as (.notes file)
          </Button>

          <input
            type="file"
            accept=".notes"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              handleFileChange(e);
              setImportModal(false);
            }}
          />
          <Button variant="secondary" onClick={() => setImportModal(true)}>
            Open (.notes file)
          </Button>
        </div>
      </div>
      {newModal && (
        <Modal
          heading="Create a new notes repository"
          subheading="Are you sure?"
          warning="This will delete your notes permanently. Export them first!"
          destructionButtonText="Confirm"
          standardButtonText="Cancel"
          onDestruction={handleClearRepo}
          onConfirmation={() => setNewModal(false)}
        />
      )}
      {exportModal && (
        <Modal
          heading="Save your notes to your computer"
          subheading="Name your file and download it"
          destructionButtonText="Cancel"
          standardButtonText="Save File"
          onDestruction={closeExportModal}
          onConfirmation={handleExport}
          disabled={fileName === ""}
          input={setFileName}
          inputPlaceholder="File Name"
        />
      )}
      {importModal && (
        <Modal
          heading="Import your notes"
          subheading="Select a .notes file to open"
          warning="This will overwrite your current notes"
          destructionButtonText="Cancel"
          standardButtonText="Select a file"
          onDestruction={() => setImportModal(false)}
          onConfirmation={handleImportNotes}
        />
      )}
    </>
  );
}

export function Modal({
  heading,
  subheading,
  warning,
  children,
  destructionButtonText,
  standardButtonText,
  onDestruction,
  onConfirmation,
  input,
  inputPlaceholder,
  disabled,
}: {
  heading: string;
  subheading: string;
  warning?: string;
  children?: React.ReactNode;
  destructionButtonText?: string;
  standardButtonText?: string;
  onDestruction?: () => void;
  onConfirmation?: () => void;
  input?: (value: string) => void;
  inputPlaceholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-4 gap-2 rounded-lg max-w-md w-full justify-center items-center flex flex-col border-2 border-zinc-500">
        <h1 className="font-bold">{heading}</h1>
        <h2 className="text-zinc-400">{subheading}</h2>
        {warning && <p className="text-red-500 text-center">{warning}</p>}
        <div>{children}</div>
        {input && (
          <Input
            placeholder={inputPlaceholder || ""}
            onChange={(e) => input(e.target.value)}
            className="w-1/2"
          />
        )}
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button onClick={onDestruction} variant={"destructive"}>
            {destructionButtonText || "Cancel"}
          </Button>
          <Button
            disabled={disabled}
            variant={"secondary"}
            onClick={onConfirmation}
          >
            {standardButtonText || "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
