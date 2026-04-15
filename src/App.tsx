import { useCallback } from "react";
import TopPanel from "./components/TopPanel";
import Dock from "./components/Dock";
import Desktop from "./components/Desktop";
import WindowLayer from "./components/WindowLayer";
import TextEditor from "./components/TextEditor";
import FolderView from "./components/FolderView";
import TerminalApp from "./components/TerminalApp";
import BrowserApp from "./components/BrowserApp";
import SettingsApp from "./components/SettingsApp";
import AboutApp from "./components/AboutApp";
import { useWindowStore } from "./store/windowStore";
import type { DesktopItem } from "./data/desktopItems";
import type { ComponentType } from "react";

export default function App() {
  const createWindow = useWindowStore((s) => s.createWindow);

  const handleDesktopItemClick = useCallback(
    (item: DesktopItem) => {
      if (item.type === "file") {
        createWindow(
          item.name,
          TextEditor,
          { fileName: item.name, initialContent: item.content ?? "" },
          { width: 550, height: 420 }
        );
      } else if (item.type === "folder") {
        createWindow(item.name, FolderView, {}, { width: 400, height: 350 });
      }
    },
    [createWindow]
  );

  const handleDockAppClick = useCallback(
    (appId: string) => {
      const appMap: Record<string, { name: string; component: ComponentType; w: number; h: number }> = {
        terminal: { name: "Terminal", component: TerminalApp, w: 520, h: 360 },
        browser: { name: "Browser", component: BrowserApp, w: 600, h: 450 },
        settings: { name: "Settings", component: SettingsApp, w: 400, h: 380 },
        about: { name: "About", component: AboutApp, w: 360, h: 340 },
      };

      const config = appMap[appId];
      if (config) {
        createWindow(config.name, config.component, {}, {
          width: config.w,
          height: config.h,
          appId,
        });
      }
    },
    [createWindow]
  );

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/wallpaper.jpg')",
      }}
    >
      <TopPanel />
      <Desktop onItemClick={handleDesktopItemClick} />
      <WindowLayer />
      <Dock onAppClick={handleDockAppClick} />
    </div>
  );
}
