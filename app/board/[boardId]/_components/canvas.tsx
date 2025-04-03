'use client';

import { useSelf } from "@liveblocks/react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

export interface CanvasProps {
    boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const info = useSelf(me => me.info);

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
        >
            <div>{boardId + ' - ' + JSON.stringify(info)}</div>
            <Info />
            <Participants />
            <Toolbar />
        </main>
    )
}
