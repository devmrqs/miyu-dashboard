import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useToast } from "../lib/useToast";
import type { ComponentGroup } from "../types/componentGroup";
import ComponentGroupCard from "../components/ComponentGroupCard";
import DiscordPreview from "../components/DiscordPreview";
import StickerCard from "../components/StickerCard";
import ChannelSelect from "../components/ChannelSelect";
import ConfirmModal from "../components/ConfirmModal";

function createEmptyGroup(): ComponentGroup {
  return { id: crypto.randomUUID(), blocks: [], accentColor: null };
}

function stripIds(components: ComponentGroup[]) {
  return components.map(({ blocks, accentColor }) => ({
    accentColor,
    blocks: blocks.map((block) => {
      const copy: Record<string, unknown> = { ...block };
      delete copy.id;
      return copy;
    }),
  }));
}

function ComponentBuilder() {
  const { guildId } = useParams();
  const { addToast } = useToast();

  const [components, setComponents] = useState<ComponentGroup[]>([
    createEmptyGroup(),
  ]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleAddGroup() {
    setComponents((prev) => [...prev, createEmptyGroup()]);
  }

  function handleUpdateGroup(updated: ComponentGroup) {
    setComponents((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  function handleRemoveGroup(id: string) {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }

  const hasContent = components.some((c) => c.blocks.length > 0);

  const sendMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/guilds/${guildId}/messages`, {
        method: "POST",
        body: JSON.stringify({ channelId, components: stripIds(components) }),
      }),
    onSuccess: () => {
      addToast("success", "Mensagem enviada com sucesso!");
      setComponents([createEmptyGroup()]);
    },
    onError: (error) => {
      addToast("error", `Erro ao enviar: ${error.message}`);
    },
  });

  function handleSendClick() {
    if (!channelId || !hasContent) return;
    setIsConfirmOpen(true);
  }

  return (
    <div className="space-y-4 select-none">
      <StickerCard className="p-6">
        <ChannelSelect value={channelId} onChange={setChannelId} />
      </StickerCard>

      {components.map((group, i) => (
        <ComponentGroupCard
          key={group.id}
          group={group}
          index={i}
          onUpdate={handleUpdateGroup}
          onRemove={() => handleRemoveGroup(group.id)}
          canRemove={components.length > 1}
        />
      ))}

      <button
        onClick={handleAddGroup}
        className="w-full bg-white text-ink font-bold py-3 rounded-xl border-[3px] border-ink border-dashed hover:bg-ink/5 transition"
      >
        + Adicionar Componente
      </button>

      <StickerCard className="p-6">
        <button
          onClick={handleSendClick}
          disabled={!channelId || !hasContent || sendMutation.isPending}
          className="w-full bg-miyu-pink-dark text-white font-bold py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendMutation.isPending ? "Enviando..." : "Enviar mensagem"}
        </button>
      </StickerCard>

      <StickerCard className="p-6">
        <p className="text-xs font-bold text-ink/50 uppercase mb-3">Preview</p>
        <DiscordPreview components={components} />
      </StickerCard>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => sendMutation.mutate()}
        title="Confirmar envio?"
        message="A mensagem será enviada para o canal selecionado agora."
      />
    </div>
  );
}

export default ComponentBuilder;
