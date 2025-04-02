import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Overlay } from './overlay';
import { useAuth } from '@clerk/nextjs';
import Footer from './footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Actions } from '@/components/actions';
import { MoreHorizontalIcon } from 'lucide-react';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

export interface BoardCardProps {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    createdAt: number;
    imageUrl: string;
    orgId: string;
    isFavorite: boolean;
}

export default function BoardCard({
    id,
    title,
    authorId,
    authorName,
    createdAt,
    orgId,
    imageUrl,
    isFavorite
}: BoardCardProps) {
    const { userId } = useAuth();

    const favorite = useApiMutation(api.board.favorite)
    const unfavorite = useApiMutation(api.board.unfavorite)
    const toggleFavorite = () => {
        if (isFavorite) {
            unfavorite.mutate({ id })
                .catch(() => toast.error("Failed to unfavorite"))
        } else {
            favorite.mutate({ id, orgId })
                .catch(() => toast.error("Failed to favorite"))
        }
    }

    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true
    })

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image
                        alt={title}
                        fill
                        src={imageUrl}
                        className='object-fit'
                    />
                    <Overlay />
                    <Actions
                        id={id}
                        title={title}
                        side="right"
                    >
                        <button className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none'>
                            <MoreHorizontalIcon
                                className='text-white opacity-75 hover:opacity-100 transition-opacity'
                            />
                        </button>
                    </Actions>
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => toggleFavorite()}
                    disabled={favorite.pending || unfavorite.pending}
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className='aspect-[100/127] rounded-lg overflow-hidden'>
            <Skeleton className='h-full w-full' />
        </div>
    )
}
