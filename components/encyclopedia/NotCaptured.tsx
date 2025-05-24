import React from 'react';
import {StyleSheet } from 'react-native';
import {ThemedText, ThemedView } from '../ui/themed';
import { Specie } from '@/model/domain';
import { ExtendableMap } from '../ui/ExtendableMap';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

type NotCapturedProps = {
    specie: Specie;
};

const NotCaptured: React.FC<NotCapturedProps> = ({ specie }) => {
    const color = useThemeColor({}, 'text');
    const tint = useThemeColor({},'tint');
    return (
        <ThemedView style={styles.container}>
            <Ionicons name="help" color={color} size={50}/>
            <ThemedText style={styles.title}>Espèce non capturée</ThemedText>
            <ThemedText style={styles.message}>
                Capturez un(e) <ThemedText testID='SpecieName' style={[styles.species,{color:tint}]}>{specie.name}</ThemedText> pour en apprendre plus !
            </ThemedText>
            <ThemedText style={styles.mapLabel}>Où capturer cette espèce :</ThemedText>
            <ExtendableMap locations={specie.locations} style={styles.mapContainer}/>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        alignItems: 'center',
        justifyContent:"center",
        gap:7,
        padding: 20,
    },
    title: { 
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom:15,
    },
    message: { 
        fontSize: 16,
        textAlign: 'center',
    },
    species: { 
        fontWeight: 'bold',
    },
    mapLabel: { 
        fontSize: 15,
    },
    mapContainer: {
        width: '70%',
        aspectRatio:1,
        borderRadius: 12,
        overflow: 'hidden' 
    },
});

export default NotCaptured;