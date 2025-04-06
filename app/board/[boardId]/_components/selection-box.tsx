'use client';

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Side, XYWH } from "@/types/canvas";
import { memo } from "react";

interface SelectionBoxProps {
    onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_SIZE = 8;

export const SelectionBox = memo(({
    onResizeHandlePointerDown,
}: SelectionBoxProps) => {
    const bounds = useSelectionBounds();

    if (!bounds) {
        return null
    }

    const isShowingHandles = true

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
            {isShowingHandles && (
                <>
                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x - HANDLE_SIZE / 2}px, ${bounds.y - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top + Side.Left, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_SIZE / 2}px, ${bounds.y - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_SIZE / 2}px, ${bounds.y - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Top + Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_SIZE / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nwse-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x + bounds.width - HANDLE_SIZE / 2}px, ${bounds.y + bounds.height - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ns-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_SIZE / 2}px, ${bounds.y + bounds.height - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'nesw-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x - HANDLE_SIZE / 2}px, ${bounds.y + bounds.height - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds)
                        }}
                    />

                    <rect
                        className="fill-white stroke-blue-500"
                        x={0}
                        y={0}
                        style={{
                            cursor: 'ew-resize',
                            width: `${HANDLE_SIZE}px`,
                            height: `${HANDLE_SIZE}px`,
                            transform: `translate(${bounds.x - HANDLE_SIZE / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_SIZE / 2}px)`
                        }}
                        onPointerDown={e => {
                            e.stopPropagation();
                            onResizeHandlePointerDown(Side.Left, bounds)
                        }}
                    />
                </>
            )}
        </>
    )
})

SelectionBox.displayName = 'SelectionBox'
