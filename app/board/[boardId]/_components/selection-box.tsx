'use client';

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Side, XYWH } from "@/types/canvas";
import { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({
    onResizeHandlePointerDown,
}: SelectionBoxProps) => {
    const bounds = useSelectionBounds();

    if (!bounds) {
        return null
    }

    return (
        <>
            <rect
                className="fill-transparent stroke-blue-500 stroke-1 pointers-events-none"
                style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
                x={0}
                y={0}
                width={bounds.width}
                height={bounds.height}
            />
        </>
    )
})

SelectionBox.displayName = 'SelectionBox'
