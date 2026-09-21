import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface AccentColorPickerProps {
  value: string | null;
  onChange: (color: string | null) => void;
}

const PRESET_COLORS = [
  "#f4879a",
  "#4ecdc4",
  "#45b7d1",
  "#ffd93d",
  "#a78bfa",
  "#2b2622",
];

function AccentColorPicker({ value, onChange }: AccentColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-bold text-ink">Cor de destaque:</span>

      <button
        onClick={() => onChange(null)}
        className={`w-8 h-8 rounded-lg border-0.5 border-ink bg-white flex items-center justify-center text-xs font-bold shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${
          value === null ? "ring-2 ring-offset-2 ring-ink" : ""
        }`}
        title="Sem cor"
      >
        ✕
      </button>

      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-lg border-0.5 border-ink shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${
            value === color ? "ring-2 ring-offset-2 ring-ink" : ""
          }`}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}

      <div className="relative" ref={popoverRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-lg border-0.5 border-ink shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all overflow-hidden flex items-center justify-center p-0.5"
          title="Cor customizada"
        >
          <div
            className="w-full h-full rounded-md border-0.5 border-ink/20"
            style={{ backgroundColor: value ?? "#f4879a" }}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 p-3 bg-white border-0.5 border-ink rounded-xl shadow-[4px_4px_0_var(--color-ink)]">
            <HexColorPicker color={value ?? "#f4879a"} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AccentColorPicker;
