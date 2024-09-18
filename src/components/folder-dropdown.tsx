import { useState, useRef, useEffect } from "react";
import DropdownIcon from "./icons/dropdown-icon";

export default function FolderDropdown() {
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
    <div className="relative " ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        <DropdownIcon isOpen={isOpen} />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 bg-zinc-900 border z-10 border-zinc-700 rounded-md shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="py-1">
          <li>
            <div className="block px-4 py-2 hover:bg-zinc-800">Create Note</div>
          </li>
          <li>
            <div className="block px-4 py-2 hover:bg-zinc-800">
              Create Subfolder
            </div>
          </li>
          <li>
            <div className="block px-4 py-2 hover:bg-zinc-800">
              Rename Folder
            </div>
          </li>
          <li>
            <div className="block px-4 py-2 hover:bg-zinc-800 hover:text-red-500 transition-colors">
              Delete Folder
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
