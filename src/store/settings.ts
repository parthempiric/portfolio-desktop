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
  { name: 'Pixel Night', url: '/default.jpg' },
  { name: 'None', url: '' },
]

interface SettingsStore {
  wallpaper: string
  accentIndex: number
  setWallpaper: (url: string) => void
  setAccentIndex: (index: number) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      wallpaper: '/default.jpg',
      accentIndex: 0,
      setWallpaper: (url) => set({ wallpaper: url }),
      setAccentIndex: (index) => set({ accentIndex: index }),
    }),
    { name: 'desktop-settings' },
  ),
)

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
