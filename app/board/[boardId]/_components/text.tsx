import { cn, colorToCss } from '@/lib/utils';
import { TextLayer } from '@/types/canvas';
import { useMutation } from '@liveblocks/react';
import { Kalam } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const font = Kalam({
    subsets: ['latin'],
    weight: ['400']
})

const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96
    const minFontSize = 10
    const scaleFactor = 0.5
    const fontSizeBasedOnHeight = height * scaleFactor
    const fontSizeBasedOnWidth = width * scaleFactor

    return Math.max(minFontSize, Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize))
}

export interface TextProps {
    id: string;
    layer: TextLayer;
    onPointerDown: (e: React.PointerEvent, id: string) => void;
    selectionColor?: string;
}

export const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
    const { x, y, width, height, fill, value } = layer

    const updateValue = useMutation(({ storage }, newValue: string) => {
        const liveLayers = storage.get('layers');

        liveLayers.get(id)?.set("value", newValue)
    }, [])
    const handleContentChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value)
    }

    const fontSize = calculateFontSize(width, height)

    return (
        <foreignObject
            x={x}
            y={y}
            width={width}
            height={height}
            onPointerDown={e => onPointerDown(e, id)}
            className="overflow-visible"
            style={{
                outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
            }}
        >
            <ContentEditable
                html={value || 'Text'}
                onChange={handleContentChange}
                className={cn(
                    "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
                    font.className
                )}
                style={{
                    color: fill ? colorToCss(fill) : '#000',
                    fontSize,
                }}
            ></ContentEditable>
        </foreignObject>
    )
}
