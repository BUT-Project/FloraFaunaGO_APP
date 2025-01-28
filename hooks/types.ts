
export interface BaseInfiniteOptions<T> {
    // Core options
    pageSize?: number;
    orderBy?: keyof T;
    descending?: boolean;
    enabled?: boolean;
    initialFilter?: (item: T) => boolean;
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

// Entity-specific filter state type
export interface FilterState<TStatus, TDateRange = { startDate: Date; endDate: Date }> {
    currentStatus: TStatus | null;
    currentDateRange: TDateRange | null;
}

// Entity-specific filter methods type
export interface FilterMethods<TStatus> {
    filterByStatus: (status: TStatus) => void;
    filterByDate: (startDate: Date, endDate: Date) => void;
    sortByMostRecent: () => void;
    sortByOldest: () => void;
    clearFilters: () => void;
}

// Combined type for entity-specific infinite scroll functionality
export type EntityInfiniteResult<T, TStatus> = BaseInfiniteResult<T> &
    FilterMethods<TStatus> &
    FilterState<TStatus>;