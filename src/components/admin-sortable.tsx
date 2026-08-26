import { useState } from "react";

/**
 * Minimal HTML5 drag-and-drop ordering helper.
 * `onReorder` receives the full list of ids in their new order.
 */
export function useDragSort(ids: string[], onReorder: (ordered: string[]) => void) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const dropOn = (targetId: string) => {
    const sourceId = dragging;
    setDragging(null);
    setOver(null);
    if (!sourceId || sourceId === targetId) return;
    const next = ids.filter((id) => id !== sourceId);
    const index = next.indexOf(targetId);
    next.splice(index < 0 ? next.length : index, 0, sourceId);
    onReorder(next);
  };

  const itemProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragging(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
    },
    onDragEnd: () => {
      setDragging(null);
      setOver(null);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (over !== id) setOver(id);
    },
    onDragLeave: () => setOver((c) => (c === id ? null : c)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      dropOn(id);
    },
    "data-dragging": dragging === id ? "true" : undefined,
    className:
      dragging === id
        ? "opacity-40"
        : over === id
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : "",
  });

  return { itemProps, dragging };
}
