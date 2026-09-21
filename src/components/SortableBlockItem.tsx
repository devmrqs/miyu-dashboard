import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "../types/block";
import BlockEditor from "./BlockEditor";

interface SortableBlockItemProps {
  block: Block;
  onUpdate: (updated: Block) => void;
  onRemove: (id: string) => void;
}

function SortableBlockItem({
  block,
  onUpdate,
  onRemove,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border-0.5 border-ink/30 rounded-lg space-y-2 bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-ink/40 hover:text-ink font-bold px-1"
            title="Arrastar para reordenar"
          >
            ⠿
          </button>
          <p className="text-xs font-bold text-ink/50 uppercase">
            {block.type}
          </p>
        </div>
        <button
          onClick={() => onRemove(block.id)}
          className="w-7 h-7 flex items-center justify-center bg-red-100 border-0.5 border-ink rounded-lg font-bold text-red-700 hover:bg-red-200 transition"
        >
          ×
        </button>
      </div>
      <BlockEditor block={block} onChange={onUpdate} />
    </div>
  );
}

export default SortableBlockItem;
