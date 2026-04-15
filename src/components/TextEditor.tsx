import { useState } from "react";

interface TextEditorProps {
  fileName: string;
  initialContent: string;
}

export default function TextEditor({ fileName, initialContent }: TextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const lineCount = content.split("\n").length;

  return (
    <div className="h-full flex flex-col text-[13px] font-mono">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-[#181825] border-b border-white/5 text-white/50 text-[11px]">
        <span className="text-white/80">{fileName}</span>
        <span className="ml-auto">Lines: {lineCount}</span>
      </div>

      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="py-2 px-2 text-right text-white/20 text-[12px] leading-[1.6] select-none bg-[#11111b] min-w-[40px]">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent text-[#cdd6f4] p-2 resize-none outline-none text-[12px] leading-[1.6] font-mono border-none"
        />
      </div>
    </div>
  );
}
