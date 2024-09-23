import React, {useEffect} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Canvas, Circle, Group} from '@shopify/react-native-skia';
import {
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    useDerivedValue,
    SharedValue,
} from 'react-native-reanimated';

const NUM_X = 4;
const NUM_Y = 5;
const TOTAL = NUM_X * NUM_Y;

interface CircleData {
    radius: SharedValue<number>;
    opacity: SharedValue<number>;
}

interface AnimatedCircleProps {
    x: number;
    y: number;
    radius: SharedValue<number>;
    opacity: SharedValue<number>;
    color: string;
}

interface ProgressIndicatorProps {
    width: number;
    height: number;
    color?: string;
    padding?: number;
    style?: ViewStyle;
}

export default function ARProgressIndicator({
                                                width = 300,
                                                height = 300,
                                                color = "white",
                                                padding = 20,
                                                style,
                                            }: ProgressIndicatorProps) {
    const contentWidth = width - 2 * padding;
    const contentHeight = height - 2 * padding;

    const baseRadius = Math.min(contentWidth / (NUM_X * 2), contentHeight / (NUM_Y * 2)) * 0.4;

    const circles: CircleData[] = Array(TOTAL).fill(0).map(() => ({
        radius: useSharedValue(baseRadius),
        opacity: useSharedValue(1),
    }));

    useEffect(() => {
        circles.forEach((circle) => {
            const duration = 400 + Math.random() * 300;

            circle.radius.value = withRepeat(
                withSequence(
                    withTiming(baseRadius * 1.5, {duration: duration - 50}),
                    withTiming(baseRadius, {duration})
                ),
                -1
            );

            circle.opacity.value = withRepeat(
                withSequence(
                    withTiming(0.1, {duration: duration - 50}),
                    withTiming(1, {duration})
                ),
                -1
            );
        });
    }, [circles, baseRadius]);

    const marginX = contentWidth / NUM_X;
    const marginY = contentHeight / NUM_Y;

    return (
        <View style={[styles.container, {width, height}, style]}>
            <Canvas style={{flex: 1, width, height}}>
                {circles.map((circle, i) => {
                    const x = padding + (i % NUM_X + 0.5) * marginX;
                    const y = padding + (Math.floor(i / NUM_X) + 0.5) * marginY;

                    const animatedRadius = useDerivedValue(() => circle.radius.value);
                    const animatedOpacity = useDerivedValue(() => circle.opacity.value);

                    return (
                        <AnimatedCircle
                            key={i}
                            x={x}
                            y={y}
                            radius={animatedRadius}
                            opacity={animatedOpacity}
                            color={color}
                        />
                    );
                })}
            </Canvas>
        </View>
    );
};

function AnimatedCircle({x, y, radius, opacity, color}: AnimatedCircleProps) {
    return (
        <Group>
            <Circle cx={x} cy={y} r={radius} opacity={opacity} color={color}/>
        </Group>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
});

