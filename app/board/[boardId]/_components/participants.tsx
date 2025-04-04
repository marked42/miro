'use client'

import { useOthers, useSelf } from "@liveblocks/react"
import { UserAvatar } from "./user-avatar";
import { connectionIdToColor } from "@/lib/utils";


const MAX_SHOW_OTHER_USERS = 2

export function Participants() {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > MAX_SHOW_OTHER_USERS

    return (
        <div
            className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
        >
            <div className="flex gap-x-2">
                {users.slice(0, MAX_SHOW_OTHER_USERS).map(({ connectionId, info }) => {
                    return (
                        <UserAvatar
                            key={connectionId}
                            src={info?.picture}
                            name={info?.name}
                            borderColor={connectionIdToColor(connectionId)}
                            fallback={info?.name?.[0] || 'T'}
                        />
                    )
                })}

                {currentUser && (
                    <UserAvatar
                        src={currentUser?.info?.picture}
                        name={`${currentUser?.info.name} (You)`}
                        borderColor={connectionIdToColor(currentUser.connectionId)}
                        fallback={currentUser?.info.name?.[0] || 'T'}
                    />
                )}

                {hasMoreUsers && (
                    <UserAvatar
                        name={`${users.length - MAX_SHOW_OTHER_USERS} more`}
                        fallback={`+${users.length - MAX_SHOW_OTHER_USERS}`}
                    />
                )}
            </div>
        </div>
    )
}

export const ParticipantsSkeleton = function ParticipantsSkeleton() {
    return (
        <div
            className="absolute h-12 w-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
        >
        </div>
    )
}
