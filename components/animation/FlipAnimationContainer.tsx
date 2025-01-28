import React, { useState, ReactNode, forwardRef } from "react";
import {StyleSheet, Pressable, ViewStyle, PressableProps, View} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
} from "react-native-reanimated";

interface FlipAnimationContainerProps extends PressableProps {
    frontContent: ReactNode;
    backContent: ReactNode;
    containerStyle?: ViewStyle;
    onFaceChange?: (isBackVisible: boolean) => void;
}

const FlipAnimationContainer = forwardRef<View, FlipAnimationContainerProps>(
    ({ frontContent, backContent, containerStyle, onFaceChange, ...pressableProps }, ref) => {
        const [isFlipped, setIsFlipped] = useState(false);
        const flipRotation = useSharedValue(0);
        const flipScale = useSharedValue(1);
        const flipTranslateX = useSharedValue(0);

        const frontFlipAnimatedStyle = useAnimatedStyle(() => ({
            transform: [
                { perspective: 1000 },
                { rotateY: `${flipRotation.value}deg` },
                { scale: flipScale.value },
                { translateX: flipTranslateX.value },
            ],
            backfaceVisibility: "hidden",
        }));

        const backFlipAnimatedStyle = useAnimatedStyle(() => ({
            transform: [
                { perspective: 1000 },
                { rotateY: `${flipRotation.value + 180}deg` },
                { scale: flipScale.value },
                { translateX: flipTranslateX.value },
            ],
            backfaceVisibility: "hidden",
        }));

        const triggerFlipAnimation = () => {
            setIsFlipped(!isFlipped);
            if (onFaceChange) {
                onFaceChange(!isFlipped);
            }
            flipScale.value = withSequence(
                withTiming(0.9, { duration: 200 }),
                withTiming(1, { duration: 200 })
            );
            flipTranslateX.value = withSequence(
                withTiming(isFlipped ? 25 : -25, { duration: 200 }),
                withTiming(0, { duration: 200 })
            );

            flipRotation.value = withDelay(
                200,
                withTiming(isFlipped ? 0 : 180, { duration: 500 })
            );
        };

        return (
            <View
                ref={ref}
            >
                <Pressable
                    onPress={triggerFlipAnimation}
                    style={[styles.flipContainer, containerStyle]}
                    {...pressableProps}
                >
                    <Animated.View style={[styles.flipCard, frontFlipAnimatedStyle]}>
                        {frontContent}
                    </Animated.View>
                    <Animated.View style={[styles.flipCard, backFlipAnimatedStyle]}>
                        {backContent}
                    </Animated.View>
                </Pressable>
            </View>

        );
    }
);

const styles = StyleSheet.create({
    flipContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipCard: {
        position: "absolute",
        backfaceVisibility: "hidden",
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FlipAnimationContainer;