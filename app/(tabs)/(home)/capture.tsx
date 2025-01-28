import React, {useEffect, useState} from 'react';
import {Canvas, Circle, Group, Image, SkImage, useClock, useImage,} from "@shopify/react-native-skia";
import {runOnJS, useDerivedValue, useSharedValue, withRepeat, withSequence, withTiming,} from 'react-native-reanimated';
import {Alert, Dimensions, TouchableOpacity, View} from "react-native";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {useRouter} from "expo-router";

const {width: screenWidth, height: screenHeight} = Dimensions.get("screen");
const center = {
    x: screenWidth / 2,
    y: screenHeight / 2,
};
const [upperLimit, lowerLimit] = [center.y - 200, center.y + 100];
const POKEBALL_BASE_SIZE = 50;

export default function PokemonCapture() {

    const router = useRouter();
    const clock = useClock();
    const [captureSuccess, setCaptureSuccess] = useState(false);

    const background: SkImage | null = useImage(require("@/assets/scene/landscape.jpg"));
    const pokemonImage: SkImage | null = useImage(require("@/assets/scene/pika.png"));
    const pokeball: SkImage | null = useImage(require("@/assets/scene/ball.png"));

    const isDragging = useSharedValue(false);
    const pokeballX = useSharedValue(center.x -20);
    const pokeballY = useSharedValue(screenHeight - 200);
    const pokeballScale = useSharedValue(POKEBALL_BASE_SIZE);

    const captureDifficulty = useSharedValue(0.5); // 0 (easy) to 1 (hard)
    const captureRingScale = useSharedValue(1);

    const pokemonX = useDerivedValue(() => {
        return center.x + Math.sin(clock.value / 1000) * 10;
    });
    const pokemonY = useDerivedValue(() => {
        return center.y + Math.cos(clock.value / 1500) * 10;
    });

    const groupTransform = useDerivedValue(() => [
        {translateX: pokemonX.value},
        {translateY: pokemonY.value}
    ]);

    useEffect(() => {
        captureRingScale.value = withRepeat(
            withSequence(
                withTiming(0.5, {duration: 1000}),
                withTiming(1, {duration: 1000})
            ),
            -1,
            true
        );
    }, []);

    const captureRingColor = useDerivedValue(() => {
        if (captureDifficulty.value < 0.3) return '#00FF00';
        if (captureDifficulty.value < 0.7) return '#FFFF00';
        return '#FF0000';
    });

    const checkCollision = () => {
        const pokeballSize = POKEBALL_BASE_SIZE * pokeballScale.value;
        const pokeballCenterX = pokeballX.value + pokeballSize / 2;
        const pokeballCenterY = pokeballY.value + pokeballSize / 2;
        const pokemonCenterX = pokemonX.value;
        const pokemonCenterY = pokemonY.value;

        const distance = Math.sqrt(
            Math.pow(pokeballCenterX - pokemonCenterX, 2) +
            Math.pow(pokeballCenterY - pokemonCenterY, 2)
        );

        const pokeballRadius = pokeballSize / 2;
        const pokemonRadius = 100 / 2;

        isColliding.value = distance < (pokeballRadius + pokemonRadius);
        return isColliding.value;
    };

    const onCapture = () => {
        const captureChance = Math.random();
        if (captureChance > captureDifficulty.value) {
            setCaptureSuccess(true);
            Alert.alert('Gotcha!', 'You captured the Pokémon!', [
                {text: 'OK', onPress: () => router.replace('/(home)/reveal')},
            ]);
        } else {
            Alert.alert('Oh no!', 'The Pokémon broke free!');
            resetPokeball();
        }
    };

    const resetPokeball = () => {
        pokeballX.value = withTiming(center.x - 20);
        pokeballY.value = withTiming(screenHeight - 200);
        pokeballScale.value = withTiming(50);
    };

    const handleThrowEnd = () => {
        const ballIsWithinCaptureArea = pokeballX.value > center.x - 150 && pokeballX.value < center.x + 150;
        if (ballIsWithinCaptureArea && checkCollision()) {
            onCapture();
        } else {
            resetPokeball();
        }
    };

    const isColliding = useSharedValue(false);
    const throwGesture = Gesture.Pan()
        .onStart(() => {
            isDragging.value = true;
        })
        .onUpdate((e) => {
            pokeballX.value = e.x;
            pokeballY.value = e.y;
        })
        .onEnd((e) => {
            isDragging.value = false;
            if (pokeballY.value < 700) {
                pokeballY.value = withTiming(300, {duration: 250});

                const diff = Math.abs(center.x - pokeballX.value);
                let animatedValue = pokeballX.value;

                if (!(diff < 100 && diff > 70)) {
                    const percentage = ((diff + 75) * 100) / center.x;
                    animatedValue = pokeballX.value * percentage;
                    animatedValue *= center.x - 75 > pokeballX.value ? -0.005 : 0.05;
                }

                pokeballX.value = withTiming(animatedValue, {duration: 1000});
                pokeballScale.value = withTiming(10, {duration: 600}, () => {
                    runOnJS(handleThrowEnd)();
                });
            } else {
                runOnJS(resetPokeball)();
            }
        });
    // const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 32);

    return (
        <GestureDetector gesture={throwGesture}>
            <View style={{flex: 1}}>
                <Canvas style={{flex: 1}}>
                    {background && (
                        <Image
                            image={background}
                            fit="cover"
                            x={0}
                            y={0}
                            width={screenWidth}
                            height={screenHeight}
                        />
                    )}
                    <Group transform={groupTransform}>
                        {pokemonImage && (
                            <Image
                                image={pokemonImage}
                                fit="contain"
                                x={-35}
                                y={-200}
                                width={100}
                                height={100}
                            />
                        )}
                        {!captureSuccess && (
                            <Circle
                                cx={0}
                                cy={-150}
                                r={50}
                                color={captureRingColor}
                                style="stroke"
                                strokeWidth={5}
                            />
                        )}
                        <Circle
                            cx={0}
                            cy={-150}
                            r={100 / 2}
                            color="red"
                            style="stroke"
                            strokeWidth={3}
                        />
                    </Group>
                    {/* Debug visuals */}
                    {/*<Circle*/}
                    {/*    cx={pokemonX}*/}
                    {/*    cy={pokemonY}*/}
                    {/*    r={100 / 2}*/}
                    {/*    color="rgba(255, 0, 0, 0.3)"*/}
                    {/*/>*/}
                    {/*<Circle*/}
                    {/*    cx={pokeballX}*/}
                    {/*    cy={pokeballY}*/}
                    {/*    r={POKEBALL_BASE_SIZE * pokeballScale.value / 2}*/}
                    {/*    color="rgba(0, 0, 255, 0.3)"*/}
                    {/*/>*/}
                    {/*<Line*/}
                    {/*    p1={{ x: pokemonX.value, y: pokemonY.value }}*/}
                    {/*    p2={{ x: pokeballX.value, y: pokeballY.value }}*/}
                    {/*    color="green"*/}
                    {/*    style="stroke"*/}
                    {/*    strokeWidth={2}*/}
                    {/*/>*/}
                    {/*<SkText*/}
                    {/*    x={10}*/}
                    {/*    y={30}*/}
                    {/*    font={font}*/}
                    {/*    text={`Colliding: ${isColliding.value ? 'Yes' : 'No'}`}*/}
                    {/*    color="white"*/}
                    {/*/>*/}

                    {pokeball && (
                        <Image
                            image={pokeball}
                            fit="cover"
                            x={pokeballX}
                            y={pokeballY}
                            width={pokeballScale}
                            height={pokeballScale}
                            origin={{x: POKEBALL_BASE_SIZE / 2, y: POKEBALL_BASE_SIZE / 2}}
                        />
                    )}
                </Canvas>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        padding: 16,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 8,
                    }}
                    onPress={() => {
                        captureDifficulty.value = Math.random();
                        resetPokeball();
                        setCaptureSuccess(false);
                    }}
                >
                    <ThemedText>New Chance</ThemedText>
                </TouchableOpacity>
            </View>
        </GestureDetector>
    );
}