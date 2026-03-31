export function TopoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="topo-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Topographic contour lines */}
            <path
              d="M 0 100 Q 50 80 100 100 Q 150 120 200 100"
              fill="none" stroke="#94a3b8" strokeWidth="0.5"
            />
            <path
              d="M 0 60 Q 40 40 80 55 Q 120 70 160 50 Q 190 35 200 60"
              fill="none" stroke="#94a3b8" strokeWidth="0.5"
            />
            <path
              d="M 0 140 Q 60 160 100 145 Q 140 130 200 150"
              fill="none" stroke="#94a3b8" strokeWidth="0.5"
            />
            <path
              d="M 20 0 Q 30 40 50 80 Q 70 120 60 160 Q 50 180 40 200"
              fill="none" stroke="#94a3b8" strokeWidth="0.3"
            />
            <path
              d="M 120 0 Q 140 50 130 100 Q 120 150 140 200"
              fill="none" stroke="#94a3b8" strokeWidth="0.3"
            />
            <circle cx="100" cy="100" r="30" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#94a3b8" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo-pattern)" />
      </svg>
    </div>
  )
}
