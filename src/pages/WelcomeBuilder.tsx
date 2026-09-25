import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import type { WelcomeConfig } from "../types/welcome";
import type { Block } from "../types/block";
import WelcomeForm from "../components/WelcomeForm";
import LoadingState from "../components/LoadingState";

function addBlockIds(blocks: Omit<Block, "id">[]): Block[] {
  return blocks.map((block) => ({
    ...block,
    id: crypto.randomUUID(),
  })) as Block[];
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
    accentColor: existingConfig?.accentColor ?? null,
    blocks: existingConfig ? addBlockIds(existingConfig.blocks) : [],
  };

  return <WelcomeForm key={guildId} initialState={initialState} />;
}

export default WelcomeBuilder;
