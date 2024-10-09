import {StyleSheet, Dimensions} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/CaptureDetail";
import MapView, {Marker} from 'react-native-maps';
import {useRef} from "react";

type CaptureDetailsProps={
    captureDetail:CaptureDetail
}

export default function CaptureDetails(props: CaptureDetailsProps){
    const mapRef = useRef<MapView>(null);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.infoContainer}>
                <ThemedText>Informations :</ThemedText>
                <ThemedText>Longitude : {props.captureDetail.location.longitude} </ThemedText>
                <ThemedText>Latitude : {props.captureDetail.location.latitude} </ThemedText>
                <ThemedText>Altitude : {props.captureDetail.location.altitude} </ThemedText>
                <ThemedText>Shiny : {props.captureDetail.shiny ? "Oui" : "Non"}</ThemedText>
                <ThemedText>Date : {props.captureDetail.date.toLocaleDateString()}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.locationContainer}>
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
            </ThemedView>

        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding:5,
        paddingHorizontal:10,
        borderRadius: 15,
        borderColor: "#000",
        borderWidth:1,
        height:"100%",
        width:"100%",
        overflow: 'hidden',
        alignItems:"flex-start",
        flexDirection:"row",
    },
    locationContainer:{
      width:"50%",
        gap:3,
    },
    mapContainer:{
        width:"100%",
        borderRadius:15,
        overflow:"hidden",
        height:150,
    },
    map:{
        width:"100%",
        height:"100%",
    },
    infoContainer:{
        width:"50%",
        gap:3,
    }

})