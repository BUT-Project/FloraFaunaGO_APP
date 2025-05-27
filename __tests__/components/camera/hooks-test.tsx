import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { useCamera } from '@/components/camera/hooks';

// Mock expo-camera
jest.mock('expo-camera', () => {
  return {
    useCameraPermissions: jest.fn(() => [
      { granted: false, canAskAgain: true },
      jest.fn(),
    ]),
  };
});

function TestComponent() {
  const { facing, toggleCameraFacing, permission, requestPerm } = useCamera();

  return (
    <>
      <Text testID="facing">{facing}</Text>
      <Text testID="granted">{permission?.granted ? 'true' : 'false'}</Text>
      <Button testID='Toggle.Button' title="Toggle" onPress={toggleCameraFacing} />
      <Button testID='RequestPerm.Button' title="Request" onPress={requestPerm} />
    </>
  );
}

describe('useCamera (via component)', () => {
  it('should initialize with "back"', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('facing').props.children).toBe('back');
  });

  it('should toggle camera facing', async() => {
    const { getByTestId, getByText } = render(<TestComponent />);
    expect(getByTestId('facing').props.children).toBe('back');

    await act(async() => {
       fireEvent.press(getByTestId("Toggle.Button"))
    });
    expect(getByTestId('facing').props.children).toBe('front');

    await act(async() => {
        fireEvent.press(getByTestId("Toggle.Button"))
    });
    expect(getByTestId('facing').props.children).toBe('back');
  });

  it('should call requestPerm (no error)', () => {
    const { getByTestId } = render(<TestComponent />);
    act(() => {
        fireEvent.press(getByTestId("RequestPerm.Button"))
    });

    // rien à tester ici tant que la fonction est mockée, mais au moins ça ne crash pas
  });
});