import { useToast } from "../lib/useToast";

const TOAST_STYLES = {
  success: "bg-white border-ink",
  error: "bg-red-100 border-ink",
  info: "bg-[#ffd93d] border-ink",
};

const TOAST_ICONS = {
  success: "✓",
  error: "✕",
  info: "🔔",
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-[3px] shadow-[4px_4px_0_var(--color-ink)] font-bold text-ink ${TOAST_STYLES[toast.type]}`}
        >
          <span className="flex items-center gap-2">
            <span>{TOAST_ICONS[toast.type]}</span>
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-ink/50 hover:text-ink font-bold"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
