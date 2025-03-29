"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Hint from './hint'

export default function NewButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint
                        label="Create Organization"
                        side="right"
                        sideOffset={18}
                        align="start"
                    >
                        <button className="bg-white/25 h-full w-full rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
                            <Plus className="text-white"></Plus>
                        </button>
                    </Hint>
                </div>
            </DialogTrigger>

            <DialogContent className="p-0 bg-transparent border-none max-w-[430px]!">
                <DialogTitle className="sr-only">create organization</DialogTitle>
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    )
}
