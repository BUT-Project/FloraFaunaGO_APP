import React, { useEffect } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/themed';
import { Colors } from '@/constants/Colors';

export interface FeedbackMessage {
    text: string;
    type: 'success' | 'error' | 'info';
};

const backgroundColors = {
    success: Colors.light.success,
    error: Colors.light.error,
    info: 'rgba(56, 56, 56, 0.3)',
};

const underlayColors ={
  success: Colors.dark.success,
  error: Colors.dark.error,
  info: 'rgba(119, 119, 119, 0.3)',
}
interface Props {
    message: FeedbackMessage;
    onPress?: () => void;
};

const FeedbackMessageToast = ({ message, onPress }: Props) => {
  const translateY = useSharedValue(-30); // start slightly above

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backgroundColor = backgroundColors[message.type] || backgroundColors.info;
  const underlayColor = underlayColors[message.type] || underlayColors.info;

  return (
    <TouchableHighlight onPress={onPress} underlayColor={underlayColor}>
      <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]}>
        <ThemedText style={styles.text}>{message.text}</ThemedText>
      </Animated.View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 7,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default FeedbackMessageToast;