import {useCamera} from "@/components/camera/hooks";
import {useCallback, useRef, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import PreviewOverlay from "@/components/camera/PreviewOverlay";
import {CameraView} from "expo-camera";
import CameraControls from "@/components/camera/CameraControls";
import ARProgressIndicator from "@/components/ARProgressIndicator";
import MainMapView from "@/components/MainMapView";
import BlurSegmented from "@/components/BluredSegmented";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import Specie from "@/model/domain/Specie";
import {useQuery} from "@tanstack/react-query";
import StubData from "@/dal/StubLib/StubData";

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function HomeScreen() {
    const { speciesRepository } = StubData.getInstance();
    const slideAnim = useSharedValue(0);
    const {facing, toggleCameraFacing, permission, requestPerm} = useCamera();
    const cameraRef = useRef<CameraView>(null);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showProgress, setShowProgress] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [activeView, setActiveView] = useState('camera');

    const {data: identifiedSpecies, isError,isLoading, refetch} = useQuery<Specie, Error>({
        queryKey: ['identifySpecie'],
        queryFn: async () => {
            if (!speciesRepository) throw new Error('No Repository');
            if (!capturedImage) throw new Error('No image URI');
            return speciesRepository.identifySpecies(capturedImage);
        },
        enabled: false,
    });


    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);

    const handleCapturePress = async () => {
        if (isLoading || !isCameraReady || !cameraRef.current) return;

        setShowProgress(true);
        try {
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo:', photo);
            if (photo?.uri) {
                console.log('Image captured:', photo.uri);
                setCapturedImage(photo.uri);
                await refetch();
            } else {
                console.error('No photo URI received');
                throw new Error('Failed to capture image');
            }
        } catch (error) {
            console.error('Error capturing image:', error);
            // Handle the error appropriately
        } finally {
            setShowProgress(false);
        }
    };

    const switchView = (tabName: string) => {
        const view = tabName.toLowerCase();
        if (view !== activeView) {
            setActiveView(view);
            slideAnim.value = withSpring(view === 'camera' ? 0 : -SCREEN_WIDTH, {
                damping: 20,
                stiffness: 90,
            });
        }
    }

    function handleCaptureRelease() {
        if (!isLoading) {
            setShowProgress(false);
        }
    }

    const closePreview = () => {
        setCapturedImage(null);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: slideAnim.value}],
    }));

    if (permission && !permission.granted) {
        return (
            <View style={styles.container}>
                <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPerm}>
                    <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <View style={styles.segmentedControl}>
                    <BlurSegmented tabsName={['Camera', 'Map']} onTabChange={switchView}/>
                </View>
                <Animated.View style={[styles.viewContainer, animatedStyle]}>
                    <CameraView
                        style={styles.camera}
                        facing={facing}
                        ref={cameraRef}
                        onCameraReady={handleCameraReady}
                    >
                        <CameraControls
                            facing={facing}
                            toggleCameraFacing={toggleCameraFacing}
                            handleCapturePress={handleCapturePress}
                            handleCaptureRelease={handleCaptureRelease}
                        />
                    </CameraView>
                    {showProgress && (
                        <View style={styles.progressOverlay}>
                            <ARProgressIndicator width={SCREEN_WIDTH} height={SCREEN_WIDTH}/>
                        </View>
                    )}
                    <MainMapView style={styles.map}/>
                </Animated.View>
            </ThemedView>

            {(capturedImage && !showProgress && !isLoading) && (
                <PreviewOverlay
                    capturedImage={capturedImage}
                    identifiedSpecies={identifiedSpecies ?? null}
                    closePreview={closePreview}
                />
            )}
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden'
    },
    newCaptureButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignSelf: 'center',
        position: 'absolute',
        top: 400,
        right: 150,
        padding: 10,
    },
    previewOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
    },
    progressOverlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
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
    segmentedControl: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeSegment: {
        backgroundColor: '#007AFF',
    },
    viewContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '200%',
    },
    camera: {
        flex: 1,
        width: '50%',
    },
    map: {
        width: '50%',
    },
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
    speciesInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
    },
    speciesName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    scientificName: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#ddd',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#fff',
    },
    analyzing: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 24,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
});
