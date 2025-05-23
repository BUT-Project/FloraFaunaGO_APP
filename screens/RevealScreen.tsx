import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import SpecieCard from "@/components/SpecieCard";
import Specie from "@/model/domain/Specie";
import FlipAnimationContainer from "@/components/animation/FlipAnimationContainer";
import Ionicons from "@expo/vector-icons/Ionicons";
import EntranceFlipAnimation from "@/components/animation/EntranceFlipAnimation";
import { ThemedText,ThemedView } from "@/components/ui/themed";
import { UploadContext } from "@/context/UploadContext";
import ThumbAnimationView from "@/components/ThumbAnimationView";
import { router } from "expo-router";
import { useSpeciesStore } from "@/context/zustand/store/useSpeciesStore";
import { SuccessStore } from '@/context/zustand/store/useSuccessStore';
import { SuccessType } from '@/model/domain/SuccessType';
import { processSuccessByType } from '@/shared/successHelper';

export type ThumbType = {
    main: string | null | undefined;
    anim: string | null | undefined;
};

interface RevealScreenProps {
    specie: Specie;
}

export default function RevealScreen({ specie }: RevealScreenProps) {
    const addingState = useContext(UploadContext);
    const { message, isVisibile } = SuccessStore();
    const [thumbnail, setThumbnail] = useState<ThumbType>({
        main: null,
        anim: null,
    });

    const [thumbPosition, setThumbPosition] = useState<{x: number, y: number}>({x: 0, y: 0});

    const thumbRef = useRef<Animated.View>(null);

    const thumbAnimation = useSharedValue(0);

    const animationCompleted = useSharedValue(false);
    const indicatorOpacity = useSharedValue(0);
    const indicatorScale = useSharedValue(1);

    const cardHeight = useSharedValue(1);

    const [isBackShowing, setIsBackShowing] = useState(false);

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            opacity: indicatorOpacity.value,
            transform: [{ scale: indicatorScale.value }],
        };
    });

    const handleScreenPress = () => {
        if (animationCompleted.value) {
            indicatorOpacity.value = withTiming(0, { duration: 300 });
        }
    };

    useEffect(() => {
        setThumbnail({ main: specie.image, anim: null });
        // Simulate animation completion after 3 seconds
        const timeout = setTimeout(() => {
            animationCompleted.value = true;
            indicatorOpacity.value = withTiming(1, { duration: 500 });
            indicatorScale.value = withRepeat(
                withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                -1,
                true
            );

        }, 3000);
        processSuccessByType(SuccessType.CAPTURE, specie);
        return () => clearTimeout(timeout);
    }, []);

    const cardStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: cardHeight.value }],
        };
    });
    const resetState = useSpeciesStore((state) => state.resetState);
    function addToCollection() {
        try {
            // logic to create post
            if (isBackShowing) {
                cardHeight.value = withTiming(0.4, { duration: 300 });
            }
            addingState?.setUploading(true);
            setTimeout(() => {
                addingState?.setUploading(false);
            }, 3000);
            router.replace('/(tabs)');
            resetState();

        } catch (error) {
            console.log('Error : addingState', error);
            console.log('Error : addingState', error);
        }
    }

    const onLeave = async () => {
        thumbRef.current?.measure((x, y, width, height, px, py) => {
            setThumbPosition({x: px, y: py});
        });
        setThumbnail({main: null, anim: specie.image});

        thumbAnimation.value = withTiming(
            1,
            { duration: 800, easing: Easing.bezier(0.12, 0, 0.39, 0) },
            finished => {
                if (finished) {
                    runOnJS(setThumbnail)({ main: null, anim: null });
                    runOnJS(addToCollection)();
                }
            },
        );
    };

    return (
        <ThemedView style={styles.container}
            onTouchEnd={() => runOnJS(handleScreenPress)()}
        >
            <ThumbAnimationView
                thumbnail={thumbnail}
                size={{ width: 250, height: 450 }}
                position={thumbPosition}
                customThumbView={<SpecieCard specie={specie} style={cardStyle} />}
                thumbAnimation={thumbAnimation}
            />
            {thumbnail.main ? (
                <EntranceFlipAnimation content={
                    <Animated.View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <FlipAnimationContainer
                        frontContent={
                            <ThemedView style={[styles.card]}>
                                <Animated.View style={[styles.imageContainer]}>
                                    <Ionicons name="help-circle" size={100} color="#242424" style={styles.image}/>
                                </Animated.View>
                            </ThemedView>
                        }
                        backContent={
                            <SpecieCard ref={thumbRef} specie={specie}/>}
                        onFaceChange={(isBackVisible) => {
                            setIsBackShowing(isBackVisible);
                        }}
                    />
                    </Animated.View>
                }
                />
            ) : <></>}
            <Animated.View style={[styles.indicator, indicatorStyle]}>
                <ThemedView style={styles.indicatorContent}>
                    <Ionicons name="hand-left" size={30} color="white" />
                </ThemedView>
            </Animated.View>
            {(isBackShowing && !thumbnail.anim) && (
                <TouchableOpacity
                    onPress={onLeave}
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        borderRadius: 25,
                    }}
                >
                    <ThemedText>Add to collection</ThemedText>
                </TouchableOpacity>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 250,
        height: 450,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: 'white',
        overflow: 'hidden',
        color: '#FFD700',
        backgroundColor: 'purple',
    },
    imageContainer: {
        backfaceVisibility: 'hidden',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        padding: 0,
        borderRadius: 90,
        borderWidth: 6,
        color: '#F0F0F0',
        borderColor: 'white',
    },
    indicator: {
        position: 'absolute',
        bottom: 50,
        right: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 25,
        padding: 10,
    },
    indicatorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});