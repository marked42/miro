'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import { api } from '@/convex/_generated/api'
import { useOrganization } from '@clerk/nextjs'
import { useApiMutation } from '@/hooks/use-api-mutation'

export default function EmptyFavorites() {
    const { organization } = useOrganization();
    const { mutate, pending } = useApiMutation(api.board.create);

    const onClick = () => {
        if (!organization) return;
        mutate({
            orgId: organization.id,
            title: 'Untitled',
        }).then(() => {
            // TODO: redirect to board/{id}
            toast.success("Board created")
        }).catch(error => {
            toast.error('Failed to create board')
        })
    }

    return (
        <div className='h-full flex flex-col items-center justify-center'>
            <Image
                src="/note.svg"
                height={110}
                width={110}
                alt="Empty"
            />
            <h2 className='text-2xl font-semibold mt-6'>
                Create your first board!
            </h2>
            <p className='text-muted-foreground text-sm m-t2'>
                Start by creating a board for your organization
            </p>
            <div className='mt-6'>
                <Button disabled={pending} size="lg" onClick={onClick}>Create board</Button>
            </div>
        </div>
    )
}
