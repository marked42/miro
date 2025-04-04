export function Participants() {
    return (
        <div
            className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
        >
            list of users
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
