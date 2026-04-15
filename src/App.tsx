import { useEffect } from 'react'
import { WindowLayer } from '@/components/WindowLayer'
import { TopPanel } from '@/components/TopPanel'
import { Dock } from '@/components/Dock'
import { useWindowStore } from '@/store/window'
import { useSettingsStore, ACCENT_COLORS, applyAccent } from '@/store/settings'
import { useTheme } from '@/components/theme-provider'

function App() {
  const blurAll = useWindowStore((s) => s.blurAll)
  const clampToViewport = useWindowStore((s) => s.clampToViewport)
  const wallpaper = useSettingsStore((s) => s.wallpaper)
  const accentIndex = useSettingsStore((s) => s.accentIndex)
  const { theme } = useTheme()

  useEffect(() => {
    const onResize = () => clampToViewport(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampToViewport])

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    applyAccent(ACCENT_COLORS[accentIndex], isDark)
  }, [theme, accentIndex])

  return (
    <div
      className="relative h-svh w-full overflow-hidden bg-background bg-cover bg-center"
      style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : undefined}
      onPointerDown={blurAll}
    >
      {/* GNOME top panel */}
      <TopPanel />

      {/* Window layer */}
      <WindowLayer />

      {/* GNOME dock */}
      <Dock />
    </div>
  )
}

export default App
