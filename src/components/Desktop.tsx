import DesktopIcon from "./DesktopIcon";
import { desktopItems } from "../data/desktopItems";
import type { DesktopItem } from "../data/desktopItems";

interface DesktopProps {
  onItemClick: (item: DesktopItem) => void;
}

export default function Desktop({ onItemClick }: DesktopProps) {
  return (
    <div className="absolute top-10 left-4 bottom-20 w-[100px] flex flex-col flex-wrap gap-1 content-start">
      {desktopItems.map((item) => (
        <DesktopIcon key={item.id} item={item} onClick={onItemClick} />
      ))}
    </div>
  );
}
