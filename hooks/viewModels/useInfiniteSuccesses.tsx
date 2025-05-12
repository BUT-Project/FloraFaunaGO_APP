// Base options type that can be extended for any entity
import {Success} from "@/model/domain/Success";
import {ISuccessRepository, SuccessFilterPredicate} from "@/dal/repository/ISuccessRepository";
import {useCallback, useState} from "react";
import {useInfiniteData} from "@/hooks/viewModels/useInfiniteData";
import {BaseInfiniteOptions, BaseInfiniteResult} from "@/hooks/types";

interface SuccessFilterState {
    currentNameFilter: string | null;
    currentProgressRange: { min: number; max: number } | null;
}
// Faut changer toute la logique de filtre pour que ça marche car la c'est le hok qui filtre or sa devrait être le repository

// Combined type for Success-specific infinite scroll functionality
type UseInfiniteSuccessesResult = BaseInfiniteResult<Success> &
    SuccessFilterPredicate &
    SuccessFilterState;

type UseInfiniteSuccessesOptions = BaseInfiniteOptions<Success>;

export function useInfiniteSuccesses(
    repository?: ISuccessRepository,
    options: UseInfiniteSuccessesOptions = {}
): UseInfiniteSuccessesResult {

    if (!repository) throw new Error('No Success Repository');

    // Options destructuring
    const {
        pageSize = 20,
        orderBy = 'nom', // Default to sorting by name
        descending = false,
        enabled = true,
        initialFilter,
    } = options;

    // State management
    const [nameFilter, setNameFilter] = useState<string | null>(null);
    const [progressRange, setProgressRange] = useState<{ min: number; max: number } | null>(null);

    // Core query setup
    const queryResult = useInfiniteData<Success>(repository, {
        queryKey: ['successes', orderBy, descending],
        pageSize,
        orderingProperty: orderBy as string,
        isDescending: descending,
        enabled,
        initialFilter,
        staleTime: 5 * 60 * 1000
    });

    // Filter handlers
    const filterByName = useCallback((name: string) => {
        setNameFilter(name);
        queryResult.setFilter((success) =>
            success.nom.toLowerCase().includes(name.toLowerCase())
        );
    }, [queryResult]);

    const filterByProgress = useCallback((minProgress: number, maxProgress: number) => {
        setProgressRange({min: minProgress, max: maxProgress});
        queryResult.setFilter((success) =>
            success.actualVal >= minProgress && success.actualVal <= maxProgress
        );
    }, [queryResult]);

    const clearFilters = useCallback(() => {
        setNameFilter(null);
        setProgressRange(null);
        queryResult.setFilter(() => true);
    }, [queryResult]);

    // Sort handlers
    const sortByName = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('nom', descending);
    }, [queryResult]);

    const sortByProgress = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('actualVal', descending);
    }, [queryResult]);

    return {
        // Data properties
        ...queryResult,

        // Success-specific methods
        filterByName,
        filterByProgress,
        sortByName,
        sortByProgress,
        clearFilters,
        fetchNextPage : queryResult.fetchNextPage,
        // Current state trackers
        currentNameFilter: nameFilter,
        currentProgressRange: progressRange
    };
}
