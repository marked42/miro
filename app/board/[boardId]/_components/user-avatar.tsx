import Hint from "@/app/(dashboard)/_components/sidebar/hint";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ReactNode } from "react";

export interface UserAvatarProps {
    src?: string;
    name?: string;
    fallback?: ReactNode;
    borderColor?: string
}

export const UserAvatar = ({
    src,
    name,
    fallback,
    borderColor
}: UserAvatarProps) => {
    return (
        <Hint label={name || "Teammate"} side="bottom" sideOffset={10}>
            <Avatar className="h-8 w-8 border-2 flex items-center justify-center" style={{ borderColor }}>
                <AvatarImage src={src} />
                <AvatarFallback className="text-xs font-semibold">
                    {fallback}
                </AvatarFallback>
            </Avatar>
        </Hint>
    )
}
