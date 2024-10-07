import {StyleSheet, Dimensions} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import CaptureDetail from "@/model/CaptureDetail";

type CaptureDetailsProps={
    captureDetail:CaptureDetail
}
const { width } = Dimensions.get('window');
const widthFrame = width -24;
export default function CaptureDetails(props: CaptureDetailsProps){
    return (
        <ThemedView style={styles.container}>
            <ThemedText>Localisation:</ThemedText>
            <ThemedText>Shiny : {props.captureDetail.shiny ? "Oui" : "Non"}</ThemedText>
            <ThemedText>Date : {props.captureDetail.date.toLocaleDateString()}</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin:2,
        padding:10,
        width: widthFrame,
        borderRadius: 10,
        borderColor: "#000",
        borderWidth:2,
        overflow: 'hidden',
        alignItems:"center"
    },

})