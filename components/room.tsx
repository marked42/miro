'use client';

import { ReactNode } from 'react'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react'
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { Layer } from '@/types/canvas';

export interface RoomProps {
    roomId: string;
    children: ReactNode;
    fallback: ReactNode;
}

export function Room({ roomId, children, fallback }: RoomProps) {
    return (
        <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
            <RoomProvider id={roomId} initialPresence={{ cursor: null, selection: [], pencilDraft: null, penColor: null }}
                initialStorage={{
                    layers: new LiveMap<string, LiveObject<Layer>>(),
                    layerIds: new LiveList([]),
                }}
            >
                <ClientSideSuspense fallback={fallback}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
