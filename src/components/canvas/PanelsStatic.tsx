const COLS = 4;
const ROWS = 4;

// Lightweight mobile stand-in for the WebGL panel field: CSS-perspective grid
// plus SVG energy lines, animated by GSAP (transform/opacity/stroke only).
export default function PanelsStatic() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-[56%] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="relative flex h-full w-full items-center justify-center"
        style={{ perspective: "720px" }}
      >
        <div
          className="ps-grid relative grid w-[92%] max-w-md gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            transform: "rotateX(40deg) rotateZ(-1deg) scale(1.02)",
            willChange: "transform",
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => (
            <div
              key={i}
              className="ps-panel relative aspect-[1.5/1] overflow-hidden rounded-[2px]"
              style={{
                background:
                  "linear-gradient(135deg, #123a62 0%, #2b6ea8 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(160,176,188,0.55), 0 10px 22px rgba(0,0,0,0.55)",
              }}
            >
              <span
                className="absolute inset-[3px]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(190,210,228,0.34) 1px, transparent 1px), linear-gradient(0deg, rgba(190,210,228,0.34) 1px, transparent 1px)",
                  backgroundSize: "25% 20%",
                }}
              />
            </div>
          ))}
          <span
            className="ps-gloss pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,226,160,0.5) 50%, transparent 62%)",
              transform: "translateX(-120%)",
            }}
          />
          <span
            className="ps-glint pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 42%, rgba(255,235,190,0.28) 50%, transparent 58%)",
            }}
          />
        </div>
      </div>

      <svg
        className="absolute inset-x-0 bottom-0 h-[34%] w-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        {[12, 32, 50, 68, 88].map((x, i) => (
          <path
            key={x}
            className="ps-line"
            d={`M ${x} 0 C ${x} 18, 50 14, 50 40`}
            fill="none"
            stroke="#f4c542"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            opacity={0.85 - i * 0.05}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-dark to-transparent" />
    </div>
  );
}
