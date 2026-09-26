import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import miyuMascot from "../assets/miyu-mascot.jpeg";
import { apiFetch } from "../lib/api";

function AppHeader() {
  const logoutMutation = useMutation({
    mutationFn: () => apiFetch("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  return (
    <header className="border-b-[3px] border-ink bg-miyu-cream select-none">
      <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={miyuMascot}
            alt="Miyu"
            className="w-10 h-10 rounded-full border-[3px] border-ink object-cover"
          />
          <div>
            <Link
              to="/dashboard"
              className="text-xl font-bold text-ink leading-none"
            >
              Miyu
            </Link>
            <p className="text-xs text-ink/50 font-medium">
              painel de controle
            </p>
          </div>
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          className="text-sm font-bold text-ink/60 hover:text-ink transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
