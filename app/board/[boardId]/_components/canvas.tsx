'use client';

import { nanoid } from 'nanoid'
import React, { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState, Color, InsertingLayerType, Point, Side, XYWH } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useMyPresence, useStorage, useOthersMapped, useSelf } from "@liveblocks/react";
import { CursorsPresence } from './cursors-presence'
import { colorToCss, connectionIdToColor, findIntersectingLayersWithRectangle, penPointsToPathLayer, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { LiveObject } from '@liveblocks/client';
import { LayerPreview } from './layer-preview';
import { SelectionBox } from './selection-box';
import { SelectionTools } from './selection-tools';
import { Path } from './path';

export const MAX_LAYERS = 100;

export interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [, setMyPresence] = useMyPresence();
    const layerIds = useStorage(root => root.layerIds) || [];
    const pencilDraft = useSelf(self => self.presence.pencilDraft);
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

    // translate
    const translateSelectedLayers = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Translating) {
            return
        }

        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        }

        const liveLayers = storage.get('layers')
        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id)
            if (layer) {
                layer.update({
                    x: layer.get('x') + offset.x,
                    y: layer.get('y') + offset.y,
                })
            }
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point })
    }, [
        canvasState,
    ])

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
        history.pause();

        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        })
    }, [history])

    // unselect currently selected layers
    const unselectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true })
        }
    }, [])


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
        setMyPresence({ cursor: null })
    }, [])

    const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
        setMyPresence({
            pencilDraft: [[point.x, point.y, pressure]],
            penColor: lastColor,
        })
    }, [lastColor])

    const continueDrawing = useMutation(({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
        const { pencilDraft } = self.presence

        if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft === null) {
            return;
        }

        const newPencilDraft = pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y ? pencilDraft : [...pencilDraft, [point.x, point.y, e.pressure]];
        setMyPresence({
            cursor: point,
            pencilDraft: newPencilDraft,
            penColor: lastColor,
        })
    }, [lastColor, canvasState.mode])

    const insertPath = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get("layers")
        const liveLayerIds = storage.get('layerIds')
        const { pencilDraft } = self.presence

        if (pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
            setMyPresence({ pencilDraft: null })
            return
        }

        const id = nanoid();
        const pathLayer = penPointsToPathLayer(pencilDraft, lastColor)

        liveLayerIds.push(id);
        liveLayers.set(id, new LiveObject(pathLayer))

        setMyPresence({ pencilDraft: null })
        setCanvasState({ mode: CanvasMode.Pencil })
    }, [canvasState.mode, lastColor, setCanvasState])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            return
        }

        if (canvasState.mode === CanvasMode.Pencil) {
            startDrawing(point, e.pressure)
            return
        }

        setCanvasState({ mode: CanvasMode.Pressing, origin: point })
    }, [setCanvasState, canvasState.mode, camera, startDrawing])

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unselectLayers();
            setCanvasState({
                mode: CanvasMode.None,
            })
        } else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath();
        } else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point)
        } else {
            setCanvasState({
                mode: CanvasMode.None
            })
        }

        history.resume();
    }, [camera, canvasState, history, insertLayer, unselectLayers, insertPath])

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

    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        const THRESHOLD = 5
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > THRESHOLD) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            })
        }
    }, [])

    const updateSelectionNet = useMutation(({ storage, setMyPresence }, current, origin) => {
        const layers = storage.get("layers").toImmutable();
        // const layerIds = storage.get("layerIds").toImmutable();
        setCanvasState({
            mode: CanvasMode.SelectionNet,
            origin,
            current,
        })
        const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current)

        setMyPresence({ selection: ids }, { addToHistory: false })
    }, [layerIds])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera)

        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin)
        } else if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayers(current)
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer((current))
        } else if (canvasState.mode === CanvasMode.Pencil) {
            continueDrawing(current, e)
        }

        setMyPresence({ cursor: current })
    }, [camera, canvasState, startMultiSelection, updateSelectionNet, translateSelectedLayers, resizeSelectedLayer, continueDrawing])

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
            <SelectionTools
                camera={camera}
                setLastColor={setLastColor}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                width={"100%"}
                height={"100%"}
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onMouseLeave={onPointerLeave}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
            >
                <g style={{ transform: `translate(${camera.x}px,${camera.y}px)` }}>
                    {layerIds.map(id => (
                        <LayerPreview
                            key={id}
                            id={id}
                            onLayerPointerDown={(e) => onLayerPointerDown(e, id)}
                            selectionColor={layerIdsToColorSelection[id]}
                        />
                    ))}
                    <CursorsPresence />
                    {pencilDraft && pencilDraft.length > 0 && (
                        <Path
                            x={0}
                            y={0}
                            points={pencilDraft}
                            fill={colorToCss(lastColor)}
                        />
                    )}

                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    {canvasState.mode === CanvasMode.SelectionNet && canvasState.current !== undefined && (
                        <rect
                            className='fill-blue-500/5 stroke-blue-500 stroke-1'
                            x={Math.min(canvasState.origin.x, canvasState.current.x)}
                            y={Math.min(canvasState.origin.y, canvasState.current.y)}
                            width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                            height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                        />
                    )}
                </g>
            </svg>
        </main>
    )
}
