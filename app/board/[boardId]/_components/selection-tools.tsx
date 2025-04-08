import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useMutation, useSelf } from '@liveblocks/react'
import { Camera, Color } from "@/types/canvas"
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import Hint from "@/app/(dashboard)/_components/sidebar/hint";
import { Button } from "@/components/ui/button";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

export interface SelectionToolsProps {
    camera: Camera;
    setLastColor: (color: Color) => void;
}

export const SelectionTools = memo(({ camera, setLastColor }: SelectionToolsProps) => {
    const selection = useSelf(me => me.presence.selection)
    const setFill = useMutation(({ storage }, fill: Color) => {
        const liveLayers = storage.get('layers');
        setLastColor(fill)

        selection?.forEach((id) => {
            liveLayers.get(id)?.set('fill', fill)
        })
    }, [selection, setLastColor])

    const deleteLayers = useDeleteLayers();

    // order in liveLayerIds represents layer
    const sendToBack = useMutation(({ storage }) => {
        const liveLayerIds = storage.get('layerIds')
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i)
            }
        }

        for (let i = 0; i < indices.length; i++) {
            liveLayerIds.move(indices[i], i);
        }
    }, [selection])

    const bringToFront = useMutation(({ storage }) => {
        const liveLayerIds = storage.get('layerIds')
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for (let i = 0; i < arr.length; i++) {
            if (selection?.includes(arr[i])) {
                indices.push(i)
            }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
            liveLayerIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
        }
    }, [selection])


    const selectionBounds = useSelectionBounds();

    if (!selectionBounds) {
        return null;
    }


    const x = selectionBounds.x + camera.x + selectionBounds.width / 2
    const y = selectionBounds.y + camera.y

    return (
        <div
            className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
            style={{
                transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`
            }}
        >
            <ColorPicker onChange={setFill} />
            <div className="flex flex-col gap-y-0.5">
                <Hint label="Bring to front">
                    <Button variant="board" size="icon" onClick={bringToFront}>
                        <BringToFront />
                    </Button>
                </Hint>
                <Hint label="Send to back">
                    <Button variant="board" size="icon" onClick={sendToBack}>
                        <SendToBack />
                    </Button>
                </Hint>
            </div>
            <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
                <Hint label="Delete">
                    <Button variant="board" size="icon" onClick={deleteLayers}>
                        <Trash2 />
                    </Button>
                </Hint>
            </div>
        </div>
    )
})

SelectionTools.displayName = 'SelectionTools'
