'use client';

import { ReactNode } from 'react'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react'

export interface RoomProps {
    roomId: string;
    children: ReactNode;
    fallback: ReactNode;
}

export function Room({ roomId, children, fallback }: RoomProps) {
    return (
        <LiveblocksProvider publicApiKey={"pk_dev_GllR6RFWMRBcEztIouo1vSKU_MDFrpj0nAysNRq8OuGIrg7F3Ik48k2kApxFZosy"}>
            <RoomProvider id={roomId}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
