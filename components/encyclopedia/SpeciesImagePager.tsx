import React, { useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { LoadingImageBackground } from "../ui/LoadingImageBackground";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import Capture from '@/model/domain/Capture';


type CarouselItem = {
    key: string;
    image: string;
    label: string;
    secondLabel?: string;
};

type SpeciesImageCarouselProps = {
    capture: Capture;
    isCaptured?:Boolean | null;
};

const { width } = Dimensions.get("window");

export default function SpeciesImageCarousel({ capture,isCaptured }: SpeciesImageCarouselProps) {
    const router = useRouter();
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef<Carousel<any>>(null);
    const carouselData = useMemo<CarouselItem[]>(() => {
        const items: CarouselItem[] = [
            { key: "1", image: capture.specie.image, label: capture.specie.name, secondLabel: capture.specie.scientificName },
        ];
        if (capture.photo && isCaptured) {
            items.push({ key: "2", image: capture.photo, label: "Votre photo" });
        }
        return items;
    }, [capture]);

    // RenderItem pour le carousel
    const renderItem = ({ item }: { item: CarouselItem }) => (
        <LoadingImageBackground
            style={styles.image}
            width={width}
            height={width * 9 / 16}
            source={{ uri: item.image }}
            isCaptured={!!isCaptured}
        >
            
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>

            <ThemedView style={styles.infoChip}>
                <ThemedText type={'subtitle'} style={styles.text}>{item.label}</ThemedText>
                {item.secondLabel && <ThemedText style={[styles.text, styles.scientificName]}>{item.secondLabel}</ThemedText>}
            </ThemedView>
        </LoadingImageBackground>
    );

    return (
        <ThemedView style={styles.container}>
            <Carousel
                ref={carouselRef}
                data={carouselData}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={(index:number) => setActiveSlide(index)}
                loop={false}
                vertical={false}
            />
            <Pagination
                dotsLength={carouselData.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.dotsContainer}
                dotStyle={styles.dotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: width,
        height: width * 9 / 16,
        alignItems: "flex-start",
        justifyContent: "flex-end",
    },
    infoChip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        margin: 5,
        padding: 5,
        textAlign: "center",
        borderRadius: 10,
    },
    text: {
        color: "#fff",
    },
    scientificName: {

        fontStyle: "italic",
    },
    backButton: {
        position: "absolute",
        top: 5,
        left: 5,
        padding: 3,
        borderRadius: 5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: Colors.light.tint,
    },
    dotsContainer: {
        position: "absolute",
        top: 0,
        alignSelf: "center",
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 10, // Garde l'arrondi des bords
    },
});