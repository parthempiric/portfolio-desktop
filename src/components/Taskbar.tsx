import { cn } from '@/lib/utils'
import { useWindowStore } from '@/store/window'

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows)
  const focusedId = useWindowStore((s) => s.focusedId)
  const bringToFront = useWindowStore((s) => s.bringToFront)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)

  if (windows.length === 0) return null

  const handleClick = (id: string, minimized: boolean) => {
    if (minimized) {
      restoreWindow(id)
    } else if (focusedId === id) {
      minimizeWindow(id)
    } else {
      bringToFront(id)
    }
  }

  return (
    <div className="absolute bottom-0 left-0 z-[9999] flex w-full items-center gap-1 border-t border-border bg-muted/80 px-2 py-1.5 backdrop-blur-sm">
      {windows.map((win) => (
        <button
          key={win.id}
          onClick={() => handleClick(win.id, win.minimized)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            focusedId === win.id && !win.minimized
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            win.minimized && 'opacity-60',
          )}
        >
          {win.title}
        </button>
      ))}
    </div>
  )
}
