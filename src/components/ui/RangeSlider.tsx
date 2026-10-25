"use client";

type RangeSliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  valueLabel: string;
  theme?: "light" | "dark";
};

export default function RangeSlider({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  valueLabel,
  theme = "light",
}: RangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const trackColor = theme === "light" ? "rgba(24,33,29,0.12)" : "rgba(245,245,239,0.14)";

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium leading-snug">
          {label}
        </label>
        <span className="font-display shrink-0 whitespace-nowrap text-xl tabular-nums text-solar-deep">
          {valueLabel}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input w-full"
        style={{
          background: `linear-gradient(90deg, #f4c542 0%, #f4c542 ${percent}%, ${trackColor} ${percent}%, ${trackColor} 100%)`,
        }}
      />
    </div>
  );
}
