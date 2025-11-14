// lib/dragUtils.ts
import { arrayMove } from "@dnd-kit/sortable";

/**
 * Helper to reorder a list when drag & drop occurs.
 */
export const reorderList = <T,>(items: T[], oldIndex: number, newIndex: number): T[] => {
  return arrayMove(items, oldIndex, newIndex);
};
