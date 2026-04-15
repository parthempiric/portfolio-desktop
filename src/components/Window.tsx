import React, { useState, useRef, useCallback } from "react";
import { X, Minus, Square } from "lucide-react";
import { useWindowStore } from "../store/windowStore";
import type { WindowData } from "../store/windowStore";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

type ResizeDir = "e" | "s" | "se" | "w" | "n" | "nw" | "ne" | "sw";

const Window = React.memo(function Window({
  id,
  title,
  Component,
  props,
  x,
  y,
  width,
  height,
  zIndex,
}: WindowData) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const bringToFront = useWindowStore((s) => s.bringToFront);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);

  const [pos, setPos] = useState({ x, y });
  const [size, setSize] = useState({ w: width, h: height });
  const posRef = useRef(pos);
  const sizeRef = useRef(size);

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const move = (ev: MouseEvent) => {
      const newPos = { x: ev.clientX - startX, y: ev.clientY - startY };
      posRef.current = newPos;
      setPos(newPos);
    };

    const up = () => {
      updatePosition(id, posRef.current.x, posRef.current.y);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, dir: ResizeDir) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = sizeRef.current.w;
      const startH = sizeRef.current.h;
      const startPosX = posRef.current.x;
      const startPosY = posRef.current.y;

      const move = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let newW = startW;
        let newH = startH;
        let newX = startPosX;
        let newY = startPosY;

        if (dir.includes("e")) newW = Math.max(MIN_WIDTH, startW + dx);
        if (dir.includes("s")) newH = Math.max(MIN_HEIGHT, startH + dy);
        if (dir.includes("w")) {
          newW = Math.max(MIN_WIDTH, startW - dx);
          if (newW > MIN_WIDTH) newX = startPosX + dx;
        }
        if (dir.includes("n")) {
          newH = Math.max(MIN_HEIGHT, startH - dy);
          if (newH > MIN_HEIGHT) newY = startPosY + dy;
        }

        sizeRef.current = { w: newW, h: newH };
        posRef.current = { x: newX, y: newY };
        setSize({ w: newW, h: newH });
        setPos({ x: newX, y: newY });
      };

      const up = () => {
        updateSize(id, sizeRef.current.w, sizeRef.current.h);
        updatePosition(id, posRef.current.x, posRef.current.y);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };

      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [id, updateSize, updatePosition]
  );

  return (
    <div
      className="absolute rounded-lg overflow-visible fluent-shadow-lg"
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex,
      }}
      onMouseDown={() => bringToFront(id)}
    >
      {/* Window content wrapper with clipping */}
      <div className="w-full h-full rounded-lg overflow-hidden">
        {/* Title Bar */}
        <div
          onMouseDown={handleDragStart}
          className="fluent-glass-dark h-10 flex items-center justify-between px-2 cursor-move select-none"
        >
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => closeWindow(id)}
              className="window-btn-icon window-btn-icon-close"
              aria-label="Close"
            >
              <X size={14} strokeWidth={2} />
            </button>
            <button
              onClick={() => minimizeWindow(id)}
              className="window-btn-icon window-btn-icon-minimize"
              aria-label="Minimize"
            >
              <Minus size={14} strokeWidth={2} />
            </button>
            <button
              className="window-btn-icon window-btn-icon-maximize"
              aria-label="Maximize"
            >
              <Square size={10} strokeWidth={2} />
            </button>
          </div>
          <span className="text-white/70 text-[12px] font-medium absolute left-1/2 -translate-x-1/2 truncate max-w-[60%]">
            {title}
          </span>
          <div className="w-[72px]" />
        </div>

        {/* Content */}
        <div
          className="bg-[#1e1e2e]/95 backdrop-blur-sm overflow-auto"
          style={{ height: size.h - 40 }}
        >
          <Component {...props} windowId={id} />
        </div>
      </div>

      {/* Resize handles */}
      <div onMouseDown={(e) => handleResizeStart(e, "e")} className="absolute top-0 -right-1 w-2 h-full cursor-e-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "s")} className="absolute -bottom-1 left-0 w-full h-2 cursor-s-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "w")} className="absolute top-0 -left-1 w-2 h-full cursor-w-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "n")} className="absolute -top-1 left-0 w-full h-2 cursor-n-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "se")} className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "sw")} className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "ne")} className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize" />
      <div onMouseDown={(e) => handleResizeStart(e, "nw")} className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize" />
    </div>
  );
});

export default Window;
