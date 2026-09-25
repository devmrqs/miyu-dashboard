import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useToast } from "../lib/useToast";
import type { Block, BlockType } from "../types/block";
import AddBlockMenu from "./AddBlockMenu";
import SortableBlockItem from "./SortableBlockItem";
import AccentColorPicker from "./AccentColorPicker";
import DiscordPreview from "./DiscordPreview";
import StickerCard from "./StickerCard";
import EmptyState from "./EmptyState";
import ChannelSelect from "./ChannelSelect";
import Toggle from "./Toggle";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

function createEmptyBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "text":
      return { id, type, content: "" };
    case "separator":
      return { id, type };
    case "button-link":
      return { id, type, label: "", url: "" };
    case "button-action":
      return { id, type, label: "", actionId: "", style: "primary" };
    case "section-thumbnail":
      return { id, type, content: "", imageUrl: "" };
    case "media-gallery":
      return { id, type, images: [] };
  }
}

function stripBlockIds(blocks: Block[]) {
  return blocks.map((block) => {
    const copy: Record<string, unknown> = { ...block };
    delete copy.id;
    return copy;
  });
}

interface FormState {
  channelId: string | null;
  enabled: boolean;
  accentColor: string | null;
  blocks: Block[];
}

interface WelcomeFormProps {
  initialState: FormState;
}

function WelcomeForm({ initialState }: WelcomeFormProps) {
  const { guildId } = useParams();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormState>(initialState);

  function handleAddBlock(type: BlockType) {
    setForm((prev) => ({
      ...prev,
      blocks: [...prev.blocks, createEmptyBlock(type)],
    }));
  }

  function handleRemoveBlock(id: string) {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }));
  }

  function handleUpdateBlock(updated: Block) {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setForm((prev) => {
      const oldIndex = prev.blocks.findIndex((b) => b.id === active.id);
      const newIndex = prev.blocks.findIndex((b) => b.id === over.id);
      return { ...prev, blocks: arrayMove(prev.blocks, oldIndex, newIndex) };
    });
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/guilds/${guildId}/welcome`, {
        method: "PUT",
        body: JSON.stringify({
          channelId: form.channelId,
          enabled: form.enabled,
          blocks: stripBlockIds(form.blocks),
          accentColor: form.accentColor,
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
    if (!form.channelId || form.blocks.length === 0) return;
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

      <StickerCard className="p-6">
        <AccentColorPicker
          value={form.accentColor}
          onChange={(accentColor) =>
            setForm((prev) => ({ ...prev, accentColor }))
          }
        />
      </StickerCard>

      <StickerCard className="p-6">
        {form.blocks.length === 0 ? (
          <EmptyState message="Nenhum bloco ainda — comece adicionando um abaixo!" />
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={form.blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {form.blocks.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onRemove={handleRemoveBlock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <button
          onClick={handleSave}
          disabled={
            !form.channelId ||
            form.blocks.length === 0 ||
            saveMutation.isPending
          }
          className="w-full mt-4 bg-miyu-pink-dark text-white font-bold py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? "Salvando..." : "Salvar configuração"}
        </button>
      </StickerCard>

      <AddBlockMenu onAdd={handleAddBlock} />

      <StickerCard className="p-6">
        <p className="text-xs font-bold text-ink/50 uppercase mb-3">
          Preview (variáveis como {"{usuario}"} aparecem como placeholder)
        </p>
        <DiscordPreview blocks={form.blocks} accentColor={form.accentColor} />
      </StickerCard>
    </div>
  );
}

export default WelcomeForm;
