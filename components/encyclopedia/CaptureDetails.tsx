import {StyleSheet, Dimensions} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/CaptureDetail";
import MapView, {Marker} from 'react-native-maps';
import {useRef} from "react";

type CaptureDetailsProps={
    captureDetail:CaptureDetail
}
const { width } = Dimensions.get('window');
const widthFrame = width -24;
export default function CaptureDetails(props: CaptureDetailsProps){
    const mapRef = useRef<MapView>(null);

    return (
        <ThemedView style={styles.container}>
            <ThemedText>Localisation:</ThemedText>
            <ThemedView style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        longitude: props.captureDetail.location.longitude,
                        latitude: props.captureDetail.location.latitude,
                        latitudeDelta: 0.3,
                        longitudeDelta: 0.3,
                    }}
                    showsUserLocation={true}
                >
                    <Marker
                        coordinate={{
                            longitude:props.captureDetail.location.longitude,
                            latitude:props.captureDetail.location.latitude,
                        }}

                    />
                </MapView>
            </ThemedView>
            <ThemedText>Altitude : {props.captureDetail.location.altitude} </ThemedText>
            <ThemedText>Shiny : {props.captureDetail.shiny ? "Oui" : "Non"}</ThemedText>
            <ThemedText>Date : {props.captureDetail.date.toLocaleDateString()}</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin:2,
        padding:10,
        paddingHorizontal:20,
        width: widthFrame,
        borderRadius: 15,
        borderColor: "#000",
        borderWidth:2,
        gap:3,
        overflow: 'hidden',
        alignItems:"center"
    },
    mapContainer:{
        width:"100%",
        borderRadius:15,
        overflow:"hidden",
        height:250,
    },
    map:{
        width:"100%",
        height:"100%",
    }

})