import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
    maxSteps: number;
    currentStep: number;
    style?: StyleProp<ViewStyle>;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ maxSteps, currentStep,style }) => {
    const progress = useSharedValue(currentStep);

    React.useEffect(() => {
        progress.value = withTiming(currentStep, { duration: 500 });
    }, [currentStep]);

    return (
        <View style={[styles.container, style]}>
            {Array.from({ length: maxSteps }).map((_, index) => {
                const animatedStyle = useAnimatedStyle(() => ({
                    backgroundColor:
                        index < progress.value
                            ? Colors.light.success // Green for completed steps
                            : 'rgba(224, 224, 224, 1)', // Gray for incomplete steps
                }));
                return (
                    <Animated.View
                        key={index}
                        style={[styles.step, animatedStyle]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    step: {
        width: 35,
        height: 17,
        borderRadius: 17,
        marginHorizontal: 5,
    },
});

export default ProgressBar;