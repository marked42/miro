'use client';

import { useOrganization } from '@clerk/nextjs';
import EmptyOrg from './_components/empty-org'
import BoardList from './_components/board-list'

interface DashboardLayoutPageProps {
  searchParams: {
    search?: string;
    favorites?: string
  }
}

export default function DashboardPage({ searchParams }: DashboardLayoutPageProps) {

  const { organization } = useOrganization();
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {organization ? <BoardList orgId={organization.id} query={searchParams} /> : <EmptyOrg />}
    </div>
  );
}
