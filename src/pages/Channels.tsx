import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { Channel } from "../types/channel";

function Channels() {
  const { guildId } = useParams();

  const {
    data: channels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channels", guildId],
    queryFn: () => apiFetch<Channel[]>(`/guilds/${guildId}/channels`),
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
      <Link
        to="/dashboard"
        className="text-indigo-500 hover:underline mb-4 inline-block"
      >
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold mb-6">Canais</h1>
      <ul className="space-y-3">
        {channels?.map((channel) => (
          <li key={channel.id} className="bg-white/50 p-4 rounded-2xl">
            #{channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Channels;
