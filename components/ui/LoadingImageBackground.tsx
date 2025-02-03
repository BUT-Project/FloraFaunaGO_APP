import React, { useState } from "react";
import { ImageBackground, type ImageBackgroundProps, StyleSheet } from "react-native";
import Skeleton from "./Skeleton";
import CrossPlatformBlur from "../CrossPlatformBlur";
export type LoadingImageBackgroundProps = ImageBackgroundProps & {
    children: any;
    width: number;
    height: number;
    isCaptured?:boolean;
};

export const LoadingImageBackground = ({ 
    children, 
    width, 
    height, 
    isCaptured,
    source, 
    ...props 
}: LoadingImageBackgroundProps) => {
    const [loading, setLoading] = useState(true);
    const [imageSource, setImageSource] = useState(source); 
    const defaultImage = require("@/assets/images/AnimalImageNotFound.png");

    return (
            <ImageBackground
                source={imageSource} 
                onLoadEnd={() => setLoading(false)}
                onError={() => setImageSource(defaultImage)}
                {...props}
            >
                {!loading && !isCaptured && <CrossPlatformBlur intensity={30} style={styles.blurOverlay} />}
                {loading && <Skeleton width={width} height={height}/>}
                {children}
            </ImageBackground>
    );
};

const styles = StyleSheet.create({
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
});