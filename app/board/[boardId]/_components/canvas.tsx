'use client';

import { useCallback, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation } from "@liveblocks/react";
import { CursorsPresence } from './cursors-presence'
import { pointerEventToCanvasPoint } from "@/lib/utils";

export interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const [canvasState, setCanvasState] = useState<CanvasState>(() => ({ mode: CanvasMode.None }))

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const [camera, setCamera] = useState<Camera>(() => ({ x: 0, y: 0 }))
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera(camera => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }))
    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera)
        setMyPresence({ cursor: current })
    }, [])

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
            >
                <CursorsPresence />
            </svg>
        </main>
    )
}
