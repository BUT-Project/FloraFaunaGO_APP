import React from "react";
import {ScrollView, FlatList, StyleSheet, ActivityIndicator, Dimensions} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import CaptureListItem from "@/components/encyclopedia/CaptureListItem";
import CaptureDetails from "@/components/encyclopedia/CaptureDetails";
import PagerView from 'react-native-pager-view';
import SpeciesImagePager from "@/components/encyclopedia/SpeciesImagePager";
import { useGetCaptureById } from "@/hooks/useGetCaptureById";
import { SafeView } from "@/components/ui/SafeView";
import { ExtendableMap } from "@/components/ui/ExtendableMap";
import { useGetCaptureByFamily } from "@/hooks/useGetCaptureByFamily";
import { ExtendableText } from "@/components/encyclopedia/ExtendableText";

interface SpeciesDetailScreenProps {
    captureId: number;
}

const width = Dimensions.get('screen').width;

export default function SpeciesDetailScreen({captureId}: SpeciesDetailScreenProps) {

    const { capture,isLoading,error} = useGetCaptureById(captureId);
    const { captures:family,isLoading:isFamLoading,fetchMoreData,error:errorFam,isListEnd,isLoadingMore} = useGetCaptureByFamily(capture?.specie.family);
    const oldestCapture = React.useMemo(() =>  {
        if(capture){
            if(capture.capturesDetails?.length > 0 ){
                return capture.capturesDetails?.reduce((oldest, current) => {
                    return current.date < oldest.date ? current : oldest;
                })
            }
        }
        else return null;
    },[capture?.capturesDetails]);

    if(error){
        console.error(error);
    }
    if(errorFam){
        console.error(errorFam);
    }
    if(isLoading){
        return(
            <ThemedView style={styles.container}>
                <ActivityIndicator  size={'large'}/>
            </ThemedView>
        );
    }
    if(!capture){
        return(
            <ThemedView style={styles.container}>
                <ThemedText type={'subtitle'}>Espèce introuvalble...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <SafeView>
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
                        <ExtendableText text={capture.specie.description} style={styles.descContainer} textStyle={styles.description} />
                        <ExtendableMap locations={capture.specie.locations} mapStyle={styles.map} style={styles.mapContainer}/>
                    </ThemedView>
                    <ThemedView style={styles.section}>
                        <ThemedText type={"defaultSemiBold"}>Famille :</ThemedText>
                        { isFamLoading ?
                            <ThemedView>
                                <ActivityIndicator size={'small'} />
                            </ThemedView>
                            :
                            <FlatList
                                data={family}
                                keyExtractor={(item) => `FamilyMember-${item.id}`}
                                renderItem={(capture) => (
                                    <CaptureListItem capture={capture.item}/>
                                )}
                                ListEmptyComponent={()=>(
                                    <ThemedView style={styles.emptyFam}>
                                        <ThemedText>Aucune espèce trouvée</ThemedText>
                                    </ThemedView>
                                )}
                                ListFooterComponent={()=>(
                                    <ThemedView>
                                        {isListEnd && <ThemedText>Pas de capture en plus pour le moment. </ThemedText>}
                                        {isLoadingMore && <ActivityIndicator size={"small"} />}
                                    </ThemedView>
                                )}
                                onEndReached={fetchMoreData}
                                onEndReachedThreshold={0.5}
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                            />
                        }

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
        </SafeView>

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
        gap:10,
        padding:5,
        paddingHorizontal:10,
        borderBottomWidth:1,
    },
    halfVerticalContainer:{
        flexDirection:"column",
        justifyContent:"flex-start",
        width:"50%"
    },
    descContainer:{
        width:(width/2)-15,
        padding:5,
        borderRadius:15,
        aspectRatio:1,
        overflow:"hidden",
        backgroundColor:"#000",
    },
    description:{
        color:"#FFF",
    },
    mapContainer:{
        width:(width/2)-15,
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
        flexWrap:"wrap"
    },
    emptyFam:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
});