"use client"

import {
    useOrganization,
    UserButton,
} from '@clerk/nextjs'
import { OrganizationSwitcher } from '@clerk/nextjs';
import SearchInput from './search-input'
import InviteButton from './invite-button'

export default function Navbar() {
    const { organization } = useOrganization();

    return (
        <div className="flex items-center gap-x-4 p-5">
            <div className="hidden lg:flex lg:flex-1">
                <SearchInput />
            </div>
            <div className='block lg:hidden flex-1'>
                <OrganizationSwitcher
                    appearance={{
                        elements: {
                            rootBox: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: "376px",
                            },
                            organizationSwitcherTrigger: {
                                padding: '6px',
                                width: '100%',
                                borderRadius: '8px',
                                border: '1px solid black',
                                background: 'white',
                            }
                        }
                    }}
                    hidePersonal
                />
            </div>
            {organization && <InviteButton />}
            <UserButton />
        </div>
    )
}
