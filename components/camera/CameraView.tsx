import {useCallback, useRef, useState} from "react";
import {Alert, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";
import {useCamera} from "@/components/camera/hooks";
import {ThemedText, ThemedView} from "@/components/ui/themed";
import {CameraView} from "expo-camera";
import CameraControls from "@/components/camera/CameraControls";
import Loading from "../ui/Loading";
import {SpecieList} from "@/dal/StubLib/Data";

export interface CustomCameraViewProps {
    setBase64Image: (base64: string | null) => void;
    setCapturedImage: (image: string | null) => void;
    style?: StyleProp<ViewStyle>;
}

const CustomCameraView = ({setBase64Image, setCapturedImage, style}: CustomCameraViewProps) => {

    const {facing, toggleCameraFacing, permission, requestPerm} = useCamera();
    const cameraRef = useRef<CameraView>(null);
    const [zoom, setZoom] = useState(0);
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
                    uri: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    base64: SpecieList[0].image
                };
            } else {
                photo = await cameraRef.current?.takePictureAsync({base64: true});
            }
            setCapturedImage(photo?.uri ?? null);
            setBase64Image(photo?.base64 ?? null);
        } catch (error) {
            console.error('Error capturing image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!permission) {
        return (<Loading style={[styles.container, style]} text="Récupération des permissions ..."/>);
    }
    if (permission && !permission.granted) {
        return (
            <ThemedView style={[styles.container, style]}>
                <ThemedText style={styles.message}>Nous avons besoin de votre permission pour utiliser la caméra de
                    l'appareil.</ThemedText>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPerm}>
                    <ThemedText style={styles.permissionButtonText}>Accorder la permission</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }


    return (
        <ThemedView style={[styles.container, style]}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                zoom={zoom}
                onCameraReady={handleCameraReady}
            />
            <CameraControls
                facing={facing}
                handleCapturePress={handleCapturePress}
                toggleCameraFacing={toggleCameraFacing}
                handleCaptureRelease={() => {
                }}
                isLoading={isLoading}
                zoom={zoom}
                setZoom={setZoom}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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