import { Button } from "@base-ui/react"
import { useState } from "react"

const files = [
  { name: 'resume.pdf', size: '2.4 MB' },
  { name: 'project-notes.md', size: '12 KB' },
  { name: 'screenshot.png', size: '840 KB' },
]

export function FileApp() {

  const [c, setC] = useState(0)

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
        >
          <span>{file.name}</span>
          <span className="text-muted-foreground">{file.size}</span>
        </div>
      ))}
      <Button onClick={() => setC(c + 1)}>Click me {c}</Button>
    </div>
  )
}
