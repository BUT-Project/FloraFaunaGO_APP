import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';


interface ProgressBarProps {
  maxSteps: number;
  currentStep: number;
  style?: StyleProp<ViewStyle>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ maxSteps, currentStep, style }) => {

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxSteps }).map((_, index) => (
        <View
          key={index}
          style={[styles.step, {backgroundColor: currentStep > index ? Colors.light.success : "#fff"}]} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  step: {
    width: 35,
    marginHorizontal: 5,
    height: 20,
    borderRadius: 10,
  },
});

export default ProgressBar;