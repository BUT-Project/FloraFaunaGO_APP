import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Specie from "@/model/domain/Specie";

interface SpeciesInfoCardProps {
    specie: Specie;
    maxLines?: number;
}

export default function SpeciesInfoCard({ specie, maxLines = 3 }: SpeciesInfoCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.speciesInfo}>
            <Text style={styles.speciesName}>{specie.name}</Text>
            <Text style={styles.scientificName}>{specie.scientificName}</Text>

            <View>
                <Text
                    style={styles.description}
                    numberOfLines={isExpanded ? undefined : maxLines}
                >
                    {specie.description}
                </Text>

                <TouchableOpacity
                    onPress={toggleDescription}
                    style={styles.readMoreButton}
                >
                    <Text style={styles.readMoreText}>
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </Text>
                </TouchableOpacity>
            </View>
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
        lineHeight: 22,
    },
    readMoreButton: {
        marginTop: 8,
    },
    readMoreText: {
        color: '#3498db',
        fontSize: 14,
        fontWeight: 'bold',
    },
});