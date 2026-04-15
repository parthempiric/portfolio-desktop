export default function AboutApp() {
  return (
    <div className="h-full bg-[#1e1e2e] text-white/80 text-[13px] p-6 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
        P
      </div>
      <h2 className="text-xl font-semibold text-white mb-1">Parth</h2>
      <p className="text-white/40 mb-4">Full-Stack Developer</p>

      <div className="space-y-2 text-[12px] text-white/50">
        <p>Built with React + TypeScript + Tailwind</p>
        <p>Window Manager powered by Zustand</p>
        <p>Fluent Design System inspired</p>
      </div>

      <div className="mt-6 text-[11px] text-white/30">
        Portfolio Desktop v1.0
      </div>
    </div>
  );
}
