import {ReactNode, useEffect} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface EntranceFlipAnimationProps {
    content: ReactNode;
    onAnimationComplete?: () => void;
}

export default function EntranceFlipAnimation({content,onAnimationComplete}: EntranceFlipAnimationProps) {
    const translateX = useSharedValue(-SCREEN_WIDTH);
    const translateY = useSharedValue(SCREEN_HEIGHT * 0.5);
    const scale = useSharedValue(0.1);
    const rotate = useSharedValue(0);
    const contentOpacity = useSharedValue(0);

    useEffect(() => {
        const duration = 2500;
        translateX.value = withSequence(
            withTiming(SCREEN_WIDTH * 0.1, {duration: duration * 0.5, easing: Easing.out(Easing.back(1.5))}),
            withTiming(0, {duration: duration * 0.5, easing: Easing.inOut(Easing.quad)})
        );
        translateY.value = withSequence(
            withTiming(-SCREEN_HEIGHT * 0.2, {duration: duration * 0.5, easing: Easing.out(Easing.back(1.5))}),
            withTiming(0, {duration: duration * 0.5, easing: Easing.inOut(Easing.quad)})
        );
        scale.value = withSequence(
            withTiming(1.2, {duration: duration * 0.7, easing: Easing.out(Easing.back(1.5))}),
            withTiming(1, {duration: duration * 0.3, easing: Easing.inOut(Easing.quad)})
        );
        rotate.value = withTiming(720, {duration: duration, easing: Easing.inOut(Easing.quad)});
        contentOpacity.value = withDelay(
            duration,
            withTiming(1, {duration: 500, easing: Easing.inOut(Easing.quad)},
                (isFinished) => {
                    if (isFinished && onAnimationComplete) {
                        runOnJS(onAnimationComplete)();
                    }
                }
                ),
        );
    }, []);

    const wrapperStyle = useAnimatedStyle(() => ({
        transform: [
            {translateX: translateX.value},
            {translateY: translateY.value},
            {scale: scale.value},
            {rotateY: `${rotate.value}deg`},
        ],
    }));

    return (
        <Animated.View style={[styles.contentWrapper, wrapperStyle]}>
            {content}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    contentWrapper: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        backgroundColor: 'white',
    }
});
