import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EncyclopediaScreen from '@/screens/EncyclopediaScreen';
import * as useSpeciesHook from '@/hooks/viewModels/useGetSpecies';
import { Specie,Habitat,Diet,Family,Climate,Kingdom,Class, User } from '@/model/domain';
import { useAuthStore } from  '@/context/zustand/store/useAuthStore';

const cat = new Specie(
          1,
          "Chat",
          "Felis catus",
          "Petit mammifère carnivore domestique.",
          new Habitat('maison', Climate.Temperate),
          Diet.Carnivores,
          Kingdom.Animal,
          Class.Mammals,
          Family.Felidae,
          [],
          ""
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
    expect(getByTestId('Loading')).toBeTruthy();
  });

  it('affiche une erreur et permet de réessayer', () => {
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
    expect(getByText(/Erreur de chargement/i)).toBeTruthy();
    fireEvent.press(getByText('Réessayer'));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('affiche les espèces', async () => {
    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [
        cat,
        new Specie(
          2,
          "Chien",
          "Canis lupus familiaris",
          "Mammifère domestique, compagnon de l'homme.",
          new Habitat('maison', Climate.Temperate),
          Diet.Omnivores,
          Kingdom.Animal,
          Class.Mammals,
          Family.Canid,
          [],
          ""
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

  it('affiche le message vide quand aucune espèce', () => {
    jest.spyOn(useSpeciesHook, 'useGetSpecies').mockReturnValue({
      species: [],
      isLoading: false,
      isLoadingMore: false,
      isListEnd: true,
      error: null,
      refresh: jest.fn(),
      fetchMoreData: jest.fn(),
    });

    const { getByText } = render(<EncyclopediaScreen />);
    expect(getByText('Aucune espèce trouvée.')).toBeTruthy();
  });
});