import { useState, useEffect } from "react";
import { Wifi, Battery, Volume2, Search, LayoutGrid } from "lucide-react";

export default function TopPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="fluent-glass-dark fixed top-0 left-0 right-0 h-7 z-[9999] flex items-center justify-between px-5 text-white/80 text-[11px] select-none">
      {/* Left: Grid icon */}
      <div className="flex items-center gap-3">
        <LayoutGrid size={12} className="cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Center: Date & Time */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>

      {/* Right: System tray */}
      <div className="flex items-center gap-2.5">
        <Search size={12} className="cursor-pointer hover:text-white transition-colors" />
        <Wifi size={12} />
        <Volume2 size={12} />
        <Battery size={12} />
      </div>
    </div>
  );
}
