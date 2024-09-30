import {StyleSheet, Text, View, Image, ImageBackground, Dimensions} from 'react-native';
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {Specie} from "@/app/(tabs)/encyclopedia";

type SpeciesListItemProps={
    specie:Specie
}
const { width } = Dimensions.get('window');
const itemSize = width / 3 - 15;
export default function SpeciesListItem(props: SpeciesListItemProps){
    return (
        <ThemedView style={styles.container}>
            <ImageBackground source={{uri:props.specie.image}} style={styles.image} imageStyle={styles.imageStyle}>
                <ThemedText style={styles.name}>{props.specie.name}</ThemedText>
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