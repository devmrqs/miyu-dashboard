import { useState, type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap select-none">
          <div className="bg-ink text-white text-xs font-bold px-3 py-1.5 rounded-lg border-0.5 border-ink shadow-[3px_3px_0_var(--color-miyu-pink-dark)]">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
