import React, { useEffect } from 'react';
import { StyleSheet, TouchableHighlight,Text,View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { FeedbackMessage } from './game/types';
import { Ionicons } from '@expo/vector-icons';

const backgroundColors = {
    success: Colors.light.success,
    error: Colors.light.error,
    info: 'rgba(56, 56, 56, 0.4)',
};

const underlayColors ={
  success: Colors.dark.success,
  error: Colors.dark.error,
  info: 'rgba(119, 119, 119, 0.4)',
}
interface Props {
    testID?: string;
    message: FeedbackMessage;
    onPress?: () => void;
};

const FeedbackMessageToast = ({ testID,message, onPress }: Props) => {
  const translateY = useSharedValue(-30); // start slightly above

  useEffect(() => {
    translateY.set(withTiming(0, { duration: 300 })) 
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  const backgroundColor = backgroundColors[message.type] || backgroundColors.info;
  const underlayColor = underlayColors[message.type] || underlayColors.info;

  return (
    <TouchableHighlight  onPress={onPress} underlayColor={underlayColor}>
      <Animated.View style={animatedStyle}>
        
        {message.icon && (
          <View style={[styles.iconContainer,{backgroundColor}]}>
            <Ionicons name={message.icon} size={37} color={"#fff"}/>
          </View>
          )}
        <View style={[styles.textContainer,{backgroundColor}]}>
          <Text testID={testID} style={styles.text}>{message.text}</Text>

        </View>
      </Animated.View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
 
  textContainer:{
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconContainer:{
    alignSelf: 'center',
    paddingTop: 7,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default FeedbackMessageToast;