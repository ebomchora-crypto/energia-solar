export default function PanelsStatic() {
  const rows = Array.from({ length: 3 });
  const cols = Array.from({ length: 4 });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      <div
        className="grid gap-3 opacity-90"
        style={{
          gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`,
          transform: "rotateX(55deg) rotateZ(-8deg) scale(1.3)",
          transformStyle: "preserve-3d",
        }}
      >
        {rows.map((_, r) =>
          cols.map((__, c) => (
            <div
              key={`${r}-${c}`}
              className="relative h-16 w-24 overflow-hidden rounded-[2px] border border-solar/20 bg-gradient-to-br from-[#17324a] to-[#0c1a24] shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              style={{
                animation: `panel-shimmer 5s ease-in-out ${(r + c) * 0.25}s infinite`,
              }}
            >
              <div className="absolute inset-0 grid grid-cols-3 gap-px opacity-40">
                {Array.from({ length: 9 }).map((___, i) => (
                  <div key={i} className="bg-solar/10" />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes panel-shimmer {
          0%, 100% { box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 8px 30px rgba(244,197,66,0.25); }
        }
      `}</style>
    </div>
  );
}
