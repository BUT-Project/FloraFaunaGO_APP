import React from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraType} from "expo-camera";
import Animated from 'react-native-reanimated';

export interface CameraControlsProps {
    facing: CameraType;
    toggleCameraFacing: () => void;
    handleCapturePress: () => void;
    handleCaptureRelease: () => void;
    isLoading?: boolean;
    zoom: number;
    setZoom: (zoom: number) => void;
};

export default function CameraControls(props: CameraControlsProps) {
    const {facing, toggleCameraFacing, handleCapturePress, handleCaptureRelease, isLoading, zoom, setZoom} = props;

    const [isZoom,setIsZoom] = React.useState(false);
    return (
            <View style={styles.container}>
                <View style={styles.part}>
                    <TouchableOpacity style={styles.flipButton} disabled={isLoading} onPress={toggleCameraFacing}>
                        <Ionicons name={facing === 'back' ? 'camera-reverse' : 'camera'} size={30} color="#fff"/>
                    </TouchableOpacity>
                </View>
               <View style={styles.part}>
                    <TouchableOpacity style={styles.captureButton} disabled={isLoading} onPress={handleCapturePress}
                                  onPressOut={handleCaptureRelease}>
                    {isLoading ?  
                        <ActivityIndicator size="large" color="#fff"/> 
                        :
                        <View style={styles.captureButtonInner}/>
                    }
                    </TouchableOpacity>
               </View>
               <View style={styles.part}>
                    <View>
                        <TouchableOpacity style={styles.zoomButton} onPress={() => setIsZoom(!isZoom)}>
                            <Ionicons name={ isZoom ? "close" : "search"} size={30} color="#fff" />
                        </TouchableOpacity>
                         {isZoom && (
                             <View style={styles.zoomControls}>
                                <TouchableOpacity onPress={() => setZoom(Math.max(0, zoom - 0.1))}>
                                    <Ionicons name="remove" size={30} color="#fff" />
                                </TouchableOpacity>
                                <Text style={styles.zoomText}>{zoom?.toFixed(1) ?? 0}</Text>
                                <TouchableOpacity onPress={() => setZoom(Math.min(1, zoom + 0.1))}>
                                    <Ionicons name="add" size={30} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
               </View>
            </View>
    );
}

const styles = StyleSheet.create({
  
    container: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',   
        justifyContent: 'center',
        paddingBottom: 30,
    },
    part:{
        width: '33.3%',
        alignItems: 'center',
        justifyContent:"center",
    },
    flipButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
        borderRadius: 30,
    },
    captureButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    zoomButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
        borderRadius: 30,
    },
    zoomControls:{
        flexDirection:"column-reverse",
        position: 'absolute',
        bottom: '100%', // s'affiche au-dessus du bouton principal
        marginBottom: 5, // espace entre les deux
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding:5,
        borderRadius: 25,
        alignItems: 'center',
    },
    zoomText:{
        color: '#fff',
        fontSize: 16,
        marginHorizontal: 10,
    }
});
