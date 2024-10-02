import {StyleSheet, Text, View, Image, ImageBackground, Dimensions} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import Capture from "@/model/Capture";

type SpeciesCapturesListItemProps={
    capture:Capture
}
const { width } = Dimensions.get('window');
const itemSize = width / 3 - 15;
export default function SpeciesListItem(props: SpeciesCapturesListItemProps){
    return (
        <ThemedView style={styles.container}>
            <ImageBackground source={{uri:props.capture.specie.image}} style={styles.image} imageStyle={styles.imageStyle}>
                <ThemedText style={styles.name}>{props.capture.specie.name}</ThemedText>
            </ImageBackground>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: itemSize,
        height: itemSize,
        justifyContent: 'flex-end',
    },
    imageStyle: {
        borderRadius: 10,
    },
    name: {
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        textAlign: 'center',
        borderRadius: 10,
    },
})