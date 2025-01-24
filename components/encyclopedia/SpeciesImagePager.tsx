import {Animated, Dimensions, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import { ThemedText } from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import PagerView, {
    PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {ExpandingDot} from "react-native-animated-pagination-dots";
import React from "react";
import {Colors} from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type SpeciesImagePagerProps = {
    speciePhoto: any;
    specieName:string;
    specieScientificName:string;
    userPhoto : any;
};

const width = Dimensions.get('window').width;

export default function SpeciesImagePager(props: SpeciesImagePagerProps) {
    const paginationData = [
        { key:"1" },
        { key:"2" }
    ]
    const scrollOffsetAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const positionAnimatedValue = React.useRef(new Animated.Value(0)).current;
    const inputRange = [0, paginationData.length];
    const scrollX = Animated.add(
        scrollOffsetAnimatedValue,
        positionAnimatedValue
    ).interpolate({
        inputRange,
        outputRange: [0, paginationData.length * width],
    });

    const onPageScroll = React.useMemo(
        () =>
            Animated.event<PagerViewOnPageScrollEventData>(
                [
                    {
                        nativeEvent: {
                            offset: scrollOffsetAnimatedValue,
                            position: positionAnimatedValue,
                        },
                    },
                ],
                {
                    useNativeDriver: false,
                }
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const router = useRouter();

    if(props.userPhoto)
        {
            return (
                <ThemedView style={styles.pagerContainer}>
                    <PagerView style={styles.imagesContainer} initialPage={0} onPageScroll={onPageScroll}>
                        <ImageBackground style={styles.image} source={{uri:props.speciePhoto}} key="1">
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Ionicons name={'chevron-back'} size={30} color={'#fff'}/>
                            </TouchableOpacity>
                            <ThemedView style={styles.infoChip}>
                                <ThemedText style={[styles.text,styles.specieName]}>{props.specieName}</ThemedText>
                                <ThemedText style={[styles.text,styles.specieScientificName]}>{props.specieScientificName}</ThemedText>
                            </ThemedView>
                        </ImageBackground>
                        <ImageBackground style={styles.image} source={{uri:props.userPhoto}} key="2">
                            <ThemedView style={styles.infoChip}>
                                <ThemedText style={styles.text}>Votre photo</ThemedText>
                            </ThemedView>

                        </ImageBackground>
                    </PagerView>
                    <ExpandingDot
                        data={paginationData}
                        scrollX={scrollX}
                        inActiveDotOpacity={0.6}
                        containerStyle={styles.dotsContainer}
                        activeDotColor={Colors.light.tint}
                        dotStyle={styles.dotStyle}/>
                </ThemedView>
            )
        }
    else {
        return (
            <ThemedView style={styles.imagesContainer}>
                <ImageBackground style={styles.image} source={{uri: props.speciePhoto}}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name={'chevron-back'} size={30} color={'#fff'}/>
                    </TouchableOpacity>
                    <ThemedView style={styles.infoChip}>
                        <ThemedText style={[styles.text,styles.specieName]}>{props.specieName}</ThemedText>
                        <ThemedText style={[styles.text,styles.specieScientificName]}>{props.specieScientificName}</ThemedText>
                    </ThemedView>
                </ImageBackground>
            </ThemedView>
        );
    };
};



const styles = StyleSheet.create({
    pagerContainer:{
        flex:1,
    },
    imagesContainer:{
        width:"100%",
        height:width*9/16,
    },
    image:{
        width:"100%",
        height:"100%",
        resizeMode:"contain",
        alignItems:"flex-start",
        justifyContent:"flex-end",
    },
    infoChip:{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        margin:5,
        padding: 5,
        textAlign: 'center',
        borderRadius: 10,
    },
    dotStyle:{
        width: 10,
        height: 10,
        backgroundColor: '#347af0',
        borderRadius: 5,
        marginHorizontal: 5
    },
    dotsContainer:{
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center'
    },
    text:{
        color:"#fff"
    },
    specieName:{
        fontSize:18,
        fontWeight: '600',
    },
    specieScientificName:{
        fontSize:16,
        fontStyle:"italic",
    },
    backButton:{
        position: "absolute",
        top: 0, 
        left: 0, 
        margin:5,
        padding: 1, 
        borderRadius: 5, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    }
});