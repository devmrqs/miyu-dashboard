import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { Channel } from "../types/channel";
import Select from "./Select";

interface ChannelSelectProps {
  value: string | null;
  onChange: (channelId: string) => void;
}

function ChannelSelect({ value, onChange }: ChannelSelectProps) {
  const { guildId } = useParams();

  const { data: channels } = useQuery({
    queryKey: ["channels", guildId],
    queryFn: () => apiFetch<Channel[]>(`/guilds/${guildId}/channels`),
  });

  const options = (channels ?? []).map((channel) => ({
    value: channel.id,
    label: `# ${channel.name}`,
  }));

  return (
    <Select
      label="Enviar para"
      placeholder="Escolha um canal..."
      options={options}
      value={value ?? undefined}
      onValueChange={onChange}
    />
  );
}

export default ChannelSelect;
