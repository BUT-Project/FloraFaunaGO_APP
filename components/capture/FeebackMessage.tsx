import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ui/themed';

export interface FeedbackMessage {
    text: string;
    type: 'success' | 'error';
};

interface Props {
    message: FeedbackMessage;
};

const FeedbackMessageToast = ({ message }: Props) => {
  const translateY = useSharedValue(-30); // start slightly above

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backgroundColor = message.type === 'success' ? '#2ecc71' : '#e74c3c';

  return (
    <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]}>
      <ThemedText style={styles.text}>{message.text}</ThemedText>
    </Animated.View>
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