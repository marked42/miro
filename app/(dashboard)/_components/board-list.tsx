'use client';

import EmptyBoards from "./empty-boards";
import EmptyFavorites from "./empty-favorite";
import EmptySearch from "./empty-search";

export interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    };
}

export default function BoardList({ orgId, query }: BoardListProps) {
    // TODO: API Call
    const data = [];

    if (!data.length && query.search) {
        return <EmptySearch />
    }

    if (!data.length && query.favorites) {
        return <EmptyFavorites />
    }

    if (!data.length) {
        return <EmptyBoards />
    }

    return <div>{JSON.stringify(query)}</div>
}
