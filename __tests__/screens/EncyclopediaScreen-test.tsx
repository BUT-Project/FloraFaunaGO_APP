import React from 'react';
import { renderWithProviders as render } from '@/shared/utils/renderWithProviders';
import { fireEvent, act } from '@testing-library/react-native';
import EncyclopediaScreen ,{EMPTY_TEXT,ERROR_TEXT,LOADING_TEXT} from '@/screens/EncyclopediaScreen';
import * as useInfiniteSpeciesHook from '@/hooks/viewModels/useInfiniteSpecies';
import { Specie, Habitat, Diet, Family, Climate, Kingdom, Class } from '@/model/domain';
import { useAuthStore } from '@/context/zustand/store/useAuthStore';
import { ISpeciesRepository } from '@/dal/repository/ISpeciesRepository';

const cat = new Specie(
    "1",
    "Chat",
    "Felis catus",
    "",
    "Petit mammifère carnivore domestique.",
    new Habitat('maison', Climate.TEMPERATE),
    Diet.CARNIVORA,
    Kingdom.ANIMALIA,
    Class.MAMMALIA,
    Family.FELIDAE,
    [],
);

const dog = new Specie(
    "2",
    "Chien",
    "",
    "Canis lupus familiaris",
  
    "Mammifère domestique, compagnon de l'homme.",
    new Habitat('maison', Climate.TEMPERATE),
    Diet.OMNIVORA,
    Kingdom.ANIMALIA,
    Class.MAMMALIA,
    Family.CANIDAE,
    [],
  
);

// Mock the repository
const mockRepository: ISpeciesRepository = {
    getSpecies: jest.fn(),
    getSpeciesById: jest.fn(),
    searchSpecies: jest.fn(),
    // Add other methods as needed
} as any;

jest.mock('@/context/zustand/store/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

describe('EncyclopediaScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ((useAuthStore as unknown) as jest.Mock).mockImplementation((selector) =>
            selector({
                user: {
                    captures: ["Capture 1", "Capture 2"],
                },
            })
        );
    });

    it('affiche le loader au chargement', () => {
        jest.spyOn(useInfiniteSpeciesHook, 'useInfiniteSpecies').mockReturnValue({
            // BaseInfiniteResult properties
            items: [],
            totalItems: 0,
            currentPage: 1,
            isLoading: true,
            isFetching: false,
            isError: false,
            error: null,
            hasNextPage: false,
            hasPreviousPage: false,
            fetchNextPage: jest.fn(),
            fetchPreviousPage: jest.fn(),
            refresh: jest.fn(),

            // SpecieFilterState properties
            currentNameFilter: null,
            currentScientificNameFilter: null,
            currentDietFilter: null,
            currentKingdomFilter: null,
            currentClassFilter: null,
            currentFamilyFilter: null,

            // Filter and sort methods
            search: jest.fn(),
            toggleScientificNameFilter: jest.fn(),
            toggleDietFilter: jest.fn(),
            toggleKingdomFilter: jest.fn(),
            toggleClassFilter: jest.fn(),
            toggleFamilyFilter: jest.fn(),
            clearFilters: jest.fn(),
            applyFilters: jest.fn(),
            sortByName: jest.fn(),
            sortByScientificName: jest.fn(),
        });

        const { getByText } = render(<EncyclopediaScreen speciesRepository={mockRepository} />);
        expect(getByText('Chargement des espèces...')).toBeTruthy();
    });

    it('affiche une erreur et permet de réessayer', async () => {
        const mockRefresh = jest.fn();

        jest.spyOn(useInfiniteSpeciesHook, 'useInfiniteSpecies').mockReturnValue({
            // BaseInfiniteResult properties
            items: [],
            totalItems: 0,
            currentPage: 1,
            isLoading: false,
            isFetching: false,
            isError: true,
            error: new Error('Erreur de chargement'),
            hasNextPage: false,
            hasPreviousPage: false,
            fetchNextPage: jest.fn(),
            fetchPreviousPage: jest.fn(),
            refresh: mockRefresh,

            // SpecieFilterState properties
            currentNameFilter: null,
            currentScientificNameFilter: null,
            currentDietFilter: null,
            currentKingdomFilter: null,
            currentClassFilter: null,
            currentFamilyFilter: null,

            // Filter and sort methods
            search: jest.fn(),
            toggleScientificNameFilter: jest.fn(),
            toggleDietFilter: jest.fn(),
            toggleKingdomFilter: jest.fn(),
            toggleClassFilter: jest.fn(),
            toggleFamilyFilter: jest.fn(),
            clearFilters: jest.fn(),
            applyFilters: jest.fn(),
            sortByName: jest.fn(),
            sortByScientificName: jest.fn(),
        });

        const { getByText } = render(<EncyclopediaScreen speciesRepository={mockRepository} />);
        expect(getByText(ERROR_TEXT)).toBeTruthy();
        const button = getByText("Réessayer");
        fireEvent.press(button);
        expect(mockRefresh).toHaveBeenCalled();
    });

    it('affiche les espèces', async () => {
        jest.spyOn(useInfiniteSpeciesHook, 'useInfiniteSpecies').mockReturnValue({
            // BaseInfiniteResult properties
            items: [cat, dog],
            totalItems: 2,
            currentPage: 1,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            hasNextPage: false,
            hasPreviousPage: false,
            fetchNextPage: jest.fn(),
            fetchPreviousPage: jest.fn(),
            refresh: jest.fn(),

            // SpecieFilterState properties
            currentNameFilter: null,
            currentScientificNameFilter: null,
            currentDietFilter: null,
            currentKingdomFilter: null,
            currentClassFilter: null,
            currentFamilyFilter: null,

            // Filter and sort methods
            search: jest.fn(),
            toggleScientificNameFilter: jest.fn(),
            toggleDietFilter: jest.fn(),
            toggleKingdomFilter: jest.fn(),
            toggleClassFilter: jest.fn(),
            toggleFamilyFilter: jest.fn(),
            clearFilters: jest.fn(),
            applyFilters: jest.fn(),
            sortByName: jest.fn(),
            sortByScientificName: jest.fn(),
        });

        const { getByText } = render(<EncyclopediaScreen speciesRepository={mockRepository} />);
        expect(getByText('Chat')).toBeTruthy();
        expect(getByText('Chien')).toBeTruthy();
    });

  it('affiche le message vide quand aucune espèce et permet de réessayer', () => {
    const mockRefresh = jest.fn()
       jest.spyOn(useInfiniteSpeciesHook, 'useInfiniteSpecies').mockReturnValue({
            // BaseInfiniteResult properties
            items: [],
            totalItems: 1,
            currentPage: 1,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            hasNextPage: false,
            hasPreviousPage: false,
            fetchNextPage: jest.fn(),
            fetchPreviousPage: jest.fn(),
            refresh: mockRefresh,

            // SpecieFilterState properties
            currentNameFilter: null,
            currentScientificNameFilter: null,
            currentDietFilter: null,
            currentKingdomFilter: null,
            currentClassFilter: null,
            currentFamilyFilter: null,

            // Filter and sort methods
            search: jest.fn(),
            toggleScientificNameFilter: jest.fn(),
            toggleDietFilter: jest.fn(),
            toggleKingdomFilter: jest.fn(),
            toggleClassFilter: jest.fn(),
            toggleFamilyFilter: jest.fn(),
            clearFilters: jest.fn(),
            applyFilters: jest.fn(),
            sortByName: jest.fn(),
            sortByScientificName: jest.fn(),
      });


    const { getByTestId } = render(<EncyclopediaScreen speciesRepository={mockRepository} />);

    
    expect(getByTestId("Empty.Text")).toBeTruthy();
    expect(getByTestId("Empty.Text").children).toEqual([EMPTY_TEXT]);

    const button = getByTestId("Refresh");
    fireEvent.press(button);
    expect(mockRefresh).toHaveBeenCalled();
  });

    it("appeler refresh lorsque d'un pull and refresh sur la Flat List", async () => {
        const mockRefresh = jest.fn();

        jest.spyOn(useInfiniteSpeciesHook, 'useInfiniteSpecies').mockReturnValue({
            // BaseInfiniteResult properties
            items: [cat],
            totalItems: 1,
            currentPage: 1,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            hasNextPage: false,
            hasPreviousPage: false,
            fetchNextPage: jest.fn(),
            fetchPreviousPage: jest.fn(),
            refresh: mockRefresh,

            // SpecieFilterState properties
            currentNameFilter: null,
            currentScientificNameFilter: null,
            currentDietFilter: null,
            currentKingdomFilter: null,
            currentClassFilter: null,
            currentFamilyFilter: null,

            // Filter and sort methods
            search: jest.fn(),
            toggleScientificNameFilter: jest.fn(),
            toggleDietFilter: jest.fn(),
            toggleKingdomFilter: jest.fn(),
            toggleClassFilter: jest.fn(),
            toggleFamilyFilter: jest.fn(),
            clearFilters: jest.fn(),
            applyFilters: jest.fn(),
            sortByName: jest.fn(),
            sortByScientificName: jest.fn(),
        });

        const { getByTestId } = render(<EncyclopediaScreen speciesRepository={mockRepository} />);
        const List = getByTestId("Encyclopedia.Flatlist");
        expect(List).toBeDefined();

        const { refreshControl } = List.props;
        await act(async () => {
            refreshControl.props.onRefresh();
        });

        expect(mockRefresh).toHaveBeenCalled();
    });
});