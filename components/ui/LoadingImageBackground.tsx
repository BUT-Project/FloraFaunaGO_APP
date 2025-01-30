import React, { useState } from "react";
import { ImageBackground, type ImageBackgroundProps } from "react-native";
import Skeleton from "./Skeleton";

export type LoadingImageBackgroundProps = ImageBackgroundProps & {
    children: any;
    width: number;
    height: number;
};

export const LoadingImageBackground = ({ 
    children, 
    width, 
    height, 
    source, // L'image principale passée en props
    ...props 
}: LoadingImageBackgroundProps) => {
    const [loading, setLoading] = useState(true);
    const [imageSource, setImageSource] = useState(source); // Stocke l'image actuelle
    const defaultImage = require("@/assets/images/AnimalImageNotFound.png");

    return (
            <ImageBackground
                source={imageSource} // Image actuelle (par défaut la source initiale)
                onLoadEnd={() => setLoading(false)}
                onError={() => { 
                    setImageSource(defaultImage); // Bascule vers l'image de secours
                }}
                {...props}
            >
                {loading && <Skeleton width={width} height={height}/>}
                {children}
            </ImageBackground>
    );
};
