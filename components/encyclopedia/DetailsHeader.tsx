import React, {useCallback, useMemo, useRef, useState} from "react";
import {ColorSchemeName, Dimensions, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import Carousel from "react-native-snap-carousel";
import {Ionicons} from "@expo/vector-icons";
import {ThemedText,ThemedView} from "@/components/ui/themed";
import {LoadingImageBackground} from "../ui/LoadingImageBackground";
import {Colors} from "@/constants/Colors";
import {useRouter} from "expo-router";
import {
    Capture,
    Specie
} from '@/model/domain';
import { LinearGradient } from "expo-linear-gradient";

type CarouselItem = {
    key: string;
    image: string;
};

type SpeciesImageCarouselProps = {
    capture: Capture | null;
    specie: Specie;
};

type TabBarButtonProps = {
    title: string;
    index: number;
    snapTo: (index: number) => void;
    isSelected: boolean;
    colorSheme: ColorSchemeName;
};

const TabBarButton = ({ title, index, snapTo, isSelected = false, colorSheme }: TabBarButtonProps) => (
    <TouchableOpacity 
        onPress={() => snapTo(index)}
        style={[styles.tabButton, isSelected && { borderTopColor: Colors[colorSheme??"light"].card }]}
    >
        <ThemedText style={isSelected && {color:Colors[colorSheme??"light"].card,fontWeight:"bold",}}>
            {title}
        </ThemedText>
    </TouchableOpacity>
);


const { width } = Dimensions.get("window");

export default function DetailsHeader({ capture ,specie}: SpeciesImageCarouselProps) {

    const router = useRouter();

    const colorSheme = useColorScheme();
    const [activeSlide, setActiveSlide] = useState(0);
    const carouselRef = useRef<Carousel<any>>(null);
    const carouselData = useMemo<CarouselItem[]>(() => {
        const items: CarouselItem[] = [
            { key: "1", image: specie.image },
        ];
        if (capture?.photo) {
            items.push({ key: "2", image: capture.photo});
        }
        return items;
    }, [capture,specie.image]);

    // RenderItem pour le carousel
    const renderItem = ({ item }: { item: CarouselItem }) => (
        <LoadingImageBackground
            style={styles.image}
            width={width}
            height={width * 9 / 16}
            source={{ uri: item.image }}
            isCaptured={capture != null}
        >
            <LinearGradient colors={['rgba(0,0,0,0.1)','rgba(0,0,0,0.6)']} style={styles.overlay}>
                <ThemedView style={styles.infoChip}>
                    <ThemedText type={'subtitle'} style={styles.text}>{specie.name}</ThemedText>
                    <ThemedText style={[styles.text, styles.scientificName]}>{specie.scientificName}</ThemedText>
                </ThemedView>
            </LinearGradient>
       
        </LoadingImageBackground>
    );

    const snapTo = useCallback((index:number)=>carouselRef.current?.snapToItem(index),[carouselRef]);

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
            {capture?.photo && (
                <ThemedView style={styles.tabBar}>
                    <TabBarButton 
                        title="ILLUSTRATION"
                        index={0}
                        snapTo={snapTo}
                        isSelected={0===activeSlide}
                        colorSheme={colorSheme}
                    />
                    <TabBarButton 
                        title="VOTRE PHOTO"
                        index={1}
                        snapTo={snapTo} 
                        isSelected={1===activeSlide}
                        colorSheme={colorSheme}
                    />            
                </ThemedView>
            )}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={30} color="#fff" />
            </TouchableOpacity>
          
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        elevation:5,
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowOpacity:0.25,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },
    image: {
        width: width,
        height: width * 9 / 16,
        alignItems: "flex-start",
        justifyContent: "flex-end",
    },
    infoChip: {
        margin: 5,
        padding: 5,
        textAlign: "center",
        backgroundColor:"transparent"
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
    },
    tabBar:{
        flexDirection:"row",
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
    },
    tabButton:{
        flex:1,
        padding:7,
        justifyContent:"center",
        alignItems:"center",
        borderTopWidth:3,
        borderTopColor:Colors.light.tabIconDefault
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent:"flex-end",
        alignItems:"flex-start",

    },
});