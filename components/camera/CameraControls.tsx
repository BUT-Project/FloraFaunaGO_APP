import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraType} from "expo-camera";

export interface CameraControlsProps {
    facing: CameraType;
    toggleCameraFacing: () => void;
    handleCapturePress: () => void;
    handleCaptureRelease: () => void;
    isLoading?: boolean;
};

export default function CameraControls(props: CameraControlsProps) {
    const {facing, toggleCameraFacing, handleCapturePress, handleCaptureRelease, isLoading} = props;
    return (
        <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.flipButton} disabled={isLoading} onPress={toggleCameraFacing}>
                <Ionicons name={facing === 'back' ? 'camera-reverse' : 'camera'} size={30} color="#fff"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} disabled={isLoading} onPress={handleCapturePress}
                              onPressOut={handleCaptureRelease}>
                {isLoading ?  
                    <ActivityIndicator size="large" color="#fff"/> 
                    :
                    <View style={styles.captureButtonInner}/>
                }
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    cameraControls: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        marginTop: 90,
        justifyContent: 'space-between',
        padding: 30,
    },
    flipButton: {
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 12,
        borderRadius: 30,
    },
    captureButton: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
})
