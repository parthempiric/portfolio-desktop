import { FileText } from "lucide-react";

export default function FolderView() {
  const items = [
    { name: "project-1-info.txt", type: "file" },
    { name: "project-2-info.txt", type: "file" },
  ];

  return (
    <div className="h-full bg-[#1e1e2e] text-white/80 text-[13px] p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <span className="text-white/40">Projects /</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <FileText size={32} className="text-blue-300" />
            <span className="text-[11px] text-center text-white/60">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
