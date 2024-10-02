import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { exportProject, Note } from "@/store/repoStore";

export default function ExportMenu({
  emptyRepo,
  note,
}: {
  emptyRepo: boolean;
  note: Note | null;
}) {
  const [exportOptionsVisible, setExportOptionsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setExportOptionsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExportFile = () => {
    if (!note) throw new Error("No note selected");

    const dataStr = `data:text/markdown;charset=utf-8,${encodeURIComponent(
      note.content
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${note.name}.md`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportProject = () => {
    exportProject();
  };

  return (
    <div className="relative">
      <Button
        variant={"secondary"}
        onClick={() => setExportOptionsVisible((prev) => !prev)}
        // disabled={emptyRepo}
      >
        <p className="w-full">Export</p> <ChevronDown width={25} />
      </Button>
      {exportOptionsVisible && (
        <div
          ref={dropdownRef}
          className="absolute left-0 w-56 border-2 bg-zinc-800 text-secondary-foreground rounded-md shadow-lg z-40"
        >
          <ul>
            <Button
              variant={"secondary"}
              className="w-full rounded-none z-50"
              onClick={() => {
                handleExportFile();
                setExportOptionsVisible(false);
              }}
              disabled={!note}
            >
              Export file (Markdown)
            </Button>
            <Button
              variant={"secondary"}
              className="w-full rounded-none"
              onClick={() => {
                handleExportProject();
                setExportOptionsVisible(false);
              }}
              disabled={emptyRepo}
            >
              Export Project (Zip)
            </Button>
          </ul>
        </div>
      )}
    </div>
  );
}
