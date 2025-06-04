import { Dimensions, StyleSheet, FlatList, useColorScheme } from "react-native";
import React, { useMemo } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedIcon, ThemedText, ThemedView } from "@/components/ui/themed";
import { Capture ,Specie } from "@/model/domain";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";
import { CaptureDetails, ExtendableText, FamilyList, DetailsHeader, NotCaptured } from "@/components/encyclopedia";
import { ExtendableMap } from "@/components/ui/ExtendableMap";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeView } from "@/components/ui/SafeView";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const {width} = Dimensions.get('window');

interface SpeciesDetailScreenProps {
    capture: Capture | null;
    specie: Specie;
};

type IconRowProps = {
    icon?: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    latin?: string;
};
const InfoRow = ({ icon, label, value, latin }: IconRowProps) => (
  <ThemedView style={styles.rowAligned}>
    {icon && <ThemedIcon name={icon} size={18}/>}
    <ThemedText>{label} : <ThemedText style={styles.bold}>{value}</ThemedText>{latin && <ThemedText style={styles.italic}> ({latin})</ThemedText>}</ThemedText>
  </ThemedView>
);


const SpeciesDetailScreen = ({capture,specie}:SpeciesDetailScreenProps) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useSharedValue(0);
    const {t} = useTranslation();
    const descBackgroundColor = useThemeColor({},"card");
    const user = useAuthStore((state) => state.user);
    const capturedSpecie = user?.captures ?? [];

    const isCaptured = useMemo(() => capture != null, [capture]);

    const oldestCapture = useMemo(() => {
        if (capture) {
            if (capture.capturesDetails?.length > 0) {
                return capture.capturesDetails?.reduce((oldest, current) =>  current.date < oldest.date ? current : oldest)
            }
        } else return null;
    }, [capture?.capturesDetails]);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    return (
    <SafeView disableBottomInset>
        <Animated.ScrollView
            ref={scrollRef}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.container}
        >
        <DetailsHeader capture={capture} specie={specie}  />
        { isCaptured ?
        <>
            <ThemedView style={styles.section}>
                <ThemedText type={"infoTitle"}>Classification :</ThemedText>
                <ThemedView style={styles.infoBlock}>
                    <InfoRow label="Règne" value={t(`kingdom.${specie.kingdom}`)} latin={specie.kingdom} />
                    <InfoRow label="Classe" value={t(`class.${specie.class}`)} latin={specie.class} />
                    <InfoRow label="Famille" value={t(`family.${specie.family}`)} latin={specie.family} />
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.section}>
                <ThemedText type={"infoTitle"}>Caractéristiques :</ThemedText>
                <ThemedView style={styles.infoBlock}>
                    <InfoRow icon="home" label="Habitat " value="" />
                    <ThemedView style={styles.infosContainer}>
                        <InfoRow icon="thermometer" label="Climat" value={t(`climate.${specie.habitat.climate}`)} />
                        <InfoRow icon="pin-outline" label="Zone" value={specie.habitat.zone} />
                    </ThemedView>
                    <InfoRow icon="leaf" label="Régime" value={t(`diet.${specie.diet}`)} latin={specie.diet} />
                </ThemedView>
            </ThemedView>
            <ThemedView style={styles.sectionRow}>
                <ExtendableText
                    text={specie.description}
                    style={[styles.descContainer,{backgroundColor:descBackgroundColor}]}
                    textStyle={styles.description}
                />
                <ExtendableMap
                    locations={specie.locations}
                    mapStyle={styles.map}
                    style={styles.mapContainer}
                    />
            </ThemedView>
            <ThemedView style={styles.section}>
                <FamilyList family={specie.family} captureId={capture?.id} userCaptures={capturedSpecie}/>
            </ThemedView>
            {( capture && capture.capturesDetails.length > 0) ?
                <>
                    <ThemedView style={styles.section}>
                        <ThemedText type={"infoTitle"}>Vos captures :</ThemedText>
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
        </>
        :
            <NotCaptured specie={specie}/>
        }
        </Animated.ScrollView>
    </SafeView>
  );
};

export default SpeciesDetailScreen;

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    section: {
        gap: 5,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    sectionRow: {
        flexDirection: "row",
        gap: 10,
        paddingTop: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    halfVerticalContainer: {
        flexDirection: "column",
        gap: 5,
        justifyContent: "flex-start",
        width: "50%"
    },
    descContainer: {
        width: (width / 2) - 15,
        aspectRatio: 1,
    },
    description: {
        color: "#FFF",
        fontSize:18,
        textShadowColor:"rgba(0, 0, 0, 0.5)",
        textShadowRadius:3,
        textShadowOffset:{
            width:0,
            height:2,
        },
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
    bold: {
        fontWeight: "600",
        flexWrap: "wrap"
    },
    italic:{
        fontStyle: "italic",
        flexWrap: "wrap"
    },
    infosContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 5,
    },
    infoBlock: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 6,
    },
    rowAligned: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

});