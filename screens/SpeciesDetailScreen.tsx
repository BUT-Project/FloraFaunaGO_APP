import React, {useMemo} from "react";
import {ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet} from "react-native";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import SpecieListItem from "@/components/encyclopedia/SpecieListItem";
import CaptureDetails from "@/components/encyclopedia/CaptureDetails";
import SpeciesImagePager from "@/components/encyclopedia/SpeciesImagePager";
import {ExtendableMap} from "@/components/ui/ExtendableMap";
import {useGeSpecieByFamily} from "@/hooks/viewModels/useGeSpecieByFamily";
import {ExtendableText} from "@/components/encyclopedia/ExtendableText";
import {useAuthStore} from "@/context/zustand/strore/useAuthStore";
import Capture from "@/model/domain/Capture";
import Specie from "@/model/domain/Specie";

interface SpeciesDetailScreenProps {
    capture: Capture | null;
    specie: Specie;
}

const {width} = Dimensions.get('window');
const itemSize = (width / 3) - 10;

export default function SpeciesDetailScreen({specie,capture}: SpeciesDetailScreenProps) {

    const {
        captures: family,
        isLoading: isFamLoading,
        fetchMoreData,
        error: errorFam,
        isListEnd,
        isLoadingMore
    } = useGeSpecieByFamily(specie.family, capture?.id);
    const user = useAuthStore((state) => state.user);
    if (!user) {
        throw new Error("User not found")
    }
    // [Dave] [TODO] should not do that

    const capturedSpecie = user.captures;

    const isCaptured = useMemo(() => capture != null, [capture]);

    const oldestCapture = React.useMemo(() => {
        if (capture) {
            if (capture.capturesDetails?.length > 0) {
                return capture.capturesDetails?.reduce((oldest, current) => {
                    return current.date < oldest.date ? current : oldest;
                })
            }
        } else return null;
    }, [capture?.capturesDetails]);

    if (errorFam) {
        console.error(errorFam);
    }
    return (
            <ScrollView>
                <ThemedView style={styles.container}>
                    <SpeciesImagePager capture={capture} specie={specie}/>
                    <ThemedView style={[styles.section, {gap: 5}]}>
                        <ThemedView style={styles.row}>
                            <ThemedView style={styles.halfVerticalContainer}>
                                <ThemedView style={styles.infoRow}>
                                    <ThemedText>Reigne :</ThemedText>
                                    <ThemedText
                                        style={styles.bold}>{isCaptured ? specie.kingdom.toString() : "?"}</ThemedText>
                                </ThemedView>
                                <ThemedView style={styles.infoRow}>
                                    <ThemedText>Class :</ThemedText>
                                    <ThemedText
                                        style={styles.bold}>{isCaptured ? specie.class.toString() : "?"}</ThemedText>
                                </ThemedView>

                            </ThemedView>
                            <ThemedView style={styles.halfVerticalContainer}>
                                <ThemedView style={styles.infoRow}>
                                    <ThemedText>Famille :</ThemedText>
                                    <ThemedText
                                        style={styles.bold}>{isCaptured ? specie.family.toString() : "?"}</ThemedText>
                                </ThemedView>
                                <ThemedView style={styles.infoRow}>
                                    <ThemedText>Régime :</ThemedText>
                                    <ThemedText
                                        style={styles.bold}>{isCaptured ? specie.diet.toString() : "?"}</ThemedText>
                                </ThemedView>
                            </ThemedView>
                        </ThemedView>

                        <ThemedView style={styles.infoRow}>
                            <ThemedText>Habitat :</ThemedText>
                            <ThemedText style={styles.bold}>
                                {isCaptured ? specie.habitat.climate.toString() : "?"},
                                {isCaptured ? specie.habitat.zone : "?"}
                            </ThemedText>
                        </ThemedView>

                    </ThemedView>

                    <ThemedView style={styles.sectionRow}>
                        <ExtendableText
                            text={isCaptured ? specie.description : "Capturez-le pour en apprendre plus ! 🧐"}
                            style={styles.descContainer}
                            textStyle={styles.description}
                        />
                        <ExtendableMap locations={specie.locations} mapStyle={styles.map}
                                       style={styles.mapContainer}/>
                    </ThemedView>
                    <ThemedView style={styles.section}>
                        <ThemedText type={"defaultSemiBold"}>Famille :</ThemedText>
                        {isFamLoading ?
                            <ThemedView>
                                <ActivityIndicator size={'small'}/>
                            </ThemedView>
                            :
                            <FlatList
                                data={family}
                                keyExtractor={(item) => `FamilyMember-${item.id}`}
                                renderItem={(specie) => (
                                        <SpecieListItem specie={specie.item}
                                                        captureId={capturedSpecie.find(captureIn => captureIn.specie.id === specie.item.id)?.id ?? null} />
                                    )
                                }
                                ListEmptyComponent={() => (
                                    <ThemedView style={styles.emptyFam}>
                                        <ThemedText>Aucune espèce trouvée</ThemedText>
                                    </ThemedView>
                                )}
                                ListFooterComponent={() =>
                                    family.length > 0 && (
                                        <ThemedView style={styles.footerFam}>
                                            {isListEnd &&
                                                <ThemedText style={{textAlign: "center"}}>Pas plus de capture pour le
                                                    moment.</ThemedText>}
                                            {isLoadingMore && <ActivityIndicator size={"small"}/>}
                                        </ThemedView>
                                    )
                                }
                                onEndReached={fetchMoreData}
                                onEndReachedThreshold={0.5}
                                showsHorizontalScrollIndicator={false}
                                horizontal={true}
                            />
                        }

                    </ThemedView>
                    {( capture && capture.capturesDetails.length > 0) ?
                        <>
                            <ThemedView style={styles.section}>
                                <ThemedText type={"defaultSemiBold"}>Vos captures :</ThemedText>
                                <FlatList
                                    data={capture.capturesDetails}
                                    renderItem={({item}) => (
                                        <CaptureDetails captureDetail={item}/>
                                    )}
                                    keyExtractor={(item) => `CaptureDetail-${item.id}`}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />


                            </ThemedView>
                            {oldestCapture &&
                                <ThemedText style={styles.captureDate}>Date de capture
                                    : {oldestCapture.date.toLocaleDateString()}</ThemedText>
                            }
                        </>
                        :
                        <ThemedView style={styles.section}>
                            <ThemedText style={styles.captureDate}>Vous n'avez pas encore capturé cette espèce. Regardez
                                la carte plus haut pour voir où vous pouvez le trouver !</ThemedText>
                        </ThemedView>
                    }
                </ThemedView>

            </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flex: 1,
    },
    section: {
        gap: 7,
        padding: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    sectionRow: {
        flexDirection: "row",
        gap: 10,
        padding: 5,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    halfVerticalContainer: {
        flexDirection: "column",
        gap: 5,
        justifyContent: "flex-start",
        width: "50%"
    },
    descContainer: {
        width: (width / 2) - 15,
        padding: 5,
        borderRadius: 15,
        aspectRatio: 1,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    description: {
        color: "#FFF",
    },
    mapContainer: {
        width: (width / 2) - 15,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: "hidden"
    },
    map: {
        width: "100%",
        height: "100%",
    },
    capturesList: {
        width: "100%",
        aspectRatio: 16 / 9
    },
    captureDate: {
        textAlign: "center",
        alignSelf: "center",
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        gap: 5,
    },
    bold: {
        fontWeight: "600",
        flexWrap: "wrap"
    },
    emptyFam: {
        width: width,
        justifyContent: "center",
        alignItems: "center"
    },
    footerFam: {
        margin: 5,
        width: itemSize,
        height: itemSize,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 10,
    },
});