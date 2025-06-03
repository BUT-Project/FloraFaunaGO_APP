import React from 'react';
import { View, Button } from 'react-native';


export const mockedImageUri = "'mock://image-uri'"
export const mockedBase64 ='mocked-base64-data'

export const CameraView = ({ setBase64Image, setCapturedImage, style }: any) => {
  return (
    <View style={style} testID="mockCamera">
      <Button
        testID='Capture.Button'
        title="Simuler capture"
        onPress={() => {
          setCapturedImage(mockedImageUri);
          setBase64Image(mockedImageUri);
        }}
      />
    </View>
  );
};