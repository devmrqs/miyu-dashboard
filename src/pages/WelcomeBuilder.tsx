import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import type { WelcomeConfig } from "../types/welcome";
import type { ComponentGroup } from "../types/componentGroup";
import WelcomeForm from "../components/WelcomeForm";
import LoadingState from "../components/LoadingState";

function addIds(components: WelcomeConfig["components"]): ComponentGroup[] {
  return components.map((component) => ({
    id: crypto.randomUUID(),
    accentColor: component.accentColor,
    blocks: component.blocks.map((block) => ({
      ...block,
      id: crypto.randomUUID(),
    })) as ComponentGroup["blocks"],
  }));
}

function WelcomeBuilder() {
  const { guildId } = useParams();

  const { data: existingConfig, isLoading } = useQuery({
    queryKey: ["welcome", guildId],
    queryFn: () => apiFetch<WelcomeConfig>(`/guilds/${guildId}/welcome`),
    retry: false,
  });

  if (isLoading) {
    return <LoadingState message="Carregando configuração..." />;
  }

  const initialState = {
    channelId: existingConfig?.channelId ?? null,
    enabled: existingConfig?.enabled ?? true,
    components: existingConfig
      ? addIds(existingConfig.components)
      : [{ id: crypto.randomUUID(), blocks: [], accentColor: null }],
  };

  return <WelcomeForm key={guildId} initialState={initialState} />;
}

export default WelcomeBuilder;
