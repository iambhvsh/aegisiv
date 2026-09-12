export function Spinner({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <svg className={`spinner animate-spin text-slate-400 ${className}`} viewBox="0 0 50 50" width="50" height="50">
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <line x1="25" y1="10" x2="25" y2="18" opacity="1" transform="rotate(0 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.91" transform="rotate(30 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.83" transform="rotate(60 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.75" transform="rotate(90 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.66" transform="rotate(120 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.58" transform="rotate(150 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.5" transform="rotate(180 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.41" transform="rotate(210 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.33" transform="rotate(240 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.25" transform="rotate(270 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.16" transform="rotate(300 25 25)" />
        <line x1="25" y1="10" x2="25" y2="18" opacity="0.08" transform="rotate(330 25 25)" />
      </g>
    </svg>
  );
}
