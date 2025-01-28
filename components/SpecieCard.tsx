import Animated from "react-native-reanimated";
import {Image, StyleSheet, View, ViewStyle} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import React from "react";
import Specie from "@/model/domain/Specie";

interface SpecieCardProps {
    specie: Specie,
    style?: ViewStyle
}

const BORDER_RADIUS = 20;
const CARD_WIDTH = 250;
const CARD_HEIGHT = 450;

export default function SpecieCard(props: SpecieCardProps) {
    const {id, name, image, description} = props.specie;
    const formattedId = `#${id.toString().padStart(3, '0')}`;

    return (
        <Animated.View style={[styles.container, props.style]}>
            <View style={styles.cardContent}>
                <View style={styles.header}>
                    <ThemedText style={styles.name}>{name || 'Unknown'}</ThemedText>
                    <View style={styles.pvContainer}>
                        <ThemedText style={styles.pv}>PV {Math.floor(Math.random() * 100) + 50}</ThemedText>
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri: image || 'https://via.placeholder.com/200'}}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.typeContainer}>
                    <ThemedText style={styles.type}>{'Unknown Type'}</ThemedText>
                </View>
                <ThemedText style={styles.description}>{description || 'No description available.'}</ThemedText>
                <ThemedText style={styles.id}>ID: {formattedId}</ThemedText>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH + 20,
        height: CARD_HEIGHT + 20,
        borderRadius: BORDER_RADIUS,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        backgroundColor: 'white',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    pvContainer: {
        backgroundColor: '#FF5252',
        borderRadius: 12,
        padding: 4,
    },
    pv: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        padding: 8,
        aspectRatio: 1,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    typeContainer: {
        backgroundColor: '#3498DB',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    type: {
        color: 'white',
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 8,
    },
    id: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
});