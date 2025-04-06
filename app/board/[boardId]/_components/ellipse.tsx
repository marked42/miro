import { EllipseLayer } from "@/types/canvas";

interface EllipseProps {
    id: string;
    layer: EllipseLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const Ellipse = ({
    id,
    layer,
    onPointerDown,
    selectionColor
}: EllipseProps) => {
    const { x, y, width, height, fill } = layer;

    const rx = width * 0.5;
    const ry = height * 0.5;
    const cx = x + rx
    const cy = y + ry
    return (
        <ellipse
            className="drop-shadow-md"
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                transform: `translate(${x}px, ${y}px)`,
            }}
            cx={0}
            cy={0}
            rx={rx}
            ry={ry}
            strokeWidth={1}
            fill={fill}
            stroke="transparent"
        />
    )
}
