import { Dimensions, StyleSheet, FlatList } from "react-native";
import React, { useMemo } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ThemedText, ThemedView } from "@/components/ui/themed";
import { Capture ,Specie } from "@/model/domain";
import { useAuthStore } from "@/context/zustand/store/useAuthStore";
import { CaptureDetails, ExtendableText, FamilyList, DetailsHeader, NotCaptured } from "@/components/encyclopedia";
import { ExtendableMap } from "@/components/ui/ExtendableMap";
import { Colors } from "@/constants/Colors";
import { SafeView } from "@/components/ui/SafeView";

const {width} = Dimensions.get('window');

interface SpeciesDetailScreenProps {
    capture: Capture | null;
    specie: Specie;
};

const SpeciesDetailScreen = ({capture,specie}:SpeciesDetailScreenProps) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useSharedValue(0);

    const user = useAuthStore((state) => state.user);
    if (!user) {
        throw new Error("User not found")
    }
    // [Dave] [TODO] should not do that

    const capturedSpecie = user.captures;

    const isCaptured = useMemo(() => capture != null, [capture]);

    const oldestCapture = useMemo(() => {
        if (capture) {
            if (capture.capturesDetails?.length > 0) {
                return capture.capturesDetails?.reduce((oldest, current) => {
                    return current.date < oldest.date ? current : oldest;
                })
            }
        } else return null;
    }, [capture?.capturesDetails]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollOffset.value = event.contentOffset.y;
        },
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
            <ThemedText type={"defaultSemiBold"}>Classification scientifique :</ThemedText>
            <ThemedView style={styles.row}>
                <ThemedView style={styles.halfVerticalContainer}>
                    <ThemedText>Reigne :<ThemedText style={styles.bold}> {specie.kingdom}</ThemedText></ThemedText>
                    <ThemedText>Classe : <ThemedText style={styles.bold}>{specie.class}</ThemedText></ThemedText>
                </ThemedView>
                <ThemedView style={styles.halfVerticalContainer}>
                    <ThemedText>Famille :  <ThemedText style={styles.bold}>{specie.family.toString()}</ThemedText></ThemedText>
                    <ThemedText>Régime : <ThemedText style={styles.bold}>{specie.diet.toString()}</ThemedText></ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedText>
                Habitat : <ThemedText style={styles.bold}> {specie.habitat.climate}, {specie.habitat.zone}</ThemedText>
            </ThemedText>
        </ThemedView>
        <ThemedView style={styles.sectionRow}>
            <ExtendableText
                text={specie.description}
                style={styles.descContainer}
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
        paddingVertical: 5,
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
        paddingVertical: 5,
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
        backgroundColor: Colors.light.surface,
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
    bold: {
        fontWeight: "600",
        flexWrap: "wrap"
    },
});