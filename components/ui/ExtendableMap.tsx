import React, {useMemo, useState} from 'react';
import {Dimensions, Modal, Pressable, StyleProp, StyleSheet, TouchableHighlight, ViewStyle} from 'react-native';
import MapView, {Marker} from "react-native-maps";
import {} from '@/components/ui/themed/ThemedView';
import {Ionicons} from '@expo/vector-icons';
import Location from "@/model/domain/Location";
import { ThemedText,ThemedView } from './themed';

const { width } = Dimensions.get('window');

export type ExtendableMapProps = { 
    locations: Location[],
    mapStyle?: StyleProp<ViewStyle>,
    style?: StyleProp<ViewStyle>
}

export function ExtendableMap({ locations, mapStyle, style }: ExtendableMapProps) {
    const [isExtended, setIsExtended] = useState(false);
    const hasLocations = useMemo(()=>locations.length > 0,[locations]);

    const initialRegion = useMemo(() => {
        if (!hasLocations) return undefined;
        return {
            longitude: locations[0].longitude,
            latitude: locations[0].latitude,
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
        };
    }, [locations,hasLocations]);

    const markers = useMemo(() => locations.map((loc, index) => (
        <Marker
            coordinate={{
                longitude: loc.longitude,
                latitude: loc.latitude,
            }}
            key={`Marker-${index}`}
        />
    )), [locations]);

    if (!hasLocations) {
        return (
            <ThemedView style={[styles.container,styles.noLocContainer, style]}>
                <Ionicons name="warning-sharp" color={"red"} size={50}/>
                <ThemedText>Aucune location trouvée..</ThemedText>
            </ThemedView>
        );
    }
    return (
        <>
                <ThemedView style={[styles.container,style]}>
                    <TouchableHighlight onPress={() => setIsExtended(true)} style={{flex:1}}>
                        <MapView
                            style={[styles.map,mapStyle]}
                            initialRegion={initialRegion}
                            liteMode={true}
                        >
                            {markers}
                        </MapView>
                    </TouchableHighlight>

                </ThemedView>
            <Modal animationType="fade" transparent={true} visible={isExtended}>
                <ThemedView style={styles.modal}>
                    <Pressable style={styles.closeButton} onPress={() => setIsExtended(false)}>
                        <Ionicons name={'close'} size={30} color={'#fff'} />
                    </Pressable>
                    <MapView
                        style={styles.modalMap}
                        initialRegion={initialRegion}
                        showsScale={true}
                        showsCompass={true}
                    >
                        {markers}
                    </MapView>
                </ThemedView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        width:150,
        aspectRatio:1
    },
    map:{
        flex:1
    },
    modal: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajoute une teinte semi-transparente
        paddingHorizontal:20,
    },
    modalMap: {
        width: width - 40, // Réduit la largeur pour laisser une marge
        aspectRatio:0.7, 
        borderRadius: 15,
        overflow: 'hidden',
    },
    closeButton:{
        alignSelf:"flex-end",
        padding: 5, 
        borderRadius: 5, 
    },
    noLocContainer:{
        alignItems:"center",
        justifyContent:"center",
        gap:10,
        borderWidth:1,
        borderColor:"red",
    }
});