import { Link, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { Guild } from "../types/guild";
import StickerCard from "../components/StickerCard";
import AppHeader from "../components/AppHeader";

function GuildLayout() {
  const { guildId } = useParams();

  const { data: guilds } = useQuery({
    queryKey: ["guilds"],
    queryFn: () => apiFetch<Guild[]>("/guilds"),
  });

  const guild = guilds?.find((g) => g.id === guildId);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="p-8 max-w-3xl mx-auto">
        <StickerCard className="flex gap-5 p-4 mb-6 justify-between items-center">
          <div className="gap-2">
            <Link
              to="/dashboard"
              className="text-sm font-bold text-miyu-pink-dark hover:underline select-none"
            >
              ← Trocar servidor
            </Link>
            <h1 className="text-2xl font-bold text-ink">
              {guild?.name ?? "Carregando..."}
            </h1>
          </div>
          <div className="flex gap-4 select-none">
            <Link
              to={`/dashboard/${guildId}/embed`}
              className="flex-1 text-center bg-miyu-cream border-[3px] border-ink rounded-xl px-6 py-2 font-bold text-ink whitespace-nowrap shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all flex items-center justify-center"
            >
              Enviar Mensagens
            </Link>
            <Link
              to={`/dashboard/${guildId}/welcome`}
              className="flex-1 text-center bg-miyu-cream border-[3px] border-ink rounded-xl px-6 py-2 font-bold text-ink whitespace-nowrap shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all flex items-center justify-center"
            >
              Boas-vindas
            </Link>
          </div>
        </StickerCard>

        <Outlet />
      </div>
    </div>
  );
}

export default GuildLayout;
