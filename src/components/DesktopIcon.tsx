import { FileText, Folder } from "lucide-react";
import type { DesktopItem } from "../data/desktopItems";

interface DesktopIconProps {
  item: DesktopItem;
  onClick: (item: DesktopItem) => void;
}

export default function DesktopIcon({ item, onClick }: DesktopIconProps) {
  const Icon = item.type === "folder" ? Folder : FileText;

  return (
    <button
      onDoubleClick={() => onClick(item)}
      className="desktop-icon flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer w-[90px] border-none bg-transparent"
    >
      <Icon
        size={40}
        className={
          item.type === "folder" ? "text-yellow-400" : "text-blue-300"
        }
        fill={item.type === "folder" ? "currentColor" : "none"}
      />
      <span className="text-[11px] text-white text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {item.name}
      </span>
    </button>
  );
}
