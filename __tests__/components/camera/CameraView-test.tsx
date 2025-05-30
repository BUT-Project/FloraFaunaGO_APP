import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CustomCameraView, {mockedBase64,mockedUri,permLoading} from '@/components/camera/CameraView';
import * as CameraHooks from '@/components/camera/hooks';

// Mocks
jest.mock('@/components/camera/CameraControls', () => {
  const React = require('react');
  const { Button } = require('react-native');
  return {
    __esModule: true,
    default: ({ handleCapturePress }: any) => (
      <Button title="Capture" testID="CameraControls.Capture" onPress={handleCapturePress} />
    ),
  };
});

jest.mock('@/components/ui/Loading', () => ({ text }: any) => {
  const React = require('react');
  const { Text } = require('react-native');
  return <Text>{text}</Text>;
});

// Setup mocks for useCamera hook
const mockUseCamera = (permission: any = null) => {
  jest.spyOn(CameraHooks, 'useCamera').mockReturnValue({
    facing: 'back',
    toggleCameraFacing: jest.fn(),
    permission,
    requestPerm: jest.fn(),
  });
};

describe('CustomCameraView', () => {
  const setBase64Image = jest.fn();
  const setCapturedImage = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le chargement si permission est null', () => {
    mockUseCamera(null);
    const { getByText } = render(
      <CustomCameraView setBase64Image={setBase64Image} setCapturedImage={setCapturedImage} />
    );
    expect(getByText(permLoading)).toBeTruthy();
  });

  it('affiche un message si permission refusée', () => {
    mockUseCamera({ granted: false });
    const { getByText, getByTestId } = render(
      <CustomCameraView setBase64Image={setBase64Image} setCapturedImage={setCapturedImage} />
    );
    expect(
      getByText(/Nous avons besoin de votre permission/i)
    ).toBeTruthy();
    expect(getByTestId('AllowPermission.Button')).toBeTruthy();
  });

  it('affiche la caméra si permission accordée', () => {
    mockUseCamera({ granted: true });
    const { queryByTestId } = render(
      <CustomCameraView setBase64Image={setBase64Image} setCapturedImage={setCapturedImage} />
    );
    expect(queryByTestId('AllowPermission.Button')).toBeNull();
    expect(queryByTestId("CameraControls.Capture")).toBeTruthy();
  });

  it('capture une image (mockée) en mode développement', async () => {
    mockUseCamera({ granted: true });
    (global as any).__DEV__ = true;

    const { getByTestId } = render(
      <CustomCameraView setBase64Image={setBase64Image} setCapturedImage={setCapturedImage} />
    );

    fireEvent.press(getByTestId('CameraControls.Capture'));

    await waitFor(() => {
      expect(setCapturedImage).toHaveBeenCalledWith(mockedUri);
      expect(setBase64Image).toHaveBeenCalledWith(mockedBase64);
    });
  });
});