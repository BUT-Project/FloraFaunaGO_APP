import {useCallback, useRef, useState} from "react";
import { Alert, ViewStyle,StyleProp,StyleSheet, TouchableOpacity } from "react-native";
import {useCamera} from "@/components/camera/hooks";
import {ThemedView,ThemedText} from "@/components/ui/themed";
import {CameraView} from "expo-camera";
import CameraControls from "@/components/camera/CameraControls";
import { useIsFocused } from '@react-navigation/native';

export interface CustomCameraViewProps {
    setBase64Image: (base64: string | null) => void;    
    setCapturedImage: (image: string | null) => void;
    style? : StyleProp<ViewStyle>;
};

const CustomCameraView = ({setBase64Image,setCapturedImage,style}:CustomCameraViewProps) => {
    const isFocused = useIsFocused();

    const {facing, toggleCameraFacing, permission, requestPerm} = useCamera();
    const cameraRef = useRef<CameraView>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
   
    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);

    const handleCapturePress = async () => {
        setIsLoading(true);
        const shouldUseMock = __DEV__ && (!isCameraReady || !cameraRef.current);
        
        if ((!isCameraReady || !cameraRef.current) && !shouldUseMock) {
            Alert.alert('Camera not ready or already capturing');
            return;
        }
        try {
            let photo;
            if (shouldUseMock) {
                // ✅ Image factice pour les tests en développement
                photo = {
                    uri: 'https://via.placeholder.com/300.png?text=Mock+Image',
                    base64: "dazpdoazopdazpodkoazp", 
                };
            } else {
                photo = await cameraRef.current?.takePictureAsync({ base64: true });
            }
            setCapturedImage(photo?.uri ?? null);
            setBase64Image(photo?.base64 ?? null);
        } catch (error) {
            console.error('Error capturing image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if(!permission){
        return (
            <ThemedView style={[styles.container,style]}>
                <ThemedText>Récupération des permissions</ThemedText>
            </ThemedView>
        );
    }
    if (permission && !permission.granted) {
        return (
            <ThemedView style={[styles.container,style]}>
                <ThemedText style={styles.message}>Nous avons besoin de votre permission pour utiliser la caméra de l'appareil.</ThemedText>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPerm}>
                    <ThemedText style={styles.permissionButtonText}>Accorder la permission</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    };
    
    return (
        <ThemedView style={[styles.container,style]}>
             {isFocused && (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}  onCameraReady={handleCameraReady}>
                    <CameraControls
                        facing={facing}
                        handleCapturePress={handleCapturePress}
                        toggleCameraFacing={toggleCameraFacing}
                        handleCaptureRelease={()=>{}}
                        isLoading={isLoading}
                    />
                </CameraView> 
            )}
        </ThemedView>       
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        marginBottom: 20,
    },
    permissionButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
});

export default CustomCameraView;