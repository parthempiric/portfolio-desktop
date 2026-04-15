import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { useWindowStore } from "../store/windowStore";

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

const DEFAULT_URL = "https://parth.dev";

export default function BrowserApp({ windowId }: { windowId?: string }) {
  const setWindowTitle = useWindowStore((s) => s.setWindowTitle);

  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [history, setHistory] = useState<string[]>([DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  const navigate = useCallback(
    (url: string) => {
      const normalized = normalizeUrl(url);
      if (!normalized) return;

      setCurrentUrl(normalized);
      setUrlInput(normalized);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), normalized]);
      setHistoryIndex((prev) => prev + 1);
      setIframeKey((k) => k + 1);

      if (windowId) {
        setWindowTitle(windowId, `Browser - ${getHostname(normalized)}`);
      }
    },
    [historyIndex, windowId, setWindowTitle]
  );

  const goBack = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const url = history[newIndex];
    setHistoryIndex(newIndex);
    setCurrentUrl(url);
    setUrlInput(url);
    setIframeKey((k) => k + 1);
    if (windowId) {
      setWindowTitle(windowId, `Browser - ${getHostname(url)}`);
    }
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const url = history[newIndex];
    setHistoryIndex(newIndex);
    setCurrentUrl(url);
    setUrlInput(url);
    setIframeKey((k) => k + 1);
    if (windowId) {
      setWindowTitle(windowId, `Browser - ${getHostname(url)}`);
    }
  };

  const reload = () => {
    setIframeKey((k) => k + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(urlInput);
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e]">
      {/* Navigation Bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#181825] border-b border-white/5">
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-25 transition-colors"
        >
          <ArrowLeft size={14} className="text-white/70" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-1 rounded hover:bg-white/10 disabled:opacity-25 transition-colors"
        >
          <ArrowRight size={14} className="text-white/70" />
        </button>
        <button
          onClick={reload}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <RotateCw size={13} className="text-white/70" />
        </button>
        <form onSubmit={handleSubmit} className="flex-1 ml-1">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-[#11111b] rounded-md px-3 py-1 text-white/80 text-[12px] outline-none border border-white/5 focus:border-white/15 transition-colors"
            placeholder="Enter URL..."
          />
        </form>
      </div>

      {/* iframe Content */}
      <div className="flex-1 relative bg-[#11111b]">
        <iframe
          key={iframeKey}
          src={currentUrl}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          title="Browser"
        />
      </div>
    </div>
  );
}
