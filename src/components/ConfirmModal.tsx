import Modal from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-ink/70 font-medium mb-4">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 bg-miyu-pink-dark text-white font-bold py-2.5 rounded-lg border-0.5 border-ink shadow-[3px_3px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--color-ink)] transition-all"
        >
          Enviar
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-white text-ink font-bold py-2.5 rounded-lg border-0.5 border-ink shadow-[3px_3px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_var(--color-ink)] transition-all"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
