import type { Block } from "./block";

export interface WelcomeConfig {
  channelId: string;
  enabled: boolean;
  blocks: Omit<Block, "id">[];
  accentColor: string | null;
}
