'use client';

import { nanoid } from 'nanoid'
import { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState, Color, InsertingLayerType, Point, Side, XYWH } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useMyPresence, useStorage, useOthersMapped } from "@liveblocks/react";
import { CursorsPresence } from './cursors-presence'
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layer-preview';
import { SelectionBox } from './selection-box';

export const MAX_LAYERS = 100;

export interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [myPresence, setMyPresence] = useMyPresence();
    const layerIds = useStorage(root => root.layerIds);
    const [lastColor, setLastColor] = useState<Color>({ r: 255, g: 255, b: 255, })
    const insertLayer = useMutation(({ storage, setMyPresence }, layerType: InsertingLayerType, position: Point) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYERS) {
            return;
        }

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            width: 100,
            height: 100,
            fill: lastColor
        })

        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer)

        setMyPresence({ selection: [layerId] }, { addToHistory: true })
        setCanvasState({ mode: CanvasMode.None })
    }, [lastColor])
    const [canvasState, setCanvasState] = useState<CanvasState>(() => ({ mode: CanvasMode.None }))

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const [camera, setCamera] = useState<Camera>(() => ({ x: 0, y: 0 }))
    const onWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        const newCamera = {
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }
        setCamera(newCamera)

        // update cursor on wheel
        const current = pointerEventToCanvasPoint(e, newCamera)
        setMyPresence({ cursor: current })
    }, [camera, setMyPresence])

    const onPointerLeave = useMutation(({ setMyPresence }, e) => {
        console.log('on pointer leave: ', e)
        setMyPresence({ cursor: null })
    }, [])

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        } else {
            setCanvasState({
                mode: CanvasMode.None
            })
        }

        history.resume();
    }, [camera, canvasState, history, insertLayer])

    const onLayerPointerDown = useMutation(({ self, setMyPresence }, e, layerId: string) => {
        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
            return
        }

        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true })
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [
        setCanvasState,
        camera,
        history,
        canvasState.mode,
    ])

    // selection
    const selections = useOthersMapped(other => other.presence.selection)
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};
        for (const [connectionId, selection] of selections) {
            for (const layerId of selection) {
                // only one user selection is showed for single layer
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection
    }, [selections])

    // resize
    const resizeSelectedLayer = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Resizing) {
            return;
        }

        const resizedBounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)

        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0])

        if (layer) {
            layer.update(resizedBounds)
        }
    }, [canvasState])

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        console.log({ corner, initialBounds })
        history.pause();

        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        })
    }, [history])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode === CanvasMode.Resizing) {
            console.log('resize')
            resizeSelectedLayer((current))
        }

        setMyPresence({ cursor: current })
    }, [camera, canvasState, resizeSelectedLayer])


    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                undo={() => history.undo()}
                canUndo={canUndo}
                redo={() => history.redo()}
                canRedo={canRedo}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                width={"100%"}
                height={"100%"}
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onMouseLeave={onPointerLeave}
                onPointerUp={onPointerUp}
            >
                <g style={{ transform: `translate(${camera.x}px,${camera.y}px)` }}>
                    {layerIds?.map(id => (
                        <LayerPreview
                            key={id}
                            id={id}
                            onLayerPointerDown={(e) => onLayerPointerDown(e, id)}
                            selectionColor={layerIdsToColorSelection[id]}
                        />
                    ))}
                    <CursorsPresence />

                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                </g>
            </svg>
        </main>
    )
}
