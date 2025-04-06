'use client';

import { nanoid } from 'nanoid'
import { useCallback, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState, Color, InsertingLayerType, Point } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useMyPresence, useStorage } from "@liveblocks/react";
import { CursorsPresence } from './cursors-presence'
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layer-preview';

export const MAX_LAYERS = 100;

export interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [myPresence, setMyPresence] = useMyPresence();
    const layerIds = useStorage(root => root.layerIds);
    const [lastColor, setLastColor] = useState<Color>({ r: 0, g: 0, b: 0, })
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

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera)
        setMyPresence({ cursor: current })
    }, [camera])

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
                            onLayerPointerDown={() => {}}
                            selectionColor={"#000"}
                        />
                    ))}
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    )
}
