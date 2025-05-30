import React from 'react';
import { View, Text } from 'react-native';

const MainMapView = ({ style }: any) => {
  return (
    <View style={style} testID="mockMap">
      <Text>Mocked Map</Text>
    </View>
  );
};

export default MainMapView;