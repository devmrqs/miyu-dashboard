import { useRef } from "react";
import type { Block, ButtonActionBlock } from "../types/block";

interface BlockEditorProps {
  block: Block;
  onChange: (updated: Block) => void;
}

interface ToolbarButton {
  label: string;
  prefix: string;
  suffix?: string;
  title: string;
  wide?: boolean;
}

const TOOLBAR_GROUPS: ToolbarButton[][] = [
  [
    { label: "B", prefix: "**", suffix: "**", title: "Negrito" },
    { label: "I", prefix: "*", suffix: "*", title: "Itálico" },
    { label: "❝", prefix: "> ", title: "Citação" },
  ],
  [
    { label: "H1", prefix: "# ", title: "Título 1" },
    { label: "H2", prefix: "## ", title: "Título 2" },
    { label: "H3", prefix: "### ", title: "Título 3" },
    { label: "Tt", prefix: "-# ", title: "Texto pequeno" },
    { label: "•", prefix: "- ", title: "Lista" },
  ],
  [
    { label: "Link", prefix: "[", suffix: "](url)", title: "Link", wide: true },
    {
      label: "😃",
      prefix: "<:nome:",
      suffix: ":ID_AQUI>",
      title: "Emoji do Discord",
    },
    {
      label: "@",
      prefix: "<@&",
      suffix: "ID_AQUI>",
      title: "Menção a cargo/usuário",
    },
    { label: "#", prefix: "<#", suffix: "ID_AQUI>", title: "Menção a canal" },
  ],
];

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

  return (
    <div className="space-y-2">
      <div className="flex border-0.5 border-ink rounded-lg overflow-hidden w-fit bg-white shadow-[4px_4px_0_var(--color-ink)]">
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex">
            {group.map((btn, btnIndex) => {
              const isLastInGroup = btnIndex === group.length - 1;
              const isLastGroup = groupIndex === TOOLBAR_GROUPS.length - 1;
              const showBorder = !(isLastInGroup && isLastGroup);

              return (
                <button
                  key={btn.label}
                  onMouseDown={(e) =>
                    handleToolbarClick(e, btn.prefix, btn.suffix)
                  }
                  title={btn.title}
                  className={`h-9 ${btn.wide ? "px-3" : "w-9"} flex items-center justify-center text-sm font-bold text-ink bg-white hover:bg-ink hover:text-white active:bg-miyu-pink-dark active:text-white transition-colors ${
                    showBorder ? "border-r-0.5 border-ink" : ""
                  } ${isLastInGroup && !isLastGroup ? "border-r-[3px]" : ""}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        ))}
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
            value={block.label || ""}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="https://..."
            value={block.url || ""}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="Emoji (opcional, ex: 🔗 ou <:nome:1234>)"
            value={block.emoji || ""}
            onChange={(e) => onChange({ ...block, emoji: e.target.value })}
          />
        </div>
      );

    case "button-action":
      return (
        <div className="space-y-2">
          <input
            className={inputClass}
            placeholder="Texto do botão"
            value={block.label || ""}
            onChange={(e) => onChange({ ...block, label: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="ID da ação (ex: teste_dinamico)"
            value={block.actionId || ""}
            onChange={(e) => onChange({ ...block, actionId: e.target.value })}
          />
          <select
            className={inputClass}
            value={block.style || "primary"}
            onChange={(e) =>
              onChange({
                ...block,
                style: e.target.value as ButtonActionBlock["style"],
              })
            }
          >
            <option value="primary">Primary (Azul)</option>
            <option value="secondary">Secondary (Cinza)</option>
            <option value="success">Success (Verde)</option>
            <option value="danger">Danger (Vermelho)</option>
          </select>
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
            value={block.imageUrl || ""}
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
          value={block.images ? block.images.join(", ") : ""}
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
