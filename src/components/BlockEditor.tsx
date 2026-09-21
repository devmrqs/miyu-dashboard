import { useRef } from "react";
import type { Block } from "../types/block";

interface BlockEditorProps {
  block: Block;
  onChange: (updated: Block) => void;
}

function MarkdownTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (newText: string) => void;
  placeholder: string;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);

    const newText = before + prefix + selected + suffix + after;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleToolbarClick = (
    e: React.MouseEvent,
    prefix: string,
    suffix: string = "",
  ) => {
    e.preventDefault();
    applyFormat(prefix, suffix);
  };

  const btnClass =
    "px-3 py-1 bg-miyu-cream border-[2px] border-ink rounded-xl text-xs font-bold text-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all mb-3";

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap mb-1">
        <button
          onMouseDown={(e) => handleToolbarClick(e, "**", "**")}
          className={btnClass}
          title="Negrito"
        >
          B
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "*", "*")}
          className={`${btnClass} italic`}
          title="Itálico"
        >
          I
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "# ", "")}
          className={btnClass}
          title="Título 1"
        >
          H1
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "## ", "")}
          className={btnClass}
          title="Título 2"
        >
          H2
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "### ", "")}
          className={btnClass}
          title="Título 3"
        >
          H3
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "[", "](url)")}
          className={btnClass}
          title="Link"
        >
          Link
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "- ", "")}
          className={btnClass}
          title="Lista/Tópico"
        >
          •
        </button>
        <button
          onMouseDown={(e) => handleToolbarClick(e, "-# ", "")}
          className={btnClass}
          title="Texto Pequeno"
        >
          Tt
        </button>
      </div>

      <textarea
        ref={textareaRef}
        className="w-full bg-white border-0.5 border-ink rounded-lg px-3 py-2 font-medium text-ink outline-none focus:border-miyu-pink-dark select-none"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function BlockEditor({ block, onChange }: BlockEditorProps) {
  const inputClass =
    "w-full bg-white border-[2px] border-ink rounded-lg px-3 py-2 font-medium text-ink outline-none focus:border-miyu-pink-dark select-none";

  switch (block.type) {
    case "text":
      return (
        <MarkdownTextarea
          rows={3}
          placeholder="Digite o texto (aceita **negrito**, *itálico*)"
          value={block.content || ""}
          onChange={(newContent) => onChange({ ...block, content: newContent })}
        />
      );

    case "separator":
      return (
        <p className="text-sm text-ink/50 italic">
          Sem opções — só uma linha divisória.
        </p>
      );

    case "button-link":
      return (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="Texto do botão"
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="https://..."
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
          />
        </div>
      );

    case "button-action":
      return (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="Texto do botão"
            value={block.label}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="ID da ação (ex: teste_dinamico)"
            value={block.actionId}
            onChange={(e) => onChange({ ...block, actionId: e.target.value })}
          />
        </div>
      );

    case "section-thumbnail":
      return (
        <div className="space-y-2">
          <MarkdownTextarea
            rows={2}
            placeholder="Texto da seção"
            value={block.content || ""}
            onChange={(newContent) =>
              onChange({ ...block, content: newContent })
            }
          />
          <input
            className={inputClass}
            placeholder="URL da imagem ou {avatar_usuario}"
            value={block.imageUrl}
            onChange={(e) => onChange({ ...block, imageUrl: e.target.value })}
          />
        </div>
      );

    case "media-gallery":
      return (
        <textarea
          className={inputClass}
          rows={2}
          placeholder="URLs separadas por vírgula"
          value={block.images.join(", ")}
          onChange={(e) =>
            onChange({
              ...block,
              images: e.target.value.split(",").map((s) => s.trim()),
            })
          }
        />
      );
  }
}

export default BlockEditor;
