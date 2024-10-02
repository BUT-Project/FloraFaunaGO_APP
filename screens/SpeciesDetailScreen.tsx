
import {Animated, FlatList, Image, ImageBackground, StyleSheet} from "react-native";
import {SafeView} from "@/components/ui/SafeView";
import Capture from "@/model/Capture";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import ScrollView = Animated.ScrollView;

interface SpeciesDetailScreenProps {
    capture: Capture
}

export default function SpeciesDetailScreen(props: SpeciesDetailScreenProps) {

    return (
            <ScrollView>
                <ThemedView style={styles.container}>
                    <Image style={styles.image} source={{uri:props.capture.specie.image}}/>
                    <ThemedView style={styles.nameContainer}>
                        <ThemedText style={styles.specieName}>{props.capture.specie.name}</ThemedText>
                        <ThemedText style={styles.specieScientificName}>{props.capture.specie.name}</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.infoContainer}>
                        <ThemedView style={styles.horizontalInfoContainer}>
                            <ThemedText>Reigne :</ThemedText>
                            <ThemedText>{props.capture.specie.kingdom.toString()}</ThemedText>
                            <ThemedText>Classe :</ThemedText>
                            <ThemedText>{props.capture.specie.class.toString()}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.horizontalInfoContainer}>
                            <ThemedText>Famille :</ThemedText>
                            <ThemedText>{props.capture.specie.family.toString()}</ThemedText>
                            <ThemedText>Régime :</ThemedText>
                            <ThemedText>{props.capture.specie.diet.toString()}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.mapDescContainer}>
                        <ThemedView style={styles.descContainer}>
                            <ThemedText style={styles.description}>{props.capture.specie.description}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.mapContainer}>

                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.familyContainer}>
                        <ThemedText>Famille :</ThemedText>
                    </ThemedView>


                    <ThemedText style={styles.captureDate}>Date de capture...</ThemedText>
                </ThemedView>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        gap:10,
        flex:1,
    },
    image:{
        width:"100%",
        height:250,
    },
    nameContainer:{
        paddingHorizontal:10
    },
    specieName:{
        fontWeight:'bold',
        fontSize:20,
    },
    specieScientificName:{
        fontStyle:"italic"
    },

    infoContainer:{
        paddingHorizontal:10,
        gap:5
    },
    horizontalInfoContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
    },
    mapDescContainer:{
        flexDirection:"row",
        gap:10,
        padding:10,

    },
    descContainer:{
        width:"65%",
        padding:5,
        borderRadius:15,
        backgroundColor:"#000",
    },
    description:{
        color:"#FFF"
    },
    mapContainer:{
        width:"35%",
    },
    familyContainer:{
        paddingHorizontal:10,
        width:"100%"
    },
    captureDate:{
        alignSelf:"center"
    }
});
