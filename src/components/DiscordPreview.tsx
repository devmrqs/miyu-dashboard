import type { Block } from "../types/block";

interface DiscordPreviewProps {
  blocks: Block[];
  accentColor: string | null;
}

const DISCORD_BUTTON_COLORS: Record<string, string> = {
  primary: "#5865f2",
  secondary: "#4e5058",
  success: "#248046",
  danger: "#da373c",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMarkdown(text: string) {
  const html = escapeHtml(text)
    .replace(
      /^>>> ([\s\S]+)$/gm,
      '<div class="border-l-4 border-[#4e5058] pl-3 my-1 text-[#dbdee1]">$1</div>',
    )
    .replace(
      /^> (.*$)/gim,
      '<div class="border-l-4 border-[#4e5058] pl-3 my-1 text-[#dbdee1]">$1</div>',
    )
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-[1.1rem] font-bold text-[#dbdee1] mt-3 mb-1">$1</h3>',
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-[1.25rem] font-bold text-[#dbdee1] mt-4 mb-1">$1</h2>',
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-[1.5rem] font-bold text-[#dbdee1] mt-4 mb-1">$1</h1>',
    )
    .replace(
      /^-# (.*$)/gim,
      '<span class="block text-[0.75rem] text-[#949ba4] mt-1 mb-1">$1</span>',
    )
    .replace(
      /^[*-] (.*$)/gim,
      '<div class="flex items-start mt-0.5"><span class="mr-2 text-[#dbdee1] font-bold">•</span><span class="flex-1">$1</span></div>',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /(@[a-zA-ZÀ-ÿ0-9_]+)/g,
      '<span class="bg-[#3c4270]/60 text-[#c9cdfb] px-1 rounded font-medium cursor-pointer hover:bg-[#5865f2] hover:text-white transition-colors">$1</span>',
    )
    .replace(
      /\[([^\]]+)\]\(<?([^>)]+)>?\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#00a8fc] hover:underline">$1</a>',
    )
    .replace(/\n/g, "<br />");

  return { __html: html };
}

function DiscordPreview({ blocks, accentColor }: DiscordPreviewProps) {
  return (
    <div className="bg-[#313338] rounded-lg p-4">
      <div
        className="bg-[#2b2d31] rounded-md p-4 border-l-4"
        style={{ borderLeftColor: accentColor ?? "transparent" }}
      >
        {blocks.length === 0 && (
          <p className="text-[#949ba4] text-sm italic">
            Adicione blocos para ver o preview...
          </p>
        )}

        {blocks.map((block) => {
          switch (block.type) {
            case "text":
              return (
                <div
                  key={block.id}
                  className="text-[#dbdee1] text-sm mb-2 last:mb-0"
                  dangerouslySetInnerHTML={renderMarkdown(
                    block.content || "...",
                  )}
                />
              );

            case "separator":
              return <hr key={block.id} className="border-[#3f4147] my-3" />;

            case "button-link":
              return (
                <button
                  key={block.id}
                  className="bg-[#4e5058] text-white text-sm font-medium px-4 py-2 rounded-md mb-2 mr-2 cursor-default"
                  disabled
                >
                  {block.label || "Botão"} ↗
                </button>
              );

            case "button-action":
              return (
                <button
                  key={block.id}
                  className="text-white text-sm font-medium px-4 py-2 rounded-md mb-2 mr-2 cursor-default"
                  style={{
                    backgroundColor: DISCORD_BUTTON_COLORS[block.style],
                  }}
                  disabled
                >
                  {block.label || "Botão"}
                </button>
              );

            case "section-thumbnail":
              return (
                <div key={block.id} className="flex gap-3 items-start mb-2">
                  <div
                    className="text-[#dbdee1] text-sm flex-1"
                    dangerouslySetInnerHTML={renderMarkdown(
                      block.content || "...",
                    )}
                  />
                  {block.imageUrl && !block.imageUrl.startsWith("{") && (
                    <img
                      src={block.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  {block.imageUrl?.startsWith("{") && (
                    <div className="w-16 h-16 rounded-md bg-[#3f4147] flex items-center justify-center text-[#949ba4] text-xs">
                      {block.imageUrl}
                    </div>
                  )}
                </div>
              );

            case "media-gallery":
              return (
                <div key={block.id} className="flex gap-2 mb-2 flex-wrap">
                  {block.images.map((url, i) =>
                    url.startsWith("{") ? (
                      <div
                        key={i}
                        className="w-24 h-24 rounded-md bg-[#3f4147] flex items-center justify-center text-[#949ba4] text-xs text-center p-1"
                      >
                        {url}
                      </div>
                    ) : (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="w-24 h-24 rounded-md object-cover"
                      />
                    ),
                  )}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

export default DiscordPreview;
