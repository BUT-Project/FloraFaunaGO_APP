import React from "react";
import { View, Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

type CrossPlatformBlurProps = {
  intensity?: number; // Permet d'ajuster le blur sur iOS
  androidIntensity?:number;
  style?: any; // Permet d'ajouter des styles supplémentaires
};

export default function CrossPlatformBlur({ intensity = 30, androidIntensity=0.7, style }: CrossPlatformBlurProps) {
  if (Platform.OS === "ios") {
    return <BlurView intensity={intensity} style={style} />;
  }
  // Android : Overlay semi-transparent
  return <View style={[{backgroundColor:`rgba(0,0,0,${androidIntensity})`}, style,]} />;
}
