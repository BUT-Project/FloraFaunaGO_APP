import React, {useEffect, useRef} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Animated, {interpolate, SharedValue, useAnimatedStyle, useSharedValue,} from 'react-native-reanimated';
import {ThumbType} from "@/screens/RevealScreen";

interface ThumbAnimationViewProps {
    customThumbView: React.ReactNode;
    position: { x: number; y: number };
    thumbnail: ThumbType;
    thumbAnimation: SharedValue<number>;
    size?: { width: number; height: number };
}

export default function ThumbAnimationView({
                                               thumbnail,
                                               customThumbView,
                                               position,
                                               thumbAnimation,
                                               size = {width: 150, height: 150},
                                           }: ThumbAnimationViewProps) {
    const window = useWindowDimensions();

    const thumbRef = useRef<Animated.View>(null);

    const thumbCoords = useSharedValue({x: position.x, y: position.y});
    const tabCoords = useSharedValue({
        x: window.width / 2,
        y: window.height - 100,
    });

    useEffect(() => {
        if (!customThumbView) {
            thumbAnimation.value = 0;
        }
    }, [customThumbView,thumbAnimation]);

    function calcBezier(
        interpolatedValue: number,
        p0: number,
        p1: number,
        p2: number,
    ) {
        'worklet';
        return Math.round(
            Math.pow(1 - interpolatedValue, 2) * p0 +
            2 * (1 - interpolatedValue) * interpolatedValue * p1 +
            Math.pow(interpolatedValue, 2) * p2,
        );
    }

    const thumbStyle = useAnimatedStyle(() => {
        const tab = tabCoords.value;
        const img = thumbCoords.value;

        const translateX = calcBezier(thumbAnimation.value, img.x, tab.x, tab.x);
        const translateY = calcBezier(
            thumbAnimation.value,
            img.y,
            img.y - 10,
            tab.y - 10,
        );

        return {
            transform: [
                {translateX: translateX - thumbCoords.value.x},
                {translateY: translateY - thumbCoords.value.y},
                {scale: interpolate(thumbAnimation.value, [0, 1], [1, 0])},
            ],
        };
    });
    // useEffect(() => {
    //     console.log(`
    //     ${thumbCoords.value.x} & ${thumbCoords.value.y} should be ${position.x} & ${position.y},
    //     width: ${size.width} should be 250,
    //     height: ${size.height} should be 350,
    //     x: ${position.x} should be [207.5 - 125 - 10] so 72.5,
    //     y: ${position.y} should be [432.5 - 175 -10] so 247.5,
    //     `);
    // }, [size.width, size.height,position]);

    return (
        <Animated.View
            ref={thumbRef}
            style={[
                StyleSheet.absoluteFill,
                {
                    width: size.width,
                    height: size.height,
                    left: position.x,
                    top: position.y,
                    opacity: thumbnail?.anim ? 1 : 0,
                },
                thumbStyle,
            ]}
            pointerEvents="none"
            onLayout={_e =>
                thumbRef.current?.measure((_x, _y, _width, _height, px, py) => {
                    thumbCoords.value = {x: px, y: py};
                })
            }
        >
            <Animated.View>
                {customThumbView}
            </Animated.View>
        </Animated.View>
    );
}
// {
//     backgroundColor:"red",
//         width: 250,
//     height: 350,
//     flex: 1,
//     left: 207.5 - 125 - 10,
//     bottom: 0,
//     top: 432.5 - 175 -10,
//     // opacity: thumb?.anim ? 1 : 0, is anime ended
//     opacity: 1,
// },
