export default function SettingsApp() {
  return (
    <div className="h-full bg-[#1e1e2e] text-white/80 text-[13px] p-4 overflow-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>

      <div className="space-y-3">
        <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
          <span>Theme</span>
          <span className="text-white/40">Dark (Fluent)</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
          <span>Window Manager</span>
          <span className="text-white/40">Zustand WM v1.0</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
          <span>Framework</span>
          <span className="text-white/40">React + TypeScript</span>
        </div>
        <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
          <span>Styling</span>
          <span className="text-white/40">Tailwind CSS v4</span>
        </div>
      </div>
    </div>
  );
}
