import {Animated, Dimensions, Image, ImageBackground, StyleSheet} from 'react-native';
import { ThemedText } from "@/components/ui/themed/ThemedText";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import PagerView, {
    PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {ExpandingDot} from "react-native-animated-pagination-dots";
import React from "react";

type SpeciesImagePagerProps = {
    speciePhoto: any;
    userPhoto : any;
}

export default function SpeciesImagePager(props: SpeciesImagePagerProps) {
    const paginationData = [
        {
            key:"1"
        },
        {
            key:"2"
        }
    ]

    const width = Dimensions.get('window').width;
    const ref = React.useRef<PagerView>(null);
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

    if(props.userPhoto)
        return (
            <ThemedView style={styles.pagerContainer}>
                <PagerView style={styles.imagesContainer} initialPage={0} onPageScroll={onPageScroll}>
                    <Image style={styles.image} source={{uri:props.speciePhoto}} key="1"/>
                    <ImageBackground style={styles.image} source={{uri:props.userPhoto}} key="2">
                        <ThemedView style={styles.infoChip}>
                            <ThemedText style={{color:"#fff"}}>Votre photo</ThemedText>
                        </ThemedView>

                    </ImageBackground>
                </PagerView>
                <ExpandingDot data={paginationData} scrollX={scrollX} inActiveDotOpacity={0.6} containerStyle={{top:30}} dotStyle={styles.dotStyle}/>

            </ThemedView>
        )
    else
        return (
            <ThemedView style={styles.imagesContainer}>
                <Image style={styles.image} source={{uri:props.speciePhoto}} />
            </ThemedView>
            )
}



const styles = StyleSheet.create({
    pagerContainer:{
        flex:1,
    },
    imagesContainer:{
        width:"100%",
        height:250,
    },
    image:{
        width:"100%",
        height:"100%",
        alignItems:"flex-start",
        justifyContent:"flex-end",
    },
    infoChip:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        justifyContent: 'center',
        alignSelf: 'center',
    }
});