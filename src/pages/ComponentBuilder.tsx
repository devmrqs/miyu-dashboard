import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { apiFetch } from "../lib/api";
import { useToast } from "../lib/useToast";
import type { Block, BlockType } from "../types/block";
import AddBlockMenu from "../components/AddBlockMenu";
import SortableBlockItem from "../components/SortableBlockItem";
import AccentColorPicker from "../components/AccentColorPicker";
import DiscordPreview from "../components/DiscordPreview";
import StickerCard from "../components/StickerCard";
import EmptyState from "../components/EmptyState";
import ChannelSelect from "../components/ChannelSelect";
import ConfirmModal from "../components/ConfirmModal";

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

function ComponentBuilder() {
  const { guildId } = useParams();
  const { addToast } = useToast();

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleAddBlock(type: BlockType) {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  }

  function handleRemoveBlock(id: string) {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }

  function handleUpdateBlock(updated: Block) {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  const sendMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/guilds/${guildId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          channelId,
          blocks: stripBlockIds(blocks),
          accentColor,
        }),
      }),
    onSuccess: () => {
      addToast("success", "Mensagem enviada com sucesso!");
      setBlocks([]);
    },
    onError: (error) => {
      addToast("error", `Erro ao enviar: ${error.message}`);
    },
  });

  function handleSendClick() {
    if (!channelId || blocks.length === 0) return;
    setIsConfirmOpen(true);
  }

  return (
    <div className="space-y-4 select-none">
      <StickerCard className="p-6">
        <ChannelSelect value={channelId} onChange={setChannelId} />
      </StickerCard>

      <StickerCard className="p-6">
        <AccentColorPicker value={accentColor} onChange={setAccentColor} />
      </StickerCard>

      <StickerCard className="p-6">
        {blocks.length === 0 ? (
          <EmptyState message="Nenhum bloco ainda — comece adicionando um abaixo!" />
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {blocks.map((block) => (
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
          onClick={handleSendClick}
          disabled={!channelId || blocks.length === 0 || sendMutation.isPending}
          className="w-full mt-4 bg-miyu-pink-dark text-white font-bold py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_var(--color-ink)]"
        >
          {sendMutation.isPending ? "Enviando..." : "Enviar mensagem"}
        </button>
      </StickerCard>

      <AddBlockMenu onAdd={handleAddBlock} />

      <StickerCard className="p-6">
        <p className="text-xs font-bold text-ink/50 uppercase mb-3">Preview</p>
        <DiscordPreview blocks={blocks} accentColor={accentColor} />
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
