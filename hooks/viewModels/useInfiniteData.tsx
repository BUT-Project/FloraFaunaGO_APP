import {useInfiniteQuery} from '@tanstack/react-query';
import {useCallback, useMemo, useState} from 'react';
import {GenericRepository} from "@/dal/repository/IGenericRepository";
import {PagedRequest, QueryParams} from "@/shared/PagedRequest";
import {PagingResult} from "@/shared/PagingResult";

interface InfiniteDataOptions<T> {
    // Core options
    pageSize?: number;
    initialFilter?: QueryParams;
    orderingProperty?: string;
    isDescending?: boolean;

    // Query configuration
    queryKey: (string | number | boolean | Record<string, any>)[]; // Allow flexible types in queryKey
    enabled?: boolean;
    staleTime?: number;
}

interface InfiniteDataResult<T> {
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
    setFilter: (filter: QueryParams) => void;
    setOrdering: (property: string, descending?: boolean) => void;

    // Current state trackers
    currentFilter: QueryParams | undefined;
    currentOrderingProperty: string | undefined;
    currentOrderingDirection: boolean;
}

export function useInfiniteData<T>(
    repository: GenericRepository<T>,
    options: InfiniteDataOptions<T>
): InfiniteDataResult<T> {
    // State management
    const [filter, setFilter] = useState<QueryParams | undefined>(options.initialFilter);
    const [orderingProperty, setOrderingProperty] = useState<string | undefined>(options.orderingProperty);
    const [isDescending, setIsDescending] = useState(options.isDescending ?? false);

    // Options destructuring
    const {
        pageSize = 10,
        queryKey,
        enabled = true,
        staleTime,
    } = options;

    // Query key construction - serialize filter object for proper caching
    const completeQueryKey = useMemo(() => [
        ...queryKey,
        pageSize,
        filter ? JSON.stringify(filter) : undefined,
        orderingProperty,
        isDescending
    ], [queryKey, pageSize, filter, orderingProperty, isDescending]);

    // Core query setup
    const {
        data,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isLoading,
        isFetching,
        isError,
        error,
        
        refetch
    } = useInfiniteQuery({
        queryKey: completeQueryKey,
        queryFn: async ({pageParam = 0}) => {
            try{
                const request: PagedRequest = {
                    index: pageParam,
                    count: pageSize,
                    orderingPropertyName: orderingProperty || null,
                    descending: isDescending || null,
                    filter: filter || undefined
                };

                // Log API call details
                console.log(`[API Call] Fetching data - Page: ${pageParam}, PageSize: ${pageSize}, OrderBy: ${orderingProperty || 'default'}, Descending: ${isDescending}`, {
                    filter: filter || 'none',
                    queryKey: completeQueryKey,
                    timestamp: new Date().toISOString()
                });

                const result = await repository.getAll(request);
                
                // Log successful API response
                console.log(`[API Success] Received ${result.items.length} items, Total: ${result.total}, Page: ${result.index}`, {
                    timestamp: new Date().toISOString()
                });

                return result;
            } catch (err) {
                console.error("Error during infinite query :", err);
                throw err;
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage: PagingResult<T>, allPages) => {
            const nextPage = lastPage.index + 1;
            return nextPage * pageSize < lastPage.total ? nextPage : undefined;
        },
        getPreviousPageParam: (firstPage: PagingResult<T>) => {
            const prevPage = firstPage.index - 1;
            return prevPage > 0 ? prevPage : undefined;
        },
   
        enabled,
        staleTime,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });

    // Derived data
    const items = useMemo(() =>
            data?.pages.flatMap(page => page.items) ?? [],
        [data?.pages]
    );
    const totalItems = data?.pages[0]?.total ?? 0;
    const currentPage = data?.pages[data.pages.length - 1]?.index ?? 0;

    // Event handlers
    const handleSetFilter = useCallback((newFilter: QueryParams) => {
        setFilter(newFilter);
    }, []);

    const handleSetOrdering = useCallback((property: string, descending: boolean = false) => {
        setOrderingProperty(property);
        setIsDescending(descending);
    }, []);

    const refresh = useCallback(async () => {
        await refetch();
    }, [refetch]);


    return {
        // Data properties
        items,
        totalItems,
        currentPage,

        // State indicators
        isLoading,
        isFetching,
        isError,
        error: error,

        // Pagination controls
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        fetchNextPage: async () => {
            await fetchNextPage();
        },
        fetchPreviousPage: async () => {
            await fetchPreviousPage();
        },

        // Data manipulation methods
        refresh,
        setFilter: handleSetFilter,
        setOrdering: handleSetOrdering,

        // Current state trackers
        currentFilter: filter,
        currentOrderingProperty: orderingProperty,
        currentOrderingDirection: isDescending
    };
}