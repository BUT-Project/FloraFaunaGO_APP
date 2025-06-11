import {QueryParams} from "@/shared/PagedRequest";

export interface BaseInfiniteOptions<T> {
    // Core options
    pageSize?: number;
    orderBy?: keyof T;
    descending?: boolean;
    enabled?: boolean;
    initialFilter?: QueryParams;
}

// Base result type that includes common infinite scroll functionality
export interface BaseInfiniteResult<T> {
    // Data properties
    items: T[];
    totalItems: number;
    currentPage: number;

    // State indicators
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;

    // Pagination controls
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    fetchNextPage: () => Promise<void>;
    fetchPreviousPage: () => Promise<void>;

    // Data manipulation methods
    refresh: () => Promise<void>;
}