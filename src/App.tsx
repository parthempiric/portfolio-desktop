import { Button } from '@/components/ui/button'
import { useCounterStore } from '@/store/counter'

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Portfolio Desktop
        </h1>
        <p className="text-muted-foreground">
          React + TypeScript + shadcn/ui + Zustand
        </p>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={decrement}>-</Button>
          <span className="text-2xl font-mono w-12 text-center">{count}</span>
          <Button variant="outline" onClick={increment}>+</Button>
        </div>
        <Button variant="secondary" onClick={reset}>Reset</Button>
      </div>
    </div>
  )
}

export default App
