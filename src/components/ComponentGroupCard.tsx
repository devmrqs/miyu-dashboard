import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { Block, BlockType } from "../types/block";
import type { ComponentGroup } from "../types/componentGroup";
import AddBlockMenu from "./AddBlockMenu";
import SortableBlockItem from "./SortableBlockItem";
import AccentColorPicker from "./AccentColorPicker";
import StickerCard from "./StickerCard";
import EmptyState from "./EmptyState";

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

interface ComponentGroupCardProps {
  group: ComponentGroup;
  index: number;
  onUpdate: (updated: ComponentGroup) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function ComponentGroupCard({
  group,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: ComponentGroupCardProps) {
  function handleAddBlock(type: BlockType) {
    onUpdate({ ...group, blocks: [...group.blocks, createEmptyBlock(type)] });
  }

  function handleRemoveBlock(id: string) {
    onUpdate({ ...group, blocks: group.blocks.filter((b) => b.id !== id) });
  }

  function handleUpdateBlock(updated: Block) {
    onUpdate({
      ...group,
      blocks: group.blocks.map((b) => (b.id === updated.id ? updated : b)),
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = group.blocks.findIndex((b) => b.id === active.id);
    const newIndex = group.blocks.findIndex((b) => b.id === over.id);
    onUpdate({ ...group, blocks: arrayMove(group.blocks, oldIndex, newIndex) });
  }

  return (
    <StickerCard className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-ink">Componente {index + 1}</p>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center bg-red-100 border-2 border-ink rounded-lg font-bold text-red-700 hover:bg-red-200 transition"
          >
            ×
          </button>
        )}
      </div>

      <AccentColorPicker
        value={group.accentColor}
        onChange={(accentColor) => onUpdate({ ...group, accentColor })}
      />

      {group.blocks.length === 0 ? (
        <EmptyState message="Nenhum bloco ainda — comece adicionando um abaixo!" />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={group.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {group.blocks.map((block) => (
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

      <AddBlockMenu onAdd={handleAddBlock} />
    </StickerCard>
  );
}

export default ComponentGroupCard;
