import { Circle, MousePointer2, Pen, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react"
import { ToolButton } from "./tool-button"
import { CanvasMode, CanvasState, InsertingLayerType, LayerType } from '@/types/canvas'

export interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    canUndo: boolean;
    redo: () => void;
    canRedo: boolean;
}

const isInsertingLayer = (state: CanvasState, layer: LayerType) => {
    if (state.mode !== CanvasMode.Inserting) {
        return false
    }

    return state.layerType === layer
}


export function Toolbar({
    canvasState,
    setCanvasState,
    undo,
    canUndo,
    redo,
    canRedo,
}: ToolbarProps) {

    const startInsertingLayer = (layerType: InsertingLayerType) => {
        setCanvasState({ mode: CanvasMode.Inserting, layerType })
    }

    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div
                className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md"
            >
                <ToolButton
                    label="Select"
                    icon={MousePointer2}
                    onClick={() => { setCanvasState({ mode: CanvasMode.None }) }}
                    isActive={canvasState.mode === CanvasMode.None
                        || canvasState.mode === CanvasMode.Translating
                        || canvasState.mode === CanvasMode.SelectionNet
                        || canvasState.mode === CanvasMode.Pressing
                        || canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton
                    label="Text"
                    icon={Type}
                    onClick={() => startInsertingLayer(LayerType.Text)}
                    isActive={isInsertingLayer(canvasState, LayerType.Text)}
                />
                <ToolButton
                    label="Sticky note"
                    icon={StickyNote}
                    onClick={() => startInsertingLayer(LayerType.Note)}
                    isActive={isInsertingLayer(canvasState, LayerType.Note)}
                />
                <ToolButton
                    label="Square"
                    icon={Square}
                    onClick={() => startInsertingLayer(LayerType.Rectangle)}
                    isActive={isInsertingLayer(canvasState, LayerType.Rectangle)}
                />
                <ToolButton
                    label="Circle"
                    icon={Circle}
                    onClick={() => startInsertingLayer(LayerType.Ellipse)}
                    isActive={isInsertingLayer(canvasState, LayerType.Ellipse)}
                />
                <ToolButton
                    label="Pencil"
                    icon={Pen}
                    onClick={() => { setCanvasState({ mode: CanvasMode.Pencil }) }}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>
            <div
                className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md"
            >
                <ToolButton label="Undo" icon={Undo2} onClick={undo} isActive={false} isDisabled={!canUndo} />
                <ToolButton label="Redo" icon={Redo2} onClick={redo} isActive={false} isDisabled={!canRedo} />
            </div>
        </div>
    )
}

export const ToolbarSkeleton = function ToolbarSkeleton() {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md">
        </div>
    )
}
