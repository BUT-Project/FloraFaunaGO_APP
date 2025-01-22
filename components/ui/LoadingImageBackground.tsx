import React, { useState, useRef, useLayoutEffect } from 'react';
import { View, ImageBackground, StyleSheet, type ImageBackgroundProps } from 'react-native';
import Skeleton from './Skeleton';

export type LoadingImageBackgroundProps = ImageBackgroundProps & {
    children: any;
    imageStyle?: any;
    containerStyle?: any;
    width:number;
    height:number;
};

export const LoadingImageBackground = ({ children, imageStyle, containerStyle, width, height, ...props }: LoadingImageBackgroundProps) => {
    const [loading, setLoading] = useState(true);

    const onImageLoadEnd = () => {
        setLoading(false);
    };
    return (
        <View style={[containerStyle,styles.container]}>
            {loading && (
                <Skeleton width={width} height={height}/>
            )}
            <ImageBackground
                style={[styles.image, imageStyle]}
                defaultSource={require("@/assets/images/AnimalImageNotFound.png")}
                onLoadEnd={onImageLoadEnd}
                {...props}
            >
                {!loading && children}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        overflow:"hidden",
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});