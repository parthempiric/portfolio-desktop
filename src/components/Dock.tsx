import { Terminal, Globe, Settings, Info, FileText, Folder } from "lucide-react";
import { dockApps } from "../data/desktopItems";
import { useWindowStore } from "../store/windowStore";

const iconMap: Record<string, typeof Terminal> = {
  terminal: Terminal,
  browser: Globe,
  settings: Settings,
  info: Info,
};

interface DockProps {
  onAppClick: (appId: string) => void;
}

export default function Dock({ onAppClick }: DockProps) {
  const windows = useWindowStore((s) => s.windows);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const bringToFront = useWindowStore((s) => s.bringToFront);

  const pinnedAppIds = new Set(dockApps.map((a) => a.id));

  const handlePinnedClick = (appId: string) => {
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      if (existing.minimized) {
        toggleMinimize(existing.id);
      } else {
        bringToFront(existing.id);
      }
    } else {
      onAppClick(appId);
    }
  };

  const handleOpenWindowClick = (windowId: string) => {
    toggleMinimize(windowId);
  };

  const nonPinnedWindows = windows.filter((w) => !w.appId || !pinnedAppIds.has(w.appId));

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9998]">
      <div className="fluent-glass-dark rounded-xl px-2 py-1.5 flex items-center gap-1 fluent-shadow-lg">
        {/* Pinned apps */}
        {dockApps.map((app) => {
          const Icon = iconMap[app.icon];
          const openWindow = windows.find((w) => w.appId === app.id);
          const isOpen = !!openWindow;

          return (
            <button
              key={app.id}
              onClick={() => handlePinnedClick(app.id)}
              className="dock-item flex flex-col items-center gap-0 px-2 py-1 rounded-lg cursor-pointer border-none bg-transparent group relative"
              title={app.name}
            >
              <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Icon size={18} className="text-white/90" />
              </div>
              {isOpen && (
                <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />
              )}
              {!isOpen && <div className="w-1 h-1 mt-0.5" />}
            </button>
          );
        })}

        {/* Separator + non-pinned open windows */}
        {nonPinnedWindows.length > 0 && (
          <>
            <div className="w-px h-7 bg-white/10 mx-1" />
            {nonPinnedWindows.map((win) => (
              <button
                key={win.id}
                onClick={() => handleOpenWindowClick(win.id)}
                className="dock-item flex flex-col items-center gap-0 px-2 py-1 rounded-lg cursor-pointer border-none bg-transparent group relative"
                title={win.title}
              >
                <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                  {win.title.endsWith(".txt") ? (
                    <FileText size={18} className="text-white/90" />
                  ) : (
                    <Folder size={18} className="text-white/90" />
                  )}
                </div>
                <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
