interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-500 tabular-nums min-w-[3rem] text-right">
          {current} / {total}
        </span>
      </div>
    </div>
  );
}
