import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import Specie from "@/model/domain/Specie";
import SpeciesInfoCard from "@/components/camera/SpeciesInfoCard";

interface PreviewOverlayProps {
    capturedImage: string;
    identifiedSpecies: Specie | null;
    closePreview: () => void;
}

const { width, height } = Dimensions.get('window');

export default function PreviewOverlay({ capturedImage, identifiedSpecies, closePreview }: PreviewOverlayProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const opacity = useSharedValue(0);
    const slideUp = useSharedValue(100);

    useEffect(() => {
        Image.prefetch(capturedImage).then(() => {
            setImageLoaded(true);
            opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
            slideUp.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
        });
    }, [capturedImage]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: slideUp.value }],
    }));

    if (!imageLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <ThemedText style={styles.loadingText}>Chargement de l'image...</ThemedText>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.previewOverlay, animatedStyle]}>
            <Image source={{uri: capturedImage}} style={styles.previewImage} resizeMode="cover" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.closeButton} onPress={closePreview} accessibilityLabel="Fermer l'aperçu">
                    <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Main Content Container */}
            <View style={styles.mainContainer}>
                {/* Species Info or Loading */}
                <View style={styles.infoSection}>
                    {identifiedSpecies ? (
                        <SpeciesInfoCard specie={identifiedSpecies} />
                    ) : (
                        <View style={styles.analyzingContainer}>
                            <ActivityIndicator size="small" color="#4CAF50" />
                            <ThemedText style={styles.analyzing}>Analyse en cours...</ThemedText>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Link href={'/(tabs)/(home)/ring'} asChild>
                        <TouchableOpacity
                            style={styles.actionButton}
                            accessibilityLabel="Combattre l'espèce"
                        >
                            <ThemedText style={styles.buttonText}>Combattre</ThemedText>
                        </TouchableOpacity>
                    </Link>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={closePreview}
                        accessibilityLabel="Nouvelle capture"
                    >
                        <ThemedText style={styles.secondaryButtonText}>
                            Nouvelle capture
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    previewOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        paddingTop: 40,
        zIndex: 2,
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    mainContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 100, // Space for top bar
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 10,
    },
    actionButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#4CAF50',
        fontSize: 16,
    },
    analyzingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        alignSelf: 'center',
    },
    analyzing: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
});