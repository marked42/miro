import { connectionIdToColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react";
import { MousePointer2 } from "lucide-react";
import { memo } from "react";

export interface CursorProps {
    connectionId: number;
}

export const Cursor = memo(({ connectionId }: CursorProps) => {
    const { info: { name = '' }, presence: { cursor } } = useOther(connectionId, user => user)

    if (!cursor) {
        return null
    }

    const { x, y } = cursor

    const color = connectionIdToColor(connectionId);
    return (
        <g
            className="will-change-transform"
            style={{
                transform: `translateX(${x}px) translateY(${y}px)`
            }}
        >
            <foreignObject
                height={50}
                width={name?.length * 10 + 15}
                className="drop-shadow-md"
            >
                <MousePointer2
                    className="h-5 w-5"
                    style={{
                        fill: color,
                        color,
                    }}
                >
                </MousePointer2>
                <div
                    className="px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
                    style={{ background: color, marginLeft: 20 }}
                >
                    {name}
                </div>
            </foreignObject>
        </g>
    )
})

Cursor.displayName = 'Cursor'
