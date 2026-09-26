import type { Block } from "./block";

export interface ComponentGroup {
  id: string;
  blocks: Block[];
  accentColor: string | null;
}
