import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export interface HintProps {
    label: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
    alignOffset?: number;
}

export default function Hint({
    label,
    children,
    side,
    sideOffset,
    align,
    alignOffset,
}: HintProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent
                    className="text-white bg-black border-black"
                    side={side}
                    sideOffset={sideOffset}
                    align={align}
                    alignOffset={alignOffset}
                >
                    <p className="font-semibold capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
