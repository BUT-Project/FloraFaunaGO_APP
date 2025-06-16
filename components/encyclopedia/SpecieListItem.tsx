import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView, ThemedText } from "@/components/ui/themed";
import { Link } from "expo-router";
import { LoadingImageBackground } from '../ui/LoadingImageBackground';
import Specie from "@/model/domain/Specie";
import { LinearGradient } from 'expo-linear-gradient';

type CaptureListItemProps = {
    specie: Specie;
    captureId: string | null;
    numColumns?: number;
};

export default function SpecieListItem({ specie, captureId, numColumns = 3 }: CaptureListItemProps) {
    const { width } = Dimensions.get('window');
    const itemSize =  useMemo(()=>(width / numColumns) - 16,[width,numColumns])
    return (
        <Link
            href={{
                params: {
                    id: specie.id.toString(),
                    specieId: specie.id.toString(),
                    capturedId: captureId?.toString() ?? undefined
                },
                pathname: "/(tabs)/(encyclopedia)/[id]"
            }}
            asChild
        >
            <TouchableOpacity>
                <ThemedView style={[styles.container, { width: itemSize, height: itemSize }]}>
                    <LoadingImageBackground
                        source={{ uri: specie.image }}
                        style={[styles.image, { width: itemSize, height: itemSize }]}
                        width={itemSize}
                        height={itemSize}
                        isCaptured={captureId !== null}
                    >
                        <LinearGradient colors={["transparent", 'rgba(0, 0, 0, 0.8)']} locations={[0.2, 0.9]}>
                            <ThemedText style={styles.name}>
                                {specie.name}
                            </ThemedText>
                        </LinearGradient>
                    </LoadingImageBackground>
                </ThemedView>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 8,
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        justifyContent: 'flex-end',
    },
    name: {
        color: 'white',
        fontWeight: "500",
        textShadowColor: "black",
        textShadowRadius: 4,
        textShadowOffset: {
            width: 0,
            height: 2,
        },
        padding: 5,
        textAlign: "center",
    },
});