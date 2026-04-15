import { useEffect } from 'react'
import { FileText, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WindowLayer } from '@/components/WindowLayer'
import { Taskbar } from '@/components/Taskbar'
import { FileApp } from '@/components/FileApp'
import { AboutApp } from '@/components/AboutApp'
import { useWindowStore } from '@/store/window'

function App() {
  const createWindow = useWindowStore((s) => s.createWindow)
  const blurAll = useWindowStore((s) => s.blurAll)
  const clampToViewport = useWindowStore((s) => s.clampToViewport)

  useEffect(() => {
    const onResize = () => clampToViewport(window.innerWidth, window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [clampToViewport])

  return (
    <div
      className="relative h-svh w-full overflow-hidden"
      onPointerDown={blurAll}
    >
      {/* Dashboard buttons */}
      <div className="flex gap-3 p-4" onPointerDown={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          onClick={() => createWindow('Files', FileApp)}
        >
          <FileText />
          Open Files
        </Button>
        <Button
          variant="outline"
          onClick={() => createWindow('About', AboutApp)}
        >
          <Info />
          Open About
        </Button>
      </div>

      {/* Window layer */}
      <WindowLayer />

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}

export default App
