import { create } from "zustand";
import type { ComponentType } from "react";

export interface WindowData {
  id: string;
  title: string;
  Component: ComponentType<any>;
  props: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  appId?: string;
}

interface CreateWindowOptions {
  width?: number;
  height?: number;
  appId?: string;
}

interface WindowStore {
  windows: WindowData[];
  topZIndex: number;
  createWindow: (
    title: string,
    Component: ComponentType<any>,
    props?: Record<string, unknown>,
    options?: CreateWindowOptions
  ) => void;
  closeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  setWindowTitle: (id: string, title: string) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  topZIndex: 1,

  createWindow: (title, Component, props = {}, options = {}) =>
    set((state) => {
      const nextZ = state.topZIndex + 1;
      const lastWindow = state.windows[state.windows.length - 1];
      const x = lastWindow ? lastWindow.x + 30 : 100;
      const y = lastWindow ? lastWindow.y + 30 : 100;

      return {
        topZIndex: nextZ,
        windows: [
          ...state.windows,
          {
            id: crypto.randomUUID(),
            title,
            Component,
            props,
            x,
            y,
            width: options.width ?? 500,
            height: options.height ?? 400,
            zIndex: nextZ,
            minimized: false,
            appId: options.appId,
          },
        ],
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  updatePosition: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y } : w
      ),
    })),

  bringToFront: (id) =>
    set((state) => {
      const nextZ = state.topZIndex + 1;
      return {
        topZIndex: nextZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: nextZ } : w
        ),
      };
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),

  restoreWindow: (id) =>
    set((state) => {
      const nextZ = state.topZIndex + 1;
      return {
        topZIndex: nextZ,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w
        ),
      };
    }),

  toggleMinimize: (id) =>
    set((state) => {
      const win = state.windows.find((w) => w.id === id);
      if (!win) return state;

      if (win.minimized) {
        const nextZ = state.topZIndex + 1;
        return {
          topZIndex: nextZ,
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w
          ),
        };
      }
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, minimized: true } : w
        ),
      };
    }),

  setWindowTitle: (id, title) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, title } : w
      ),
    })),

  updateSize: (id, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height } : w
      ),
    })),
}));
