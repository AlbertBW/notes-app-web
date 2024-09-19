export default function DropdownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-6 ${
          isOpen && "-translate-y-1"
        } transition-all absolute ${!isOpen && "hidden"} group-hover:block `}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`size-6 ${isOpen && "translate-y-1"} transition-all ${
          !isOpen && "hidden"
        } group-hover:block`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
      <div
        className={`w-6 h-6 transition ${
          !isOpen ? "block" : "hidden"
        } group-hover:hidden`}
      />
    </>
  );
}
