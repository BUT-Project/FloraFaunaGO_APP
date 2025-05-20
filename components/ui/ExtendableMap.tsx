import React, {useMemo, useState} from 'react';
import {Dimensions, Modal, Pressable, StyleProp, StyleSheet, TouchableHighlight, ViewStyle} from 'react-native';
import MapView, {Marker} from "react-native-maps";
import {ThemedView} from '@/components/ui/themed/ThemedView';
import {Ionicons} from '@expo/vector-icons';
import Location from "@/model/domain/Location";
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils';

const { width } = Dimensions.get('window');

export type ExtendableMapProps = { 
    locations: Location[],
    mapStyle?: StyleProp<ViewStyle>,
    style?: StyleProp<ViewStyle>
}

export function ExtendableMap({ locations, mapStyle, style }: ExtendableMapProps) {
    const [isExtended, setIsExtended] = useState(false);

    const initialRegion = useMemo(() => ({
        longitude: locations[0]?.longitude,
        latitude: locations[0]?.latitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    }), [locations]);

    const markers = useMemo(() => locations.map((loc, index) => (
        <Marker
            coordinate={{
                longitude: loc.longitude,
                latitude: loc.latitude,
            }}
            key={`Marker-${index}`}
        />
    )), [locations]);

    return (
        <>
                <ThemedView style={[styles.container,style]}>
                    <TouchableHighlight onLongPress={() => setIsExtended(true)} style={{flex:1}}>
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
    }
});