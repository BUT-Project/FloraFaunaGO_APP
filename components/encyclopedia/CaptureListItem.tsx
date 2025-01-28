import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import Capture from "@/model/domain/Capture";
import { Link } from "expo-router";
import { LoadingImageBackground } from '../ui/LoadingImageBackground';

type CaptureListItemProps = {
    capture: Capture;
};

const { width } = Dimensions.get('window');
const itemSize = (width / 3) - 10;

export default function CaptureListItem({ capture }: CaptureListItemProps) {
    const isCaptured = React.useMemo(() => capture.capturesDetails.length > 0, [capture]);

    return (
        <Link
            href={{ params: { id: capture.id.toString() }, pathname: "/(encyclopedia)/[id]" }}
            asChild
        >
            <TouchableOpacity>
                <ThemedView style={styles.container}>
                    <LoadingImageBackground
                        source={{ uri: capture.specie.image }}
                        containerStyle={styles.image}
                        width={itemSize}
                        height={itemSize}
                        imageStyle={styles.image}
                    >
                        {/* Ajout de la superposition conditionnelle */}
                        {!isCaptured && <ThemedView style={styles.overlay} />}
                        
                        <ThemedText style={styles.name}>
                            {capture.specie.name}
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
    },
    imageStyle: {
        borderRadius: 10,
    },
    name: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        padding: 5,
        textAlign: 'center',
        borderRadius: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        borderRadius: 10, 
    },
});