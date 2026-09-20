import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { Guild } from "../types/guild";
import StickerCard from "../components/StickerCard";
import AppHeader from "../components/AppHeader";
import LoadingState from "../components/LoadingState";

function Dashboard() {
  const [showContent, setShowContent] = useState(false);

  const {
    data: guilds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guilds"],
    queryFn: () => apiFetch<Guild[]>("/guilds"),
  });

  if (!showContent) {
    return (
      <LoadingState
        isComplete={!isLoading && !error}
        onComplete={() => setShowContent(true)}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-700 font-bold">
        Erro: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="p-8 max-w-2xl mx-auto select-none">
        <h1 className="text-3xl font-bold text-ink mb-6">
          Escolha um servidor
        </h1>
        <div className="space-y-4">
          {guilds?.map((guild, i) => (
            <Link key={guild.id} to={`/dashboard/${guild.id}/embed`}>
              <StickerCard
                className={`p-4 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-ink)] transition-all cursor-pointer ${i % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
              >
                <span className="font-bold text-ink text-lg">{guild.name}</span>
              </StickerCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
