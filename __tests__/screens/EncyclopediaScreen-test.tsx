import React from 'react';
import { renderWithProviders as render } from '@/shared/utils/renderWithProviders';
import { fireEvent, act } from '@testing-library/react-native';
import EncyclopediaScreen,{EMPTY_TEXT,ERROR_TEXT,LOADING_TEXT} from '@/screens/EncyclopediaScreen';
import * as useSpeciesHook from '@/hooks/viewModels/useGetSpecies';
import { Specie,Habitat,Diet,Family,Climate,Kingdom,Class } from '@/model/domain';
import { useAuthStore } from  '@/context/zustand/store/useAuthStore';

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
    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [],
      isLoading: true,
      isLoadingMore: false,
      isListEnd: false,
      error: null,
      refresh: jest.fn(),
      fetchMoreData: jest.fn(),
    });

    const { getByTestId } = render(<EncyclopediaScreen />);
    expect(getByTestId('Loading.Indicator')).toBeTruthy();
    expect(getByTestId('Loading.Text')).toBeTruthy();
    expect(getByTestId('Loading.Text').children).toEqual([LOADING_TEXT])

  });

  it('affiche une erreur et permet de réessayer', async () => {
    const mockRefresh = jest.fn();

    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [],
      isLoading: false,
      isLoadingMore: false,
      isListEnd: false,
      error: new Error('Erreur de chargement'),
      refresh: mockRefresh,
      fetchMoreData: jest.fn(),
    });

    const { getByText } = render(<EncyclopediaScreen />);
    expect(getByText(ERROR_TEXT)).toBeTruthy();
    const button = getByText("Réessayer");
    fireEvent.press(button);
    expect(mockRefresh).toHaveBeenCalled();
  });


  it('affiche les espèces', async () => {
    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [
        cat,
        new Specie(
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
   
        )
      ],
      isLoading: false,
      isLoadingMore: false,
      isListEnd: true,
      error: null,
      refresh: jest.fn(),
      fetchMoreData: jest.fn(),
    });

    const { getByText } = render(<EncyclopediaScreen />);
    expect(getByText('Chat')).toBeTruthy();
    expect(getByText('Chien')).toBeTruthy();
  });

  it('affiche le message vide quand aucune espèce et permet de réessayer', () => {
    const mockRefresh = jest.fn()
    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [],
      isLoading: false,
      isLoadingMore: false,
      isListEnd: true,
      error: null,
      refresh: mockRefresh,
      fetchMoreData: jest.fn(),
    });

    const { getByTestId } = render(<EncyclopediaScreen />);

    
    expect(getByTestId("Empty.Text")).toBeTruthy();
    expect(getByTestId("Empty.Text").children).toEqual([EMPTY_TEXT]);

    const button = getByTestId("Refresh");
    fireEvent.press(button);
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("appeler refresh lorsque d'un pull and refresh sur la Flat List", async () => {
    const mockRefresh = jest.fn();

    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [cat],
      isLoading: false,
      isLoadingMore: false,
      isListEnd: true,
      error: null,
      refresh: mockRefresh,
      fetchMoreData: jest.fn(),
    });

    const { getByTestId } = render(<EncyclopediaScreen />);
    const List = getByTestId("Encyclopedia.Flatlist");
    expect(List).toBeDefined();

    const { refreshControl } = List.props;
    await act(async() => {
      refreshControl.props.onRefresh();
    });

    expect(mockRefresh).toHaveBeenCalled();
  });
});