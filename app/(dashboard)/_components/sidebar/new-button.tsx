"use client";

import CreateOrganizationDialog from './create-organization-dialog'
import { Plus } from "lucide-react";
import Hint from './hint'

export default function NewButton() {
    return (
        <CreateOrganizationDialog>
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
        </CreateOrganizationDialog>
    )
}
