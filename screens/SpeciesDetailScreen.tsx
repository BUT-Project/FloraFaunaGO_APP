import React from "react";
import {ScrollView, FlatList, StyleSheet} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import CaptureListItem from "@/components/encyclopedia/CaptureListItem";
import Specie from "@/model/Specie";
import Capture from "@/model/Capture";
import Habitat from "@/model/Habitat";
import {Climate} from "@/model/Climate";
import {Diet} from "@/model/Diet";
import {Kingdom} from "@/model/Kingdom";
import {Class} from "@/model/Class";
import {Family} from "@/model/Family";
import CaptureDetails from "@/components/encyclopedia/CaptureDetails";
import MapView, {Marker} from "react-native-maps";
import PagerView from 'react-native-pager-view';
import SpeciesImagePager from "@/components/encyclopedia/SpeciesImagePager";

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
    const {capture} = props;
    const oldestCapture = React.useMemo(() =>  {
        if(capture.capturesDetails.length > 0 ){
             return capture.capturesDetails?.reduce((oldest, current) => {
                return current.date < oldest.date ? current : oldest;
            })
        }
    },[capture.capturesDetails]);

    return (
        <ScrollView>
            <ThemedView style={styles.container}>
                <SpeciesImagePager
                    speciePhoto={capture.specie.image}
                    specieName={capture.specie.name}
                    specieScientificName={capture.specie.scientificName}
                    userPhoto={capture.photo}
                />
                <ThemedView style={styles.sectionRow}>
                    <ThemedView style={styles.halfVerticalContainer}>
                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Reigne :</ThemedText>
                            <ThemedText style={styles.bold}>{capture.specie.kingdom.toString()}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Class :</ThemedText>
                            <ThemedText style={styles.bold}>{capture.specie.class.toString()}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Habitat :</ThemedText>
                            <ThemedText style={styles.bold}>{capture.specie.habitat.climate.toString()}, {capture.specie.habitat.zone}</ThemedText>
                        </ThemedView>

                    </ThemedView>
                    <ThemedView style={styles.halfVerticalContainer}>
                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Famille :</ThemedText>
                            <ThemedText style={styles.bold}>{capture.specie.family.toString()}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Régime :</ThemedText>
                            <ThemedText style={styles.bold}>{capture.specie.diet.toString()}</ThemedText>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.sectionRow}>
                    <ThemedView style={styles.descContainer}>
                        <ThemedText style={styles.description}>{capture.specie.description}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                longitude:capture.specie.locations[0].longitude,
                                latitude:capture.specie.locations[0].latitude,
                                latitudeDelta: 0.3,
                                longitudeDelta: 0.3,
                            }}
                        >
                            {capture.specie.locations.map((loc,index) => (
                                <Marker coordinate={{longitude:loc.longitude,latitude:loc.latitude}} key={`Marker-${index}`} />
                            ))}
                        </MapView>
                    </ThemedView>
                </ThemedView>
                <ThemedView style={styles.section}>
                    <ThemedText type={"defaultSemiBold"}>Famille :</ThemedText>
                    <FlatList
                        data={FAMILY_TEST}
                        keyExtractor={(item) => `FamilyMember-${item.id}`}

                        renderItem={(capture) => (
                            <CaptureListItem capture={capture.item}/>
                        )}
                        horizontal={true}
                    />
                </ThemedView>
                { capture.capturesDetails.length > 0 ?
                    <>
                        <ThemedView style={styles.section}>
                            <ThemedText type={"defaultSemiBold"}>Vos captures :</ThemedText>
                            <PagerView style={styles.capturesList} initialPage={0}>
                                {capture.capturesDetails.map((captureDetail) => (
                                    <CaptureDetails captureDetail={captureDetail} key={`Capture-${captureDetail.id}`}/>
                                ))}
                            </PagerView>
                        </ThemedView>
                        { oldestCapture &&
                            <ThemedText style={styles.captureDate}>Date de capture : {oldestCapture.date.toLocaleDateString()}</ThemedText>
                        }
                    </>
                    :
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.captureDate}>Vous n'avez pas encore capturé cette espèce. Regardez la carte plus haut pour voir où vous pouvez le trouver !</ThemedText>
                    </ThemedView>
            }
            </ThemedView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        gap:10,
        flex:1,
    },
    section:{
        gap:7,
        padding:7,
        paddingHorizontal:10,
        borderBottomWidth:1,
        maxHeight:500,
    },
    sectionRow:{
        flexDirection:"row",
        gap:7,
        padding:7,
        paddingHorizontal:10,
        borderBottomWidth:1,
        maxHeight:500,
    },
    halfVerticalContainer:{
        flexDirection:"column",
        justifyContent:"flex-start",
        width:"50%"
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
        aspectRatio:1,
        borderRadius:15,
        overflow:"hidden"
    },
    map:{
        width:"100%",
        height:"100%",
    },
    capturesList:{
        width:"100%",
        aspectRatio:16/9
    },
    captureDate:{
        textAlign:"center",
        alignSelf:"center",
        marginBottom:10,
    },
    infoRow:{
        flexDirection:"row",
        gap:5,
    },
    bold:{
        fontWeight:"600",
    }
});