import Sidebar from './_components/sidebar'
import OrgSidebar from './_components/org-sidebar'
import Navbar from './_components/navbar'

interface DashboardLayoutPageProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutPageProps) {
    return (
        <main>
            <Sidebar />
            <div className="pl-[60px] h-full">
                <div className='flex gap-x-3 h-full'>
                    <OrgSidebar />
                    <div className='h-full flex-1'>
                        <Navbar />
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}
