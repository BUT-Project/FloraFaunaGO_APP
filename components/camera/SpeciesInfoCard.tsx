import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Specie} from "@/model/Specie";
interface SpeciesInfoCardProps{
    specie : Specie
}
export default function SpeciesInfoCard({specie}:SpeciesInfoCardProps) {
    return (
        <View style={styles.speciesInfo}>
            <Text style={styles.speciesName}>{specie.name}</Text>
            <Text style={styles.scientificName}>{specie.scientificName}</Text>
            <Text style={styles.description}>{specie.description}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    speciesInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
    },
    speciesName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    scientificName: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#ddd',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#fff',
    },
})

