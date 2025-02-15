import 'react-native-gesture-handler/jestSetup';


jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(() => null),
}));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));


jest.mock('react-native-snap-carousel', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock('react-native-snap-carousel', () => {
    const React = require('react');
    const { View } = require('react-native');
  
    return {
      __esModule: true,
      default: jest.fn().mockImplementation(({ data, renderItem }) => {
        return (
          <View testID="mock-carousel">
            {data.map((item, index) => (
              <View key={item.key || index}>{renderItem({ item, index })}</View>
            ))}
          </View>
        );
      }),
      Pagination: jest.fn().mockReturnValue(null), // Mock la pagination si nécessaire
    };
  });

import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);