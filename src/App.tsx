import Input from "./components/input";
import Sidebar from "./components/sidebar";

export default function App() {
  return (
    <div className="w-full h-lvh flex">
      <Sidebar />
      <Input />
    </div>
  );
}
