import {useCallback, useEffect, useMemo, useState} from "react";
import {useInfiniteData} from "@/hooks/viewModels/useInfiniteData";
import {BaseInfiniteOptions, BaseInfiniteResult} from "@/hooks/types";
import {Class, Diet, Family, Kingdom, Specie} from "@/model/domain";
import {ISpeciesRepository} from "@/dal/repository/ISpeciesRepository";
import {QueryParams} from "@/shared/PagedRequest";

interface SpecieFilterState {
    currentNameFilter: string | null;
    currentScientificNameFilter: string | null;
    currentDietFilter: Diet | null;
    currentKingdomFilter: Kingdom | null;
    currentClassFilter: Class | null;
    currentFamilyFilter: Family | null;
}

type UseInfiniteSpeciesResult = BaseInfiniteResult<Specie> &
    SpecieFilterState & {
    // Toggle filter methods
    search: (name: string) => void;
    toggleScientificNameFilter: (scientificName: string) => void;
    toggleDietFilter: (diet: Diet) => void;
    toggleKingdomFilter: (kingdom: Kingdom) => void;
    toggleClassFilter: (classType: Class) => void;
    toggleFamilyFilter: (family: Family) => void;
    clearFilters: () => void;
    // Manual filter method
    applyFilters: () => void;
    // Sort methods
    sortByName: (descending?: boolean) => void;
    sortByScientificName: (descending?: boolean) => void;
};

type UseInfiniteSpeciesOptions = BaseInfiniteOptions<Specie>;

export function useInfiniteSpecies(
    repository?: ISpeciesRepository,
    options: UseInfiniteSpeciesOptions = {}
): UseInfiniteSpeciesResult {
    if (!repository) throw new Error('No Species Repository provided');

    // Options destructuring with defaults
    const {
        pageSize = 20,
        orderBy = 'name',
        descending = false,
        enabled = true
    } = options;

    // Filter state management
    const [nameFilter, setNameFilter] = useState<string | null>(null);
    const [scientificNameFilter, setScientificNameFilter] = useState<string | null>(null);
    const [dietFilter, setDietFilter] = useState<Diet | null>(null);
    const [kingdomFilter, setKingdomFilter] = useState<Kingdom | null>(null);
    const [classFilter, setClassFilter] = useState<Class | null>(null);
    const [familyFilter, setFamilyFilter] = useState<Family | null>(null);

    // 🔧 FIX: Memoize the current filters to prevent unnecessary re-renders
    const currentFilters = useMemo((): QueryParams => {
        const params: QueryParams = {};

        if (nameFilter) params.name = nameFilter;
        if (scientificNameFilter) params.scientificName = scientificNameFilter;
        if (dietFilter) params.diet = dietFilter;
        if (kingdomFilter) params.kingdom = kingdomFilter;
        if (classFilter) params.class = classFilter;
        if (familyFilter) params.family = familyFilter;

        return params;
    }, [nameFilter, scientificNameFilter, dietFilter, kingdomFilter, classFilter, familyFilter]);

    // Core query setup
    const queryResult = useInfiniteData<Specie>(repository, {
        queryKey: ['species', orderBy, descending],
        pageSize,
        orderingProperty: orderBy as string,
        isDescending: descending,
        enabled,
        initialFilter: currentFilters, // 🔧 FIX: Pass current filters directly
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // 🔧 FIX: Use useEffect with proper dependencies to auto-apply filters
    useEffect(() => {
        queryResult.setFilter(currentFilters);
    }, [currentFilters]); // Only depend on the memoized filters

    // Apply current filters to the query (manual trigger)
    const applyFilters = useCallback(() => {
        queryResult.setFilter(currentFilters);
    }, [currentFilters, queryResult.setFilter]);

    // Toggle filter handlers
    const search = useCallback((name: string) => {
        setNameFilter(name);
    }, []);

    const toggleScientificNameFilter = useCallback((scientificName: string) => {
        setScientificNameFilter(current => current === scientificName ? null : scientificName);
    }, []);

    const toggleDietFilter = useCallback((diet: Diet) => {
        setDietFilter(current => current === diet ? null : diet);
    }, []);

    const toggleKingdomFilter = useCallback((kingdom: Kingdom) => {
        setKingdomFilter(current => current === kingdom ? null : kingdom);
    }, []);

    const toggleClassFilter = useCallback((classType: Class) => {
        setClassFilter(current => current === classType ? null : classType);
    }, []);

    const toggleFamilyFilter = useCallback((family: Family) => {
        setFamilyFilter(current => current === family ? null : family);
    }, []);

    const clearFilters = useCallback(() => {
        setNameFilter(null);
        setScientificNameFilter(null);
        setDietFilter(null);
        setKingdomFilter(null);
        setClassFilter(null);
        setFamilyFilter(null);
    }, []);

    // Sort handlers
    const sortByName = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('name', descending);
    }, [queryResult.setOrdering]);

    const sortByScientificName = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('scientificName', descending);
    }, [queryResult.setOrdering]);

    return {
        // Base query properties
        ...queryResult,

        // Species-specific toggle filter methods
        search,
        toggleScientificNameFilter,
        toggleDietFilter,
        toggleKingdomFilter,
        toggleClassFilter,
        toggleFamilyFilter,
        clearFilters,
        applyFilters,

        // Sort methods
        sortByName,
        sortByScientificName,

        // Current filter states
        currentNameFilter: nameFilter,
        currentScientificNameFilter: scientificNameFilter,
        currentDietFilter: dietFilter,
        currentKingdomFilter: kingdomFilter,
        currentClassFilter: classFilter,
        currentFamilyFilter: familyFilter,
    };
}