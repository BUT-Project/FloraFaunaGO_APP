import React, {useCallback, useEffect, useState} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from "react-native-reanimated";
import {ThemedView} from "@/components/ui/themed";
import {Alert, Dimensions, StyleSheet, View} from "react-native";
import { CameraView } from "@/components/camera";
import ARProgressIndicator from "@/components/ARProgressIndicator";
import MainMapView from "@/components/MainMapView";
import BlurSegmented from "@/components/BluredSegmented";
import {useQuery} from "@tanstack/react-query";
import * as Location from "expo-location";
import {useRouter} from "expo-router";
import StubData from "@/dal/StubLib/StubData";
import {Specie,SuccessType} from "@/model/domain";
import {useSpeciesStore} from "@/context/zustand/store/useSpeciesStore";
import { useFocusEffect } from '@react-navigation/native';
import { processSuccessByType } from "@/shared/successHelper";
import { SafeView } from "@/components/ui/SafeView";
import {  isImageBlurry } from "@/services/imageQuality";
import {ErrorView} from "@/app/(tabs)/(encyclopedia)/[id]";

const {width: SCREEN_WIDTH} = Dimensions.get('window');
export default function HomeScreen() {
    const {speciesRepository} = StubData.getInstance();

    if (!speciesRepository) {
        return <ErrorView message="Erreur de configuration des repositories" />;
    }
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const router = useRouter();
    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            setLocation(location);
        })();
    }, []);

    
    const slideAnim = useSharedValue(0);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('camera');
    useFocusEffect(
        useCallback(() => {
            setIsCameraActive(true);
            return () => {
                setIsCameraActive(false);
            };
        }, [])
    );
    const {isLoading, isFetching, data: identifiedSpecie} = useQuery<Specie, Error>({
        queryKey: ['identifySpecie', base64Image, speciesRepository],
        queryFn: async (): Promise<Specie> => {
            if (!base64Image) throw new Error('No base64 image data');
            var spec = await speciesRepository.identifySpecies(base64Image);
            await processSuccessByType(SuccessType.PHOTO, spec);
            return spec;
        },
        enabled: !!base64Image && !!speciesRepository
    });

    const switchView = (tabName: string) => {
        const view = tabName.toLowerCase();
        if (view !== activeView) {
            setActiveView(view);
            slideAnim.value = withSpring(view === 'camera' ? 0 : -SCREEN_WIDTH, {
                damping: 20,
                stiffness: 90,
            });
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{translateX: slideAnim.value}],
    }));

    const {setCurrentImageUri, setCurrentIdentifiedSpecies} = useSpeciesStore();

    useEffect(() => {
        const verifyAndContinue = async () => {
          if (!capturedImage || isFetching || isLoading || !identifiedSpecie) return;
      
          try {
            const isBlurry = await isImageBlurry(capturedImage);
      
            if (isBlurry) {
              Alert.alert(
                "Image floue",
                "Merci de reprendre une image plus nette."
              );
              return;
            }
      
            setCurrentImageUri(capturedImage);
            setCurrentIdentifiedSpecies(identifiedSpecie);
            router.push('/capture');
          } catch (error) {
            console.error("Erreur lors de la vérification de la netteté :", error);
            // Optionnel: tu peux aussi alerter l'utilisateur ici si besoin
          }
        };
      
        verifyAndContinue();
      }, [capturedImage, isFetching, isLoading, identifiedSpecie, router]);
    return (
        <SafeView style={styles.container} disableBottomInset>
            <ThemedView style={styles.content}>
                <View style={styles.segmentedControl}>
                    <BlurSegmented tabsName={['Camera', 'Map']} onTabChange={switchView}/>
                </View>
                <Animated.View style={[styles.container, animatedStyle]}>
                    {isCameraActive
                        &&
                        <>
                            <CameraView  setBase64Image={setBase64Image} setCapturedImage={setCapturedImage}
                                         style={styles.camera}/>
                            {isFetching && (
                                <View style={styles.progressOverlay}>
                                    <ARProgressIndicator width={SCREEN_WIDTH} height={SCREEN_WIDTH}/>
                                </View>
                            )}
                            <MainMapView location={location} style={styles.map} repository={speciesRepository}/>
                        </>}
                </Animated.View>
            </ThemedView>
        </SafeView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
    segmentedControl: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    camera: {
        flex: 1,
        width: '50%',
        height: '100%'
    },
    map: {
        flex: 1,
        width: '50%',
        height: '100%',
    },
});
