import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { Guild } from "../types/guild";

function Dashboard() {
  const {
    data: guilds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guilds"],
    queryFn: () => apiFetch<Guild[]>("/guilds"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Erro: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Seus servidores</h1>
      <ul className="space-y-3">
        {guilds?.map((guild) => (
          <li key={guild.id} className="bg-white/50 p-4 rounded-2xl">
            {guild.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
