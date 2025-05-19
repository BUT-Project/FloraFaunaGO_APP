import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

interface TimeBarProps {
    timeLeft: number | null;
    maxTime: number;
}

const TimeBar: React.FC<TimeBarProps> = ({ timeLeft, maxTime }) => {
    if(!timeLeft) return null; 
    const progress = useSharedValue(timeLeft / maxTime);

    useEffect(() => {
        progress.value = withTiming(timeLeft / maxTime, { duration: 100 });
    }, [timeLeft, maxTime]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 0.5, 1],             // timeLeft/maxTime from 0 (no time) to 1 (full time)
            ['#e74c3c', '#f1c40f', '#2ecc71'] // red → yellow → green
        );

        return {
            width: `${progress.value * 100}%`,
            backgroundColor,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 10,
        backgroundColor: '#555',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});

export default TimeBar;