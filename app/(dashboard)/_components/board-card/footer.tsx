import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface FooterProps {
    title: string;
    authorLabel: string;
    createdAtLabel: string;
    isFavorite: boolean;
    onClick: () => void;
    disabled: boolean;
}

export default function Footer({
    title,
    authorLabel,
    createdAtLabel,
    isFavorite,
    onClick,
    disabled,
}: FooterProps) {
    const handleClick: React.MouseEventHandler = (e) => {
        // click propagates to card, it's wrapped inside a link, triggers jumping to new page.
        e.stopPropagation();
        e.preventDefault();

        onClick();
    }

    return (
        <div className="relative bg-white p-3">
            <p className="text-[13px] truncate max-w-[calc(100% - 20px)]">{title}</p>
            <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate"> {authorLabel}, {createdAtLabel} </p>
            <button
                disabled={disabled}
                onClick={handleClick}
                className={cn("opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
                    disabled && "cursor-not-allowed opacity-75"
                )}
            >
                <Star className={cn("h-4 w-4", isFavorite && "fill-blue-600 text-blue-600")} />
            </button>
        </div>
    )

}
