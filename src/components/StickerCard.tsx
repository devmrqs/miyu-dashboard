import type { ReactNode } from "react";

interface StickerCardProps {
  children: ReactNode;
  className?: string;
}

function StickerCard({ children, className = "" }: StickerCardProps) {
  return (
    <div
      className={`bg-miyu-cream border-[3px] border-ink rounded-2xl shadow-[6px_6px_0_var(--color-ink)] ${className}`}
    >
      {children}
    </div>
  );
}

export default StickerCard;
