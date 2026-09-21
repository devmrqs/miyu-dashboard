export type BlockType =
  | "text"
  | "separator"
  | "button-link"
  | "button-action"
  | "section-thumbnail"
  | "media-gallery";

interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
}

export interface SeparatorBlock extends BaseBlock {
  type: "separator";
}

export interface ButtonLinkBlock extends BaseBlock {
  type: "button-link";
  label: string;
  url: string;
  emoji?: string;
}

export interface ButtonActionBlock extends BaseBlock {
  type: "button-action";
  label: string;
  actionId: string;
  style: "primary" | "secondary" | "success" | "danger";
  emoji?: string;
}

export interface SectionThumbnailBlock extends BaseBlock {
  type: "section-thumbnail";
  content: string;
  imageUrl: string;
}

export interface MediaGalleryBlock extends BaseBlock {
  type: "media-gallery";
  images: string[];
}

export type Block =
  | TextBlock
  | SeparatorBlock
  | ButtonLinkBlock
  | ButtonActionBlock
  | SectionThumbnailBlock
  | MediaGalleryBlock;
