import {Dimensions, StyleSheet} from 'react-native';
import {ThemedView,ThemedText} from "@/components/ui/themed";
import CaptureDetail from "@/model/domain/CaptureDetail";
import {ExtendableMap} from '../ui/ExtendableMap';

type CaptureDetailsProps={
    captureDetail:CaptureDetail
}
const { width } = Dimensions.get("window");
const itemWidth = width - 30 //Item margin + Section padding
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
        margin:5,
        padding:5,
        paddingHorizontal:10,
        borderRadius: 15,
        borderWidth:1,
        height:itemWidth * 9/16,
        width:itemWidth,
        overflow: 'hidden',
        alignItems:"flex-start",
        flexDirection:"row",
    },
    locationContainer:{
        width:"50%",
        gap:3,
    },
    mapContainer:{
        width:"95%",
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