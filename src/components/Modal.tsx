import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-miyu-cream border-[3px] border-ink rounded-2xl shadow-[6px_6px_0_var(--color-ink)] max-w-sm w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b-[3px] border-ink">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white border-0.5 border-ink rounded-lg font-bold hover:bg-ink/5"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
