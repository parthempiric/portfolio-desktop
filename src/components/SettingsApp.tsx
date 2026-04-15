import { Monitor, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import {
  useSettingsStore,
  ACCENT_COLORS,
  WALLPAPERS,
  applyAccent,
} from '@/store/settings'

export function SettingsApp() {
  const { theme, setTheme } = useTheme()
  const { wallpaper, setWallpaper, accentIndex, setAccentIndex } =
    useSettingsStore()

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  const handleAccent = (i: number) => {
    setAccentIndex(i)
    applyAccent(ACCENT_COLORS[i], isDark)
  }

  const handleTheme = (t: 'light' | 'dark' | 'system') => {
    setTheme(t)
    const willBeDark =
      t === 'dark' ||
      (t === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    applyAccent(ACCENT_COLORS[accentIndex], willBeDark)
  }

  return (
    <div className="space-y-5 text-sm">
      {/* Theme */}
      <section className="space-y-2">
        <h3 className="font-semibold">Theme</h3>
        <div className="flex gap-2">
          {([
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Monitor, label: 'System' },
          ] as const).map(({ value, icon: Icon, label }) => (
            <Button
              key={value}
              variant={theme === value ? 'default' : 'outline'}
              onClick={() => handleTheme(value)}
            >
              <Icon className="size-3.5" />
              {label}
            </Button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section className="space-y-2">
        <h3 className="font-semibold">Accent Color</h3>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((color, i) => (
            <button
              key={color.name}
              onClick={() => handleAccent(i)}
              title={color.name}
              className={cn(
                'size-7 rounded-full border-2 transition-transform hover:scale-110',
                accentIndex === i
                  ? 'border-foreground scale-110'
                  : 'border-transparent',
              )}
              style={{ background: isDark ? color.dark : color.light }}
            />
          ))}
        </div>
      </section>

      {/* Wallpaper */}
      <section className="space-y-2">
        <h3 className="font-semibold">Wallpaper</h3>
        <div className="flex gap-2">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.name}
              onClick={() => setWallpaper(wp.url)}
              className={cn(
                'h-16 w-24 overflow-hidden rounded-md border-2 transition-transform hover:scale-105',
                wallpaper === wp.url
                  ? 'border-primary'
                  : 'border-border',
              )}
            >
              {wp.url ? (
                <img
                  src={wp.url}
                  alt={wp.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  None
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
