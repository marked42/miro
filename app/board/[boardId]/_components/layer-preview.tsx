'use client';

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { Rectangle } from "./rectangle";
import { Ellipse } from "./ellipse";
import { Text } from './text'
import { Note } from "./note";

export interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor?: string;
}

export const LayerPreview = memo(({
    id,
    onLayerPointerDown,
    selectionColor
}: LayerPreviewProps) => {
    const layer = useStorage(root => root.layers.get(id))
    if (!layer) {
        return null
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />
            )
        case LayerType.Ellipse:
            return (
                <Ellipse id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />
            )
        case LayerType.Text:
            return (
                <Text id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />
            )
        case LayerType.Note:
            return (
                <Note id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />
            )
        case LayerType.Path:
        default:
            throw new Error("unknown layer type " + id)
    }
})

LayerPreview.displayName = 'LayerPreview'
