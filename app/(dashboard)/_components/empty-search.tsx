import Image from 'next/image'

export default function EmptySearch() {
    return (
        <div className='h-full flex flex-col items-center justify-center'>
            <Image
                src="/empty-search.svg"
                height={140}
                width={140}
                alt="Empty"
            />
            <h2 className='text-2xl font-semibold mt-6'>
                No results found!
            </h2>
            <p className='text-muted-foreground text-sm m-t2'>
                Try search for something else
            </p>
        </div>
    )
}
