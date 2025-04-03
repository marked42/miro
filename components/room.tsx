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
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
            <RoomProvider id={roomId}>
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
