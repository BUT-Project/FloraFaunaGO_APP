import {useCallback, useState} from "react";
import {useInfiniteData} from "@/hooks/viewModels/useInfiniteData";
import {BaseInfiniteOptions, BaseInfiniteResult} from "@/hooks/types";
import Specie from "@/model/domain/Specie";
import {Diet} from "@/model/domain/Diet";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Family} from "@/model/domain/Family";
import Habitat from "@/model/domain/Habitat";
import {ISpeciesRepository} from "@/model/service/ISpeciesRepository";

interface SpecieFilterState {
    currentNameFilter: string | null;
    currentScientificNameFilter: string | null;
    currentHabitatFilter: Habitat | null;
    currentDietFilter: Diet | null;
    currentKingdomFilter: Kingdom | null;
    currentClassFilter: Class | null;
    currentFamilyFilter: Family | null;
}

type UseInfiniteSpeciesResult = BaseInfiniteResult<Specie> &
    SpecieFilterState & {
    // Filter methods
    filterByName: (name: string) => void;
    filterByScientificName: (scientificName: string) => void;
    filterByHabitat: (habitat: Habitat) => void;
    filterByDiet: (diet: Diet) => void;
    filterByKingdom: (kingdom: Kingdom) => void;
    filterByClass: (classType: Class) => void;
    filterByFamily: (family: Family) => void;
    clearFilters: () => void;

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
        enabled = true,
        initialFilter,
    } = options;

    // Filter state management
    const [nameFilter, setNameFilter] = useState<string | null>(null);
    const [scientificNameFilter, setScientificNameFilter] = useState<string | null>(null);
    const [habitatFilter, setHabitatFilter] = useState<Habitat | null>(null);
    const [dietFilter, setDietFilter] = useState<Diet | null>(null);
    const [kingdomFilter, setKingdomFilter] = useState<Kingdom | null>(null);
    const [classFilter, setClassFilter] = useState<Class | null>(null);
    const [familyFilter, setFamilyFilter] = useState<Family | null>(null);

    // Core query setup
    const queryResult = useInfiniteData<Specie>(repository, {
        queryKey: ['species', orderBy, descending],
        pageSize,
        orderingProperty: orderBy as string,
        isDescending: descending,
        enabled,
        initialFilter,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    // Filter handlers
    const filterByName = useCallback((name: string) => {
        setNameFilter(name);
        queryResult.setFilter((species) =>
            species.name.toLowerCase().includes(name.toLowerCase())
        );
    }, [queryResult]);

    const filterByScientificName = useCallback((scientificName: string) => {
        setScientificNameFilter(scientificName);
        queryResult.setFilter((species) =>
            species.scientificName.toLowerCase().includes(scientificName.toLowerCase())
        );
    }, [queryResult]);

    const filterByHabitat = useCallback((habitat: Habitat) => {
        setHabitatFilter(habitat);
        queryResult.setFilter((species) => species.habitat === habitat);
    }, [queryResult]);

    const filterByDiet = useCallback((diet: Diet) => {
        setDietFilter(diet);
        queryResult.setFilter((species) => species.diet === diet);
    }, [queryResult]);

    const filterByKingdom = useCallback((kingdom: Kingdom) => {
        setKingdomFilter(kingdom);
        queryResult.setFilter((species) => species.kingdom === kingdom);
    }, [queryResult]);

    const filterByClass = useCallback((classType: Class) => {
        setClassFilter(classType);
        queryResult.setFilter((species) => species.class === classType);
    }, [queryResult]);

    const filterByFamily = useCallback((family: Family) => {
        setFamilyFilter(family);
        queryResult.setFilter((species) => species.family === family);
    }, [queryResult]);

    const clearFilters = useCallback(() => {
        setNameFilter(null);
        setScientificNameFilter(null);
        setHabitatFilter(null);
        setDietFilter(null);
        setKingdomFilter(null);
        setClassFilter(null);
        setFamilyFilter(null);
        queryResult.setFilter(() => true);
    }, [queryResult]);

    // Sort handlers
    const sortByName = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('name', descending);
    }, [queryResult]);

    const sortByScientificName = useCallback((descending: boolean = false) => {
        queryResult.setOrdering('scientificName', descending);
    }, [queryResult]);

    return {
        // Base query properties
        ...queryResult,

        // Species-specific filter methods
        filterByName,
        filterByScientificName,
        filterByHabitat,
        filterByDiet,
        filterByKingdom,
        filterByClass,
        filterByFamily,
        clearFilters,

        // Sort methods
        sortByName,
        sortByScientificName,

        // Current filter states
        currentNameFilter: nameFilter,
        currentScientificNameFilter: scientificNameFilter,
        currentHabitatFilter: habitatFilter,
        currentDietFilter: dietFilter,
        currentKingdomFilter: kingdomFilter,
        currentClassFilter: classFilter,
        currentFamilyFilter: familyFilter,
    };
}