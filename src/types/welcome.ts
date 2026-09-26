import type { Block } from "./block";

export interface WelcomeComponentGroup {
  blocks: Omit<Block, "id">[];
  accentColor: string | null;
}

export interface WelcomeConfig {
  channelId: string;
  enabled: boolean;
  components: WelcomeComponentGroup[];
}
