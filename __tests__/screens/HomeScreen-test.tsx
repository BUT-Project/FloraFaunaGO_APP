import React from 'react';
import {fireEvent, waitFor, act} from '@testing-library/react-native';
import { renderWithProviders as render } from '@/shared/utils/renderWithProviders';
import HomeScreen from '@/screens/HomeScreen';
import * as imageService from '@/services/imageQuality';
import { useRouter } from 'expo-router';
import { mockedBase64,mockedImageUri } from '@/__mocks__/components/camera/CameraView';

jest.mock('../../components/camera', () => require('../../__mocks__/components/camera'));
jest.mock('@/components/MainMapView',()=> require("@/__mocks__/components/MainMapView") );

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('@/services/imageQuality', () => ({
  isImageBlurry: jest.fn(),
}));
jest.mock('@/dal/StubLib/StubData', () => ({
  getInstance: jest.fn(() => ({
    speciesRepository: {
      identifySpecies: jest.fn(() => Promise.resolve({ id: '1', name: 'Test Specie' })),
    },
  })),
}));

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("doit s'afficher avec tout ses éléments",async() => {
        const { getByTestId,queryByTestId } = render(<HomeScreen />);
        //expect(queryByTestId("mockMap")).toBeNull();
        expect(queryByTestId("mockCamera")).toBeTruthy();
        expect(getByTestId("Tab.Map")).toBeTruthy();
        expect(getByTestId("Tab.Camera")).toBeTruthy();
  });
  it("doit passer à la map view  lorsqu'on appui sur le bouton 'Map' ", async () => {
        const { getByTestId } = render(<HomeScreen />);
        const mapButton = getByTestId('Tab.Map');
        fireEvent.press(mapButton);
        expect(mapButton).toBeTruthy();
        expect(getByTestId("mockMap")).toBeTruthy();
  });

  it("doit lancer une alert si l'image est flou", async () => {
    const { isImageBlurry } = imageService;
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (isImageBlurry as jest.Mock).mockResolvedValue(true);

    const { getByTestId } = render(<HomeScreen />);

    await act(async () => {
      fireEvent.press(getByTestId('Capture.Button'))
    });

    await waitFor(() => {
      expect(isImageBlurry).toHaveBeenCalledWith(mockedImageUri);
    });

    expect(push).not.toHaveBeenCalled();
  });
});