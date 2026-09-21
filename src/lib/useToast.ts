import { useContext } from "react";
import { ToastContext } from "./toastContextInstance";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast precisa estar dentro de um ToastProvider");
  return context;
}
