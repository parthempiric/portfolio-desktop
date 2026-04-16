import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AccentColor {
  name: string
  light: string
  dark: string
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Purple', light: '#7033ff', dark: '#813d9c' },
  { name: 'Blue', light: '#2563eb', dark: '#3b82f6' },
  { name: 'Red', light: '#dc2626', dark: '#ef4444' },
  { name: 'Orange', light: '#ea580c', dark: '#f97316' },
  { name: 'Pink', light: '#db2777', dark: '#ec4899' },
  { name: 'Yellow', light: '#ca8a04', dark: '#eab308' },
]

export const WALLPAPERS = [
  { name: 'Abstract', url: "./StockCake-Pixel_Mountain_Sunset-3325121-standard.jpg" },
  { name: 'Pixel Night', url: '/default.jpg' },
  { name: 'No Air', url: "./1600w-LEFL5_yVCqY.webp" },
  { name: 'None', url: '' },
]

export type FontMode = 'sans' | 'mono'

interface SettingsStore {
  wallpaper: string
  accentIndex: number
  fontMode: FontMode
  setWallpaper: (url: string) => void
  setAccentIndex: (index: number) => void
  setFontMode: (mode: FontMode) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      wallpaper: '/default.jpg',
      accentIndex: 0,
      fontMode: 'sans',
      setWallpaper: (url) => set({ wallpaper: url }),
      setAccentIndex: (index) => set({ accentIndex: index }),
      setFontMode: (mode) => set({ fontMode: mode }),
    }),
    { name: 'desktop-settings' },
  ),
)

export function applyFontMode(mode: FontMode) {
  const root = document.documentElement
  root.classList.toggle('font-mono-mode', mode === 'mono')
}

export function applyAccent(accent: AccentColor, isDark: boolean) {
  const color = isDark ? accent.dark : accent.light
  const root = document.documentElement
  root.style.setProperty('--primary', color)
  root.style.setProperty('--ring', color)
  root.style.setProperty('--accent-foreground', color)
  root.style.setProperty('--sidebar-primary', color)
  root.style.setProperty('--sidebar-accent-foreground', color)
  root.style.setProperty('--sidebar-ring', color)
}
