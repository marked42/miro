'use client';

import Hint from "@/app/(dashboard)/_components/sidebar/hint";
import { Actions } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from 'next/image'
import Link from "next/link";

export interface InfoProps {
    boardId: string;
}

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

export function Info({ boardId }: InfoProps) {
    const data = useQuery(api.board.get, {
        id: boardId as Id<'board'>
    })
    const { onOpen } = useRenameModal();

    if (!data) {
        return <InfoSkeleton />
    }


    return (
        <div
            className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 py-2 flex items-center shadow-md"
        >
            <Hint label="Go to boards" side="bottom" sideOffset={10}>
                <Button asChild className="px-2" variant={"board"}>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="board logo"
                            width={20}
                            height={20}
                        />
                        <span className={cn("font-semibold text-xl ml-2 text-black", font.className)}>Board</span>
                    </Link>

                </Button>
            </Hint>

            <Separator orientation="vertical" className="mx-2 h-5!" />

            <Hint label="Edit title">
                <Button variant={"board"} className="text-base font-normal px-2" onClick={() => onOpen(data._id, data.title)}>
                    {data.title}
                </Button>
            </Hint>

            <Separator orientation="vertical" className="mx-2 h-5!" />

            <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
                <div>
                    <Hint label="Main menu" side="bottom" sideOffset={10}>
                        <Button size="icon" variant="board">
                            <MenuIcon />
                        </Button>
                    </Hint>
                </div>
            </Actions>
        </div>
    )
}

export const InfoSkeleton = function InfoSkeleton() {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 w-12 flex items-center shadow-md">
        </div>
    )
}
