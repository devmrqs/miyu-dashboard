import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import type { Block, BlockType } from "../types/block";
import AddBlockMenu from "../components/AddBlockMenu";
import BlockEditor from "../components/BlockEditor";
import AccentColorPicker from "../components/AccentColorPicker";
import DiscordPreview from "../components/DiscordPreview";
import StickerCard from "../components/StickerCard";
import EmptyState from "../components/EmptyState";
import ChannelSelect from "../components/ChannelSelect";

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
  return blocks.map(({ id, ...rest }) => {
    void id;
    return rest;
  });
}

function ComponentBuilder() {
  const { guildId } = useParams();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);

  function handleAddBlock(type: BlockType) {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  }

  function handleRemoveBlock(id: string) {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }

  function handleUpdateBlock(updated: Block) {
    setBlocks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
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
  });

  function handleSend() {
    if (!channelId || blocks.length === 0) return;
    sendMutation.mutate();
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
          <div className="space-y-3">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="p-3 border-0.5 border-ink/30 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-ink/50 uppercase">
                    {block.type}
                  </p>
                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="w-7 h-7 flex items-center justify-center bg-red-100 border-0.5 border-ink rounded-lg font-bold text-red-700 hover:bg-red-200 transition"
                  >
                    ×
                  </button>
                </div>
                <BlockEditor block={block} onChange={handleUpdateBlock} />
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!channelId || blocks.length === 0 || sendMutation.isPending}
          className="w-full mt-4 bg-miyu-pink-dark text-white font-bold py-3 rounded-xl border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_var(--color-ink)]"
        >
          {sendMutation.isPending ? "Enviando..." : "Enviar mensagem"}
        </button>

        {sendMutation.isSuccess && (
          <p className="text-center font-bold text-green-700 mt-2">
            ✓ Mensagem enviada com sucesso!
          </p>
        )}

        {sendMutation.isError && (
          <p className="text-center font-bold text-red-700 mt-2">
            Erro: {sendMutation.error.message}
          </p>
        )}
      </StickerCard>

      <AddBlockMenu onAdd={handleAddBlock} />

      <StickerCard className="p-6">
        <p className="text-xs font-bold text-ink/50 uppercase mb-3">Preview</p>
        <DiscordPreview blocks={blocks} accentColor={accentColor} />
      </StickerCard>
    </div>
  );
}

export default ComponentBuilder;
