import {StyleSheet} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/CaptureDetail";
import { ExtendableMap } from '../ui/ExtendableMap';

type CaptureDetailsProps={
    captureDetail:CaptureDetail
}

export default function CaptureDetails({captureDetail}: CaptureDetailsProps){
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.infoContainer}>
                <ThemedText type={"defaultSemiBold"}>Informations :</ThemedText>
                <ThemedText>Longitude : {captureDetail.location.longitude} </ThemedText>
                <ThemedText>Latitude : {captureDetail.location.latitude} </ThemedText>
                <ThemedText>Altitude : {captureDetail.location.altitude} </ThemedText>
                <ThemedText>Shiny : {captureDetail.shiny ? "Oui" : "Non"}</ThemedText>
                <ThemedText>Date : {captureDetail.date.toLocaleDateString()}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.locationContainer}>
                <ThemedText type={"defaultSemiBold"}>Localisation:</ThemedText>
                <ExtendableMap locations={[captureDetail.location]} style={styles.mapContainer}  mapStyle={styles.map}/>
            </ThemedView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding:5,
        paddingHorizontal:10,
        borderRadius: 15,
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
        aspectRatio:1,
        borderRadius:15,
        overflow:"hidden",
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