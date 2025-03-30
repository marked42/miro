"use client";

import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';

export interface CreateOrganizationDialogProps {
    children: React.ReactNode;
}

export default function CreateOrganizationDialog({ children }: CreateOrganizationDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="p-0 bg-transparent border-none max-w-[430px]!">
                <DialogTitle className="sr-only">create organization</DialogTitle>
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    )
}
