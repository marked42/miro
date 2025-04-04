import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CreateOrganizationDialog from './sidebar/create-organization-dialog';

export default function EmptyOrg() {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/elements.svg"
                alt="Empty"
                height={200}
                width={200}
            />
            <h2 className="text-2xl font-semibold mt-6">
                Welcome to Board
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Create an organization to get started
            </p>
            <div className='mt-6'>
                <CreateOrganizationDialog>
                    <Button size="lg">
                        Create Organization
                    </Button>
                </CreateOrganizationDialog>
            </div>
        </div>
    )
}
