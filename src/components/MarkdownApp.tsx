import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

let mermaidCounter = 0

function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = `mermaid-${++mermaidCounter}`
    mermaid.render(id, code).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg
    }).catch(() => {
      if (ref.current) ref.current.textContent = code
    })
  }, [code])

  return <div ref={ref} className="my-4 flex justify-center" />
}

function GoatBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3001/api/goat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.text()
      })
      .then((svg) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch(() => setError(true))
  }, [code])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
        <code>{code}</code>
      </pre>
    )
  }

  return <div ref={ref} className="my-4 flex justify-center [&_svg]:max-w-full" />
}

export function MarkdownAppBase({ filePath, fileName }: { filePath: string; fileName: string }) {

  useEffect(() => {
    console.log('MarkdownApp mounted')
    return () => {
      console.log('MarkdownApp unmounted')
    }
  }, [])

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`http://localhost:3001/api/files/serve/${filePath}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch file')
        return res.text()
      })
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [filePath])

  const renderCode = useCallback(
    (props: React.ComponentProps<'code'> & { className?: string; children?: React.ReactNode }) => {
      const { className, children, ...rest } = props
      const match = /language-(\w+)/.exec(className || '')
      const code = String(children).replace(/\n$/, '')

      if (match && match[1] === 'mermaid') {
        return <MermaidBlock code={code} />
      }

      if (match && match[1] === 'goat') {
        return <GoatBlock code={code} />
      }

      if (match) {
        return (
          <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
            <code className={className} {...rest}>
              {children}
            </code>
          </pre>
        )
      }

      return (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...rest}>
          {children}
        </code>
      )
    },
    [],
  )

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Loading {fileName}...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-destructive">{error}</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-4 p-6 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: renderCode,
          h1: ({ children }) => (
            <h1 className="mb-4 border-b pb-2 text-2xl font-bold text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 border-b pb-1 text-xl font-semibold text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 text-lg font-semibold text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-1 text-base font-semibold text-foreground">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-3 text-muted-foreground">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80">
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1 text-muted-foreground marker:text-primary">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1 text-muted-foreground marker:text-primary">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-primary/50 pl-4 italic text-muted-foreground">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
          hr: () => <hr className="my-6 border-border" />,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="my-3 max-w-full rounded-lg border" />
          ),
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )

  return <></>
}

export const MarkdownApp = React.memo(MarkdownAppBase)
