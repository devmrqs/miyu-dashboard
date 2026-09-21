import { useState, type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "right";
}

const POSITION_CLASSES = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

function Tooltip({ text, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 whitespace-nowrap ${POSITION_CLASSES[position]}`}
        >
          <div className="bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-lg border-0.5 border-ink shadow-[3px_3px_0_var(--color-miyu-pink-dark)]">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
