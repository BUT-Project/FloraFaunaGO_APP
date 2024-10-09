
import {Animated, FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import Capture from "@/model/Capture";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import ScrollView = Animated.ScrollView;
import SpeciesListItem from "@/components/encyclopedia/SpeciesListItem";
import Specie from "@/model/Specie";
import Habitat from "@/model/Habitat";
import {Climate} from "@/model/Climate";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import CaptureDetails from "@/components/encyclopedia/CaptureDetails";
import MapView, {Marker} from "react-native-maps";
import {Link} from "expo-router";


interface SpeciesDetailScreenProps {
    capture: Capture
}

const eurylaimePsittacin = new Specie(1,"Eurylaime Psittacin","Psarisomus dalhousiae","L'eurylaime psittacin (Psarisomus dalhousiae) est une espèce d'oiseaux que l'on trouve dans l'Himalaya, s'étendant vers l'est à travers l'Inde du Nord-Est jusqu'en Asie du Sud-Est (Jameson, 1885). C'est la seule espèce du genre Psarisomus (Swainson, 1837). L'Eurylaime psittacin mesure environ 25 cm de longueur et pèse entre 50 et 60 grammes. Il peut être identifié par son cri aigu.",
    new Habitat("Jungle",Climate.Tropical),Diet.Herbivores,Kingdom.Animal,Class.Birds,Family.Bovids,
    [],
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Psarisomus_dalhousiae_-_Kaeng_Krachan.jpg/480px-Psarisomus_dalhousiae_-_Kaeng_Krachan.jpg");
const FAMILY_TEST = [
    new Capture(1,"",eurylaimePsittacin,[]),
    new Capture(2,"",eurylaimePsittacin,[]),
    new Capture(3,"",eurylaimePsittacin,[]),
    new Capture(4,"",eurylaimePsittacin,[]),
    new Capture(5,"",eurylaimePsittacin,[]),
]
export default function SpeciesDetailScreen(props: SpeciesDetailScreenProps) {
    const oldestCapture = props.capture.capturesDetails.reduce((oldest, current) => {
        return current.date < oldest.date ? current : oldest;
    });

    return (
            <ScrollView>
                <ThemedView style={styles.container}>
                    <Image style={styles.image} source={{uri:props.capture.specie.image}}/>
                    <ThemedView style={styles.nameContainer}>
                        <ThemedText style={styles.specieName}>{props.capture.specie.name}</ThemedText>
                        <ThemedText style={styles.specieScientificName}>{props.capture.specie.name}</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.infoContainer}>
                        <ThemedView style={styles.halfVerticalContainer}>
                            <ThemedText>Reigne : {props.capture.specie.kingdom.toString()}</ThemedText>
                            <ThemedText>Class : {props.capture.specie.class.toString()}</ThemedText>
                            <ThemedText>Habitat : {props.capture.specie.habitat.climate.toString()},{props.capture.specie.habitat.zone}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.halfVerticalContainer}>

                            <ThemedText>Famille : {props.capture.specie.family.toString()}</ThemedText>

                            <ThemedText>Régime : {props.capture.specie.diet.toString()}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    <ThemedView style={styles.mapDescContainer}>
                        <ThemedView style={styles.descContainer}>
                            <ThemedText style={styles.description}>{props.capture.specie.description}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    longitude:props.capture.specie.locations[0].longitude,
                                    latitude:props.capture.specie.locations[0].latitude,
                                    latitudeDelta: 0.3,
                                    longitudeDelta: 0.3,
                                }}
                            >
                                {props.capture.specie.locations.map((loc) => (
                                    <Marker coordinate={{longitude:loc.longitude,latitude:loc.latitude}}/>
                                ))}
                            </MapView>
                        </ThemedView>
                    </ThemedView>
                    <ThemedView style={styles.familyContainer}>
                        <ThemedText>Famille :</ThemedText>
                        <FlatList
                            data={FAMILY_TEST}
                              renderItem={(capture) => (
                                  <Link  href={{params: { id: capture.item.id.toString()}, pathname:"/(encyclopedia)/[id]" }} asChild>
                                      <TouchableOpacity>
                                          <SpeciesListItem capture={capture.item}/>
                                      </TouchableOpacity>
                                  </Link>
                              )}
                            horizontal={true}/>
                    </ThemedView>
                    <ThemedView style={styles.capturesContainer}>
                        <ThemedText>Vos captures :</ThemedText>
                        <FlatList
                            data={props.capture.capturesDetails}
                            renderItem={(captureDetail) =><CaptureDetails captureDetail={captureDetail.item}/>}
                            horizontal={true}
                        />
                    </ThemedView>

                    <ThemedText style={styles.captureDate}>Date de capture : {oldestCapture.date.toLocaleDateString()}</ThemedText>
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
        flexDirection:"row",
        paddingHorizontal:10,
        gap:5
    },
    halfVerticalContainer:{
        flexDirection:"column",
        justifyContent:"flex-start",
        width:"50%"
    },
    mapDescContainer:{
        flexDirection:"row",
        gap:10,
        paddingHorizontal:10,
        height:150,

    },
    descContainer:{
        width:"54%",
        padding:7,
        borderRadius:15,
        backgroundColor:"#000",
    },
    description:{
        color:"#FFF"
    },
    mapContainer:{
        width:"44%",
        borderRadius:15,
        overflow:"hidden"
    },
    map:{
        width:"100%",
        height:"100%",
    },
    familyContainer:{
        paddingHorizontal:10,
        gap:5,
        width:"100%"
    },
    capturesContainer:{
        paddingHorizontal:10,
        gap:5,
        width:"100%"
    },
    captureDate:{
        alignSelf:"center"
    }
});
