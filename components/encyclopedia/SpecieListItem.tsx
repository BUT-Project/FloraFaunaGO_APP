import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import Capture from "@/model/domain/Capture";
import {Link} from "expo-router";
import {LoadingImageBackground} from '../ui/LoadingImageBackground';
import Specie from "@/model/domain/Specie";

type CaptureListItemProps = {
    specie: Specie;
    captureId: number|null;
};

const { width } = Dimensions.get('window');
const itemSize = (width / 3) - 10;

export default function SpecieListItem({ specie, captureId }: CaptureListItemProps) {
    return (
        <Link
            href={{ params: { specieId: specie.id.toString(), capturedId: captureId?.toString() ?? undefined}, pathname: "/(tabs)/(encyclopedia)/[id]" }}
            asChild
        >
            <TouchableOpacity>
                <ThemedView style={styles.container}>
                    <LoadingImageBackground
                        source={{ uri: specie.image }}
                        style={styles.image}
                        width={itemSize}
                        height={itemSize}
                        isCaptured={captureId !== null}
                    >                        
                        <ThemedText style={styles.name}>
                            {specie.name}
                        </ThemedText>
                    </LoadingImageBackground>
                </ThemedView>
            </TouchableOpacity>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: itemSize,
        height: itemSize,
        justifyContent: 'flex-end',
        borderRadius: 10,
    },
    name: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        padding: 2,
        textAlign: "center",
    },
});