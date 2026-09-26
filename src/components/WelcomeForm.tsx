import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useToast } from "../lib/useToast";
import type { ComponentGroup } from "../types/componentGroup";
import ComponentGroupCard from "./ComponentGroupCard";
import DiscordPreview from "./DiscordPreview";
import StickerCard from "./StickerCard";
import ChannelSelect from "./ChannelSelect";
import Toggle from "./Toggle";

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

interface FormState {
  channelId: string | null;
  enabled: boolean;
  components: ComponentGroup[];
}

interface WelcomeFormProps {
  initialState: FormState;
}

function WelcomeForm({ initialState }: WelcomeFormProps) {
  const { guildId } = useParams();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormState>(initialState);

  function handleAddGroup() {
    setForm((prev) => ({
      ...prev,
      components: [...prev.components, createEmptyGroup()],
    }));
  }

  function handleUpdateGroup(updated: ComponentGroup) {
    setForm((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === updated.id ? updated : c,
      ),
    }));
  }

  function handleRemoveGroup(id: string) {
    setForm((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== id),
    }));
  }

  const hasContent = form.components.some((c) => c.blocks.length > 0);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/guilds/${guildId}/welcome`, {
        method: "PUT",
        body: JSON.stringify({
          channelId: form.channelId,
          enabled: form.enabled,
          components: stripIds(form.components),
        }),
      }),
    onSuccess: () => {
      addToast("success", "Configuração de boas-vindas salva!");
    },
    onError: (error) => {
      addToast("error", `Erro ao salvar: ${error.message}`);
    },
  });

  function handleSave() {
    if (!form.channelId || !hasContent) return;
    saveMutation.mutate();
  }

  return (
    <div className="space-y-4 select-none">
      <StickerCard className="p-6">
        <Toggle
          checked={form.enabled}
          onChange={(enabled) => setForm((prev) => ({ ...prev, enabled }))}
          label="Boas-vindas ativadas"
        />
      </StickerCard>

      <StickerCard className="p-6">
        <ChannelSelect
          value={form.channelId}
          onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
        />
      </StickerCard>

      {form.components.map((group, i) => (
        <ComponentGroupCard
          key={group.id}
          group={group}
          index={i}
          onUpdate={handleUpdateGroup}
          onRemove={() => handleRemoveGroup(group.id)}
          canRemove={form.components.length > 1}
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
          onClick={handleSave}
          disabled={!form.channelId || !hasContent || saveMutation.isPending}
          className="w-full bg-miyu-pink-dark text-white font-bold py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? "Salvando..." : "Salvar configuração"}
        </button>
      </StickerCard>

      <StickerCard className="p-6">
        <p className="text-xs font-bold text-ink/50 uppercase mb-3">
          Preview (variáveis como {"{usuario}"} aparecem como placeholder)
        </p>
        <DiscordPreview components={form.components} />
      </StickerCard>
    </div>
  );
}

export default WelcomeForm;
