import {useCamera} from "@/components/camera/hooks";
import {useCallback, useEffect, useRef, useState} from "react";
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
import * as Location from "expo-location";
import {useRouter} from "expo-router";
import StubData from "@/dal/StubLib/StubData";
import Specie from "@/model/domain/Specie";
import {useSpeciesStore} from "@/context/zustand/strore/useSpeciesStore";
import EventEmitter from "events";
import {SuccessList} from "@/dal/StubLib/Data";
import {Kingdom} from "@/model/domain/Kingdom";
import {Class} from "@/model/domain/Class";
import {Diet} from "@/model/domain/Diet";
import {Family} from "@/model/domain/Family";
import {TestSuccesParams} from "@/hooks/TestSuccesParams";


const {width: SCREEN_WIDTH} = Dimensions.get('window');
const eventBus = new EventEmitter();
export default function HomeScreen() {
    const { speciesRepository } = StubData.getInstance();
    const { successRepository } = StubData.getInstance();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [updateSuccesses, setUpdateSuccesses] = useState<string[]>([]);


    const router = useRouter();
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync();
            setLocation(location);
        })();
    }, []);

    const slideAnim = useSharedValue(0);

    const {facing, toggleCameraFacing, permission, requestPerm} = useCamera();
    const cameraRef = useRef<CameraView>(null);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showProgress, setShowProgress] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('camera');

    const {isLoading, refetch, data: identifiedSpecie} = useQuery<Specie, Error>({
        queryKey: ['identifySpecie'],
        queryFn: async (): Promise<Specie> => {
            if (!speciesRepository) throw new Error('No Repository');
            if (!base64Image) throw new Error('No base64 image data');
            var spec = await speciesRepository.identifySpecies(base64Image);
            await TestSucces({ name: "unlockMaîtreDesAnimaux", spec, kg: Kingdom.Animal });
            await TestSucces({ name: "unlockPêcheurExpert", spec, cl: Class.Fish });
            await TestSucces({ name: "unlockMaitreDeLair", spec, kg: Kingdom.Animal,cl:Class.Birds });
            await TestSucces({ name: "unlockChasseurDinsect", spec,cl:Class.Insects, });

            return spec
        },
        enabled: false,
    });

    const TestSucces = async  ({ name, spec, cl, kg, dt, fm }: TestSuccesParams) => {
        if (!successRepository || !spec) return;
        const success = await successRepository.getById(name);
        if (!success) return;
        if (
            (cl && cl !== spec.class) ||
            (kg && kg !== spec.kingdom) ||
            (dt && dt !== spec.diet) ||
            (fm && fm !== spec.family)
        ) {
            return; // Si une condition est fausse, on ne déclenche pas l'événement
        }
        if (success.objectif !== success.actualVal) {
            eventBus.emit(name, "");
        }
    };
    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);


    useEffect(() => {
        const listeners = SuccessList.map((success) => {

            const callback = () => {
                // Vérification de l'état de l'événement et mise à jour de `unlockedSuccesses`
                if (!updateSuccesses.includes(success.event)) {
                    setUpdateSuccesses(prev => [...prev, success.nom]);
                    console.log("Succès avancer !", ` : ${success.nom}`);
                }
                success.actualVal +=1
                successRepository?.update(success.nom,success)
            };

            // Ajout du listener
            eventBus.addListener(success.event, callback);

            return { event: success.event, callback };
        });

        return () => {
            listeners.forEach(({ event, callback }) => {
                eventBus.removeListener(event, callback);
            });
        };
    }, [updateSuccesses]); // Dépendance sur `unlockedSuccesses` pour re-exécuter l'effet lorsque l'état change


    const handleCapturePress = async () => {
        if (isLoading || !isCameraReady || !cameraRef.current) return;

        setShowProgress(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({base64: true});
            setCapturedImage(photo?.uri ?? null);
            setBase64Image(photo?.base64 ?? null);  // Store the base64 data
            if((await successRepository?.getById("unlockPhotographeAmateur"))?.objectif != (await successRepository?.getById("unlockPhotographeAmateur"))?.actualVal)
                eventBus.emit("unlockPhotographeAmateur", photo);
            await refetch();
        } catch (error) {
            console.error('Error capturing image:', error);
        }
        finally {
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
    const setCurrentImageUri = useSpeciesStore((state) => state.setCurrentImageUri);
    const setCurrentIdentifiedSpecies = useSpeciesStore((state) => state.setCurrentIdentifiedSpecies)
    useEffect(() => {
        async function updateStateAndNavigate() {
            if (capturedImage && !showProgress && !isLoading && identifiedSpecie) {
                try {
                    setCurrentImageUri(capturedImage);
                    setCurrentIdentifiedSpecies(identifiedSpecie);
                    // Navigate after state is updated
                    router.push({
                        pathname: '/capture',
                    });
                } catch (error) {
                    console.error('Error updating species state:', error);
                    // Handle error appropriately
                }
            }
        }
    
        updateStateAndNavigate();
    }, [capturedImage, showProgress, isLoading, identifiedSpecie, router,setCurrentIdentifiedSpecies,setCurrentImageUri]);

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.content}>
                <View style={styles.segmentedControl}>
                    <BlurSegmented tabsName={['Camera', 'Map']} onTabChange={switchView}/>
                </View>
                <Animated.View style={[styles.viewContainer, animatedStyle]}>
                    <CameraView style={styles.camera} facing={facing} ref={cameraRef} onCameraReady={handleCameraReady}>
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
                    <MainMapView location={location}  style={styles.map}/>
                </Animated.View>
            </ThemedView>
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
