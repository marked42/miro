import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Overlay } from './overlay';
import { useAuth } from '@clerk/nextjs';
import Footer from './footer';
import { Skeleton } from '@/components/ui/skeleton';

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
                </div>
                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => {}}
                    disabled={false}
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
