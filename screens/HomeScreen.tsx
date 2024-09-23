import {useCamera} from "@/components/camera/hooks";
import { useRef, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {ThemedView} from "@/components/ui/themed/ThemedView";
import {Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import {CameraView} from "expo-camera";
import CameraControls from "@/components/camera/CameraControls";
import ARProgressIndicator from "@/components/ARProgressIndicator";
import MainMapView from "@/components/MainMapView";
import BlurSegmented from "@/components/BluredSegmented";
import {ThemedText} from "@/components/ui/themed/ThemedText";
import {useQuery} from "@tanstack/react-query";

type Specie = {
    id: string;
    name: string;
    scientificName: string;
    type: string;
    description: string;
    imageUrl: string;
    arModelUrl?: string;
    rarity: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function HomeScreen() {

    const slideAnim = useSharedValue(0);

    const {facing, toggleCameraFacing, permission, requestPerm} = useCamera();
    const cameraRef = useRef<CameraView>(null);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showProgress, setShowProgress] = useState(false);

    const [activeView, setActiveView] = useState('camera');

    const {isLoading, refetch} = useQuery<Specie, Error>({
        queryKey: ['identifySpecie'],
        queryFn: async () => {
            if (!capturedImage) throw new Error('No image URI');
            const identifySpecies = async (imageUri: string): Promise<Specie> => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            id: "1",
                            name: "Papillon Monarque",
                            scientificName: "Danaus plexippus",
                            description: "Un magnifique papillon connu pour sa migration annuelle.",
                            rarity: 8,
                            type: "insecte",
                            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Monarch_In_May.jpg" ?? imageUri
                        });
                    }, 1500);
                });
            };
            return await identifySpecies(capturedImage);
        },
        enabled: false,
    });

    const handleCapturePress = async () => {
        if(isLoading) return;
        setShowProgress(true);
        if (!cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync({base64: true});
            setCapturedImage(photo?.uri ?? null);
            await refetch();
            setShowProgress(false);
        } catch (error) {
            console.error('Error capturing image:', error);
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
                    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
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
                    <MainMapView  style={styles.map}/>
                </Animated.View>
            </ThemedView>

            {(capturedImage && !showProgress && !isLoading) && (
                /*FLow stop here for now*/
            <ThemedView style={{flex: 1, backgroundColor: 'red',...StyleSheet.absoluteFillObject}}>

            </ThemedView>
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
});
